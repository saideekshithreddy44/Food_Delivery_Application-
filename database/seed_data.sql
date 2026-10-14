-- =============================================
-- Food Delivery Application - Seed Data
-- Run AFTER schema.sql
-- =============================================

USE food_delivery_db;

-- =============================================
-- SEED USERS
-- Passwords are BCrypt hash of "password123"
-- =============================================
INSERT INTO users (full_name, email, password, phone, role) VALUES
('Admin User', 'admin@foodexpress.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900000', 'ADMIN'),
('Rajesh Kumar', 'rajesh@restaurant.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900001', 'RESTAURANT_OWNER'),
('Priya Sharma', 'priya@restaurant.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900002', 'RESTAURANT_OWNER'),
('Amit Patel', 'amit@restaurant.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900003', 'RESTAURANT_OWNER'),
('Sneha Reddy', 'sneha@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900004', 'CUSTOMER'),
('Vikram Singh', 'vikram@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900005', 'CUSTOMER'),
('Ananya Gupta', 'ananya@customer.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9999900006', 'CUSTOMER');

-- =============================================
-- SEED ADDRESSES
-- =============================================
INSERT INTO addresses (street, city, state, zip_code, landmark, is_default, user_id) VALUES
('123 MG Road, Koramangala', 'Bangalore', 'Karnataka', '560034', 'Near Forum Mall', TRUE, 5),
('45 Jubilee Hills', 'Hyderabad', 'Telangana', '500033', 'Near GVK One', FALSE, 5),
('78 Connaught Place', 'New Delhi', 'Delhi', '110001', 'Near Palika Bazaar', TRUE, 6),
('56 Anna Nagar', 'Chennai', 'Tamil Nadu', '600040', 'Near VR Mall', TRUE, 7);

-- =============================================
-- SEED FOOD CATEGORIES
-- =============================================
INSERT INTO food_categories (name, description, image_url) VALUES
('Biryani', 'Aromatic rice dishes with spices and meat/vegetables', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'),
('Pizza', 'Italian flatbread with various toppings', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'),
('Burger', 'Grilled patties with buns and toppings', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'),
('Chinese', 'Indo-Chinese and authentic Chinese cuisine', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'),
('South Indian', 'Dosa, idli, uttapam and more', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400'),
('North Indian', 'Curries, naan, and tandoori dishes', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400'),
('Desserts', 'Sweet treats and beverages', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400'),
('Beverages', 'Refreshing drinks and juices', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'),
('Street Food', 'Popular Indian street snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400'),
('Salads', 'Fresh and healthy salad options', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400');

-- =============================================
-- SEED RESTAURANTS
-- =============================================
INSERT INTO restaurants (name, description, cuisine_type, address, phone, email, image_url, opening_time, closing_time, is_active, rating, total_ratings, owner_id) VALUES
('Spice Garden', 'Authentic Indian cuisine with a modern twist. Fresh ingredients and traditional recipes.', 'North Indian, South Indian', '45 Brigade Road, Bangalore', '9876543210', 'info@spicegarden.com', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600', '10:00', '23:00', TRUE, 4.5, 120, 2),
('Pizza Paradise', 'Best wood-fired pizzas in town. Italian flavors with Indian creativity.', 'Italian, Pizza', '12 Park Street, Bangalore', '9876543211', 'info@pizzaparadise.com', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', '11:00', '23:30', TRUE, 4.3, 85, 3),
('Dragon Wok', 'Sizzling Indo-Chinese and authentic Chinese dishes. Spicy and flavorful.', 'Chinese, Indo-Chinese', '78 Commercial Street, Bangalore', '9876543212', 'info@dragonwok.com', 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600', '11:30', '22:30', TRUE, 4.1, 65, 4);

-- =============================================
-- SEED FOOD ITEMS
-- =============================================

-- Spice Garden Items (Restaurant 1)
INSERT INTO food_items (name, description, price, image_url, is_available, is_vegetarian, restaurant_id, category_id) VALUES
('Chicken Biryani', 'Fragrant basmati rice layered with tender chicken, aromatic spices, and caramelized onions', 299.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', TRUE, FALSE, 1, 1),
('Mutton Biryani', 'Slow-cooked mutton with aged basmati rice, saffron, and whole spices', 399.00, 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', TRUE, FALSE, 1, 1),
('Veg Biryani', 'Garden-fresh vegetables with basmati rice, mint, and aromatic spices', 219.00, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', TRUE, TRUE, 1, 1),
('Butter Chicken', 'Tender chicken in rich, creamy tomato-butter sauce with aromatic spices', 329.00, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', TRUE, FALSE, 1, 6),
('Paneer Tikka Masala', 'Grilled paneer cubes in spiced tomato-onion gravy', 279.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', TRUE, TRUE, 1, 6),
('Dal Makhani', 'Creamy black lentils slow-cooked overnight with butter and cream', 199.00, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', TRUE, TRUE, 1, 6),
('Garlic Naan', 'Soft tandoori bread topped with garlic and butter', 59.00, 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', TRUE, TRUE, 1, 6),
('Masala Dosa', 'Crispy rice crepe filled with spiced potato masala', 149.00, 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', TRUE, TRUE, 1, 5),
('Gulab Jamun (2 pcs)', 'Soft milk dumplings soaked in rose-flavored sugar syrup', 99.00, 'https://images.unsplash.com/photo-1666190050431-b1c5e884d4e7?w=400', TRUE, TRUE, 1, 7),
('Mango Lassi', 'Thick yogurt smoothie blended with fresh mango pulp', 129.00, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400', TRUE, TRUE, 1, 8),

-- Pizza Paradise Items (Restaurant 2)
('Margherita Pizza', 'Classic pizza with fresh mozzarella, tomato sauce, and basil on thin crust', 249.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', TRUE, TRUE, 2, 2),
('Pepperoni Pizza', 'Loaded with spicy pepperoni, mozzarella, and marinara sauce', 349.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', TRUE, FALSE, 2, 2),
('BBQ Chicken Pizza', 'Smoky BBQ sauce, grilled chicken, red onions, and mozzarella', 379.00, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', TRUE, FALSE, 2, 2),
('Paneer Tikka Pizza', 'Indian-Italian fusion with tandoori paneer, peppers, and onions', 329.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', TRUE, TRUE, 2, 2),
('Classic Veg Burger', 'Crispy veggie patty with lettuce, tomato, cheese, and special sauce', 179.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', TRUE, TRUE, 2, 3),
('Chicken Zinger Burger', 'Crispy fried chicken fillet with coleslaw and spicy mayo', 229.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', TRUE, FALSE, 2, 3),
('French Fries', 'Golden crispy fries seasoned with herbs and served with ketchup', 119.00, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', TRUE, TRUE, 2, 9),
('Chocolate Brownie', 'Warm, gooey chocolate brownie with vanilla ice cream', 159.00, 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', TRUE, TRUE, 2, 7),
('Cold Coffee', 'Chilled coffee blended with ice cream and chocolate', 149.00, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', TRUE, TRUE, 2, 8),

-- Dragon Wok Items (Restaurant 3)
('Veg Manchurian', 'Crispy vegetable balls tossed in spicy Indo-Chinese sauce', 199.00, 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', TRUE, TRUE, 3, 4),
('Chicken Manchurian', 'Tender chicken pieces in tangy manchurian gravy', 249.00, 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400', TRUE, FALSE, 3, 4),
('Veg Fried Rice', 'Wok-tossed rice with fresh vegetables and soy sauce', 179.00, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', TRUE, TRUE, 3, 4),
('Chicken Fried Rice', 'Flavorful fried rice with chicken, egg, and vegetables', 219.00, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', TRUE, FALSE, 3, 4),
('Hakka Noodles', 'Stir-fried noodles with vegetables in Indo-Chinese style', 189.00, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', TRUE, TRUE, 3, 4),
('Chilli Chicken', 'Spicy dry chicken tossed with green chillies and bell peppers', 269.00, 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=400', TRUE, FALSE, 3, 4),
('Spring Rolls (4 pcs)', 'Crispy rolls stuffed with vegetables, served with sweet chilli sauce', 149.00, 'https://images.unsplash.com/photo-1539735257410-139a6a0c0012?w=400', TRUE, TRUE, 3, 9),
('Hot & Sour Soup', 'Tangy and spicy vegetable soup with tofu', 129.00, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400', TRUE, TRUE, 3, 4),
('Green Salad', 'Fresh mixed greens with cucumber, tomato, and lemon dressing', 99.00, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', TRUE, TRUE, 3, 10),
('Chocolate Momos (6 pcs)', 'Steamed dumplings filled with melted chocolate', 139.00, 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400', TRUE, TRUE, 3, 7);

-- =============================================
-- SEED REVIEWS
-- =============================================
INSERT INTO reviews (rating, comment, user_id, restaurant_id) VALUES
(5, 'Amazing biryani! The chicken was so tender and the rice was perfectly cooked. Best biryani in Bangalore!', 5, 1),
(4, 'Great food and quick delivery. The butter chicken is to die for. Would definitely order again.', 6, 1),
(4, 'Loved the pizza! Crispy crust and generous toppings. The BBQ chicken pizza is a must-try.', 5, 2),
(5, 'Best pizza place! Their Margherita is simple but perfect. Fast delivery too.', 7, 2),
(4, 'Authentic Chinese flavors. The Manchurian was excellent. Will order again soon.', 6, 3),
(3, 'Food was good but delivery took a bit long. The Hakka noodles were tasty though.', 7, 3);
