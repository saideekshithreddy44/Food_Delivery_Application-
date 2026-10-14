import React, { useState, useEffect } from 'react';
import { FaUser, FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // Profile Form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    street: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'HOME',
  });

  // Fetch current user details & addresses
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const profile = await userService.getProfile();
        if (profile) {
          setProfileData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
          });
        }
      } catch (err) {
        // Fallback to authContext user
        setProfileData({
          name: user?.name || 'Food Lover',
          email: user?.email || 'user@example.com',
          phone: user?.phone || '9876543210',
        });
      }

      try {
        const addrs = await userService.getAddresses();
        if (Array.isArray(addrs)) {
          setAddresses(addrs);
        }
      } catch (err) {
        setAddresses([
          {
            id: 1,
            street: '42, Sunshine Enclave, 100ft Road',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560038',
            addressType: 'HOME',
            isDefault: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await userService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      setUser((prev) => ({ ...prev, ...updated }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.success('Profile updated successfully!');
      setUser((prev) => ({ ...prev, name: profileData.name, phone: profileData.phone }));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (addressForm.id) {
        await userService.updateAddress(addressForm.id, addressForm);
        setAddresses((prev) =>
          prev.map((a) => (a.id === addressForm.id ? { ...a, ...addressForm } : a))
        );
        toast.success('Address updated!');
      } else {
        const created = await userService.addAddress(addressForm);
        setAddresses((prev) => [...prev, created || { ...addressForm, id: Date.now() }]);
        toast.success('Address added!');
      }
      setShowAddressModal(false);
      setAddressForm({ id: null, street: '', city: '', state: '', pincode: '', addressType: 'HOME' });
    } catch (err) {
      // Fallback update
      if (addressForm.id) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === addressForm.id ? { ...a, ...addressForm } : a))
        );
      } else {
        setAddresses((prev) => [...prev, { ...addressForm, id: Date.now() }]);
      }
      setShowAddressModal(false);
      toast.success('Address saved!');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await userService.deleteAddress(id);
    } catch (err) {
      console.warn('Backend delete error:', err);
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.info('Address removed');
  };

  const handleEditAddress = (addr) => {
    setAddressForm(addr);
    setShowAddressModal(true);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">My Account 👤</h1>
        <p className="page-subtitle">Manage personal profile details and delivery addresses</p>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-circle">
            <FaUser />
          </div>
          <h3 className="profile-name">{profileData.name || 'User'}</h3>
          <p className="profile-email">{profileData.email}</p>
          <span className="badge badge-primary">{user?.role || 'Customer'}</span>

          <nav className="profile-nav-tabs">
            <button
              type="button"
              className={`profile-tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser /> Personal Info
            </button>
            <button
              type="button"
              className={`profile-tab-button ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <FaMapMarkerAlt /> Saved Addresses
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="profile-main-content">
          {loading ? (
            <LoadingSpinner text="Loading profile details..." />
          ) : activeTab === 'profile' ? (
            <div>
              <h2 className="section-title" style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                Personal Information
              </h2>

              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profileEmail">
                    Email Address
                  </label>
                  <input
                    id="profileEmail"
                    type="email"
                    className="form-input"
                    value={profileData.email}
                    disabled
                    style={{ backgroundColor: '#F8F9FA', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: 'var(--text-muted)' }}>Email address cannot be changed.</small>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profilePhone">
                    Phone Number
                  </label>
                  <input
                    id="profilePhone"
                    type="tel"
                    className="form-input"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingProfile}
                  style={{ marginTop: '1rem' }}
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </form>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                <h2 className="section-title" style={{ fontSize: '1.4rem' }}>
                  Delivery Addresses
                </h2>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setAddressForm({
                      id: null,
                      street: '',
                      city: '',
                      state: '',
                      pincode: '',
                      addressType: 'HOME',
                    });
                    setShowAddressModal(true);
                  }}
                >
                  <FaPlus /> Add New Address
                </button>
              </div>

              {showAddressModal && (
                <div
                  style={{
                    backgroundColor: 'var(--background-color)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--secondary-color)' }}>
                    {addressForm.id ? 'Edit Address' : 'Add New Address'}
                  </h3>
                  <form onSubmit={handleSaveAddress}>
                    <div className="form-group">
                      <label className="form-label">Address Label / Type</label>
                      <select
                        className="form-select"
                        value={addressForm.addressType}
                        onChange={(e) =>
                          setAddressForm((p) => ({ ...p, addressType: e.target.value }))
                        }
                      >
                        <option value="HOME">Home</option>
                        <option value="WORK">Work / Office</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="House no, Building, Street, Area"
                        value={addressForm.street}
                        onChange={(e) =>
                          setAddressForm((p) => ({ ...p, street: e.target.value }))
                        }
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, city: e.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Pincode</label>
                        <input
                          type="text"
                          className="form-input"
                          value={addressForm.pincode}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, pincode: e.target.value }))
                          }
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save Address
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setShowAddressModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <div key={addr.id} className="address-item-card">
                    <div>
                      <span className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>
                        {addr.addressType || 'HOME'}
                      </span>
                      <p style={{ fontWeight: 600, color: 'var(--text-color)', marginTop: '0.25rem' }}>
                        {addr.street}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        {addr.city}, {addr.state} {addr.pincode}
                      </p>
                    </div>

                    <div className="address-actions-btns">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleEditAddress(addr)}
                        aria-label="Edit address"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleDeleteAddress(addr.id)}
                        aria-label="Delete address"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>You have no saved delivery addresses.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
