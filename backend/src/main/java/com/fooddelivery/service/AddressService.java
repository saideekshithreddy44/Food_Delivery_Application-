package com.fooddelivery.service;

import com.fooddelivery.dto.request.AddressRequest;
import com.fooddelivery.dto.response.AddressResponse;
import com.fooddelivery.entity.Address;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.repository.AddressRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUserId(user.getId()).stream()
                .map(AddressResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse addAddress(String email, AddressRequest request) {
        User user = getUserByEmail(email);
        List<Address> existingAddresses = addressRepository.findByUserId(user.getId());

        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault()) || existingAddresses.isEmpty();

        if (shouldBeDefault) {
            unsetExistingDefaults(existingAddresses);
        }

        Address address = Address.builder()
                .street(request.getStreet())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .landmark(request.getLandmark())
                .isDefault(shouldBeDefault)
                .user(user)
                .build();

        Address savedAddress = addressRepository.save(address);
        return AddressResponse.fromEntity(savedAddress);
    }

    @Transactional
    public AddressResponse updateAddress(String email, Long id, AddressRequest request) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to update this address");
        }

        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault());

        if (shouldBeDefault && !address.isDefault()) {
            List<Address> userAddresses = addressRepository.findByUserId(user.getId());
            unsetExistingDefaults(userAddresses);
            address.setDefault(true);
        } else if (!shouldBeDefault && address.isDefault()) {
            address.setDefault(false);
        }

        address.setStreet(request.getStreet());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZipCode(request.getZipCode());
        address.setLandmark(request.getLandmark());

        Address updatedAddress = addressRepository.save(address);
        return AddressResponse.fromEntity(updatedAddress);
    }

    @Transactional
    public void deleteAddress(String email, Long id) {
        User user = getUserByEmail(email);
        Address address = addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to delete this address");
        }

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        // If the deleted address was default, make another address default if available
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserId(user.getId());
            if (!remaining.isEmpty()) {
                Address newDefault = remaining.get(0);
                newDefault.setDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }

    @Transactional(readOnly = true)
    public AddressResponse getDefaultAddress(String email) {
        User user = getUserByEmail(email);
        return addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .or(() -> addressRepository.findByUserId(user.getId()).stream().findFirst())
                .map(AddressResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "default for user", email));
    }

    private void unsetExistingDefaults(List<Address> addresses) {
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
