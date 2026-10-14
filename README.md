# 🍔 FoodExpress - Online Food Delivery Application

A full-stack food delivery web application built with **React.js** (frontend), **Spring Boot** (backend), and **MySQL** (database).

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Test Credentials](#-test-credentials)
- [API Documentation](#-api-documentation)
- [Testing with Postman](#-testing-with-postman)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Customer Features
- ✅ User registration and login with JWT authentication
- ✅ Browse restaurants and food menus
- ✅ Search food items by name, category, price range
- ✅ Add/update/remove items from cart
- ✅ Place orders with delivery address selection
- ✅ Track order status in real-time
- ✅ View order history
- ✅ Rate and review restaurants
- ✅ Manage profile and delivery addresses

### Restaurant Owner Features
- ✅ Create and manage restaurant profile
- ✅ Add/edit/delete food items and set availability
- ✅ View incoming orders
- ✅ Accept/reject orders and update status
- ✅ Toggle restaurant open/closed

### Admin Features
- ✅ Dashboard with summary statistics
- ✅ Manage users (view, delete)
- ✅ Manage restaurants
- ✅ Manage food categories (CRUD)
- ✅ View and manage all orders

### Technical Features
- ✅ JWT-based authentication & authorization
- ✅ Role-based access control (CUSTOMER, RESTAURANT_OWNER, ADMIN)
- ✅ BCrypt password hashing
- ✅ Server-side order total calculation
- ✅ Transactional order placement
- ✅ Input validation on frontend and backend
- ✅ Global error handling
- ✅ Responsive design (mobile + desktop)
- ✅ Toast notifications for user feedback

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js 18, React Router 6, Axios |
| Backend    | Java 21, Spring Boot 3.2.5         |
| Database   | MySQL 8.0+                         |
| Security   | Spring Security, JWT (JJWT 0.12.6) |
| ORM        | Spring Data JPA, Hibernate          |
| Build      | Maven (backend), npm (frontend)     |
| Styling    | Custom CSS with modern design       |

---

## 📁 Project Structure

```
Food_Delivery_application/
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven dependencies
│   └── src/main/java/com/fooddelivery/
│       ├── FoodDeliveryApplication.java
│       ├── config/                   # CORS, App configs
│       ├── controller/               # REST API controllers (14 files)
│       ├── dto/                      # Request/Response DTOs
│       │   ├── request/              # 10 request DTOs
│       │   └── response/             # 14 response DTOs
│       ├── entity/                   # JPA entities (10 files)
│       ├── enums/                    # Enums (4 files)
│       ├── exception/                # Global exception handling
│       ├── repository/               # Data repositories (10 files)
│       ├── security/                 # JWT & Spring Security (5 files)
│       └── service/                  # Business logic (11 files)
│
├── frontend/                         # React Application
│   └── src/
│       ├── components/               # Reusable UI components (11 files)
│       ├── pages/                    # Page components (14 files)
│       ├── services/                 # API service modules (8 files)
│       ├── context/                  # Auth & Cart contexts (2 files)
│       ├── App.js                    # Main app with routing
│       └── index.js                  # Entry point
│
├── database/                         # Database scripts
│   ├── schema.sql                    # Table definitions
│   └── seed_data.sql                 # Sample test data
│
└── README.md                         # This file
```

---

## 📌 Prerequisites

Make sure you have the following installed:

| Tool    | Version    | Download Link                                    |
|---------|------------|--------------------------------------------------|
| Java    | 21+        | https://www.oracle.com/java/technologies/downloads/ |
| Maven   | 3.9+       | https://maven.apache.org/download.cgi            |
| Node.js | 18+        | https://nodejs.org/                               |
| npm     | 9+         | Comes with Node.js                                |
| MySQL   | 8.0+       | https://dev.mysql.com/downloads/                  |

---

## 🚀 Installation & Setup

### Step 1: Clone or Navigate to the Project

```bash
cd Food_Delivery_application
```

### Step 2: Set Up MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Run the schema script:

```sql
SOURCE C:/Users/anshikareddy/OneDrive/Desktop/Food_Delivery_application/database/schema.sql;
```

3. (Optional) Load sample test data:

```sql
SOURCE C:/Users/anshikareddy/OneDrive/Desktop/Food_Delivery_application/database/seed_data.sql;
```

> **Note:** The seed data creates sample users with password `password123` (BCrypt hashed), 3 restaurants, 30 food items, and 6 reviews.

### Step 3: Configure Database Connection

The backend is configured in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/food_delivery_db
spring.datasource.username=root
spring.datasource.password=root
```

If your MySQL credentials are different, update the `username` and `password` values.

### Step 4: Install Backend Dependencies

```bash
cd backend
mvn clean install -DskipTests
```

### Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## ▶ Running the Application

### Start the Backend (Port 8080)

```bash
cd backend
mvn spring-boot:run
```

The API will be available at: **http://localhost:8080**

### Start the Frontend (Port 3000)

Open a **new terminal**:

```bash
cd frontend
npm start
```

The app will open in your browser at: **http://localhost:3000**

---

## 🔐 Test Credentials

If you loaded the seed data, use these accounts:

| Role              | Email                    | Password      |
|-------------------|--------------------------|---------------|
| Admin             | admin@foodexpress.com    | password123   |
| Restaurant Owner  | rajesh@restaurant.com    | password123   |
| Restaurant Owner  | priya@restaurant.com     | password123   |
| Restaurant Owner  | amit@restaurant.com      | password123   |
| Customer          | sneha@customer.com       | password123   |
| Customer          | vikram@customer.com      | password123   |
| Customer          | ananya@customer.com      | password123   |

Or register a new account through the application.

---

## 📚 API Documentation

### Base URL: `http://localhost:8080/api`

### Authentication APIs

| Method | Endpoint         | Description           | Auth Required |
|--------|------------------|-----------------------|---------------|
| POST   | `/auth/register` | Register new user     | No            |
| POST   | `/auth/login`    | Login & get JWT token | No            |

**Register Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzM4NCJ9...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    }
  }
}
```

### User APIs

| Method | Endpoint          | Description      | Auth    |
|--------|-------------------|------------------|---------|
| GET    | `/users/profile`  | Get profile      | Any     |
| PUT    | `/users/profile`  | Update profile   | Any     |

### Address APIs

| Method | Endpoint          | Description      | Auth     |
|--------|-------------------|------------------|----------|
| GET    | `/addresses`      | Get addresses    | Customer |
| POST   | `/addresses`      | Add address      | Customer |
| PUT    | `/addresses/{id}` | Update address   | Customer |
| DELETE | `/addresses/{id}` | Delete address   | Customer |

### Restaurant APIs (Public)

| Method | Endpoint                              | Description               | Auth |
|--------|---------------------------------------|---------------------------|------|
| GET    | `/restaurants`                        | List active restaurants   | No   |
| GET    | `/restaurants/{id}`                   | Get restaurant details    | No   |
| GET    | `/restaurants/search?q=pizza`         | Search restaurants        | No   |
| GET    | `/restaurants/{id}/food-items`        | Get restaurant food items | No   |

### Restaurant Owner APIs

| Method | Endpoint                                    | Description         | Auth  |
|--------|---------------------------------------------|---------------------|-------|
| POST   | `/owner/restaurants`                        | Create restaurant   | Owner |
| PUT    | `/owner/restaurants/{id}`                   | Update restaurant   | Owner |
| GET    | `/owner/restaurants/my-restaurant`          | Get own restaurant  | Owner |
| PATCH  | `/owner/restaurants/{id}/toggle-status`     | Toggle open/closed  | Owner |
| POST   | `/owner/food-items`                         | Add food item       | Owner |
| PUT    | `/owner/food-items/{id}`                    | Update food item    | Owner |
| DELETE | `/owner/food-items/{id}`                    | Delete food item    | Owner |
| PATCH  | `/owner/food-items/{id}/toggle-availability`| Toggle availability | Owner |
| GET    | `/owner/food-items`                         | Get all own items   | Owner |
| GET    | `/owner/orders`                             | Get restaurant orders| Owner |
| PATCH  | `/owner/orders/{id}/status?status=CONFIRMED`| Update order status | Owner |

### Food Category APIs

| Method | Endpoint           | Description       | Auth  |
|--------|--------------------|-------------------|-------|
| GET    | `/categories`      | List categories   | No    |
| GET    | `/categories/{id}` | Get category      | No    |
| POST   | `/categories`      | Create category   | Admin |
| PUT    | `/categories/{id}` | Update category   | Admin |
| DELETE | `/categories/{id}` | Delete category   | Admin |

### Cart APIs

| Method | Endpoint          | Description       | Auth     |
|--------|-------------------|--------------------|----------|
| GET    | `/cart`           | Get cart           | Customer |
| POST   | `/cart/items`     | Add to cart        | Customer |
| PUT    | `/cart/items/{id}`| Update quantity    | Customer |
| DELETE | `/cart/items/{id}`| Remove item        | Customer |
| DELETE | `/cart`           | Clear cart         | Customer |

**Add to Cart Request:**
```json
{
  "foodItemId": 1,
  "quantity": 2
}
```

### Order APIs

| Method | Endpoint                  | Description       | Auth     |
|--------|---------------------------|--------------------|----------|
| POST   | `/orders`                 | Place order        | Customer |
| GET    | `/orders/my-orders`       | Get my orders      | Customer |
| GET    | `/orders/{id}`            | Get order details  | Customer |
| PATCH  | `/orders/{id}/cancel`     | Cancel order       | Customer |

**Place Order Request:**
```json
{
  "addressId": 1,
  "paymentMethod": "CASH_ON_DELIVERY",
  "specialInstructions": "Extra spicy please"
}
```

### Search APIs

| Method | Endpoint                                                  | Description       | Auth |
|--------|-----------------------------------------------------------|--------------------|------|
| GET    | `/search?q=biryani`                                       | Search everything  | No   |
| GET    | `/search/food-items?q=chicken&categoryId=1&minPrice=100`  | Search food items  | No   |

### Review APIs

| Method | Endpoint                       | Description          | Auth     |
|--------|--------------------------------|----------------------|----------|
| POST   | `/reviews`                     | Add review           | Customer |
| GET    | `/reviews/restaurant/{id}`     | Restaurant reviews   | No       |
| GET    | `/reviews/my-reviews`          | My reviews           | Customer |
| DELETE | `/reviews/{id}`                | Delete review        | Customer |

### Admin APIs

| Method | Endpoint              | Description          | Auth  |
|--------|-----------------------|----------------------|-------|
| GET    | `/admin/dashboard`    | Dashboard stats      | Admin |
| GET    | `/admin/users`        | All users            | Admin |
| GET    | `/admin/users/{id}`   | Get user             | Admin |
| DELETE | `/admin/users/{id}`   | Delete user          | Admin |
| GET    | `/admin/restaurants`  | All restaurants      | Admin |
| GET    | `/admin/orders`       | All orders           | Admin |

### Payment APIs

| Method | Endpoint                  | Description       | Auth     |
|--------|---------------------------|--------------------|----------|
| GET    | `/payments/order/{id}`    | Get payment info   | Customer |

---

## 🧪 Testing with Postman

### Setup

1. Open Postman
2. Create a new Collection named "FoodExpress API"
3. Set a Collection variable: `baseUrl` = `http://localhost:8080/api`

### Step-by-Step Testing

#### 1. Register a Customer
- **POST** `{{baseUrl}}/auth/register`
- Body (JSON):
```json
{
  "fullName": "Test Customer",
  "email": "test@customer.com",
  "password": "password123",
  "phone": "9876543210",
  "role": "CUSTOMER"
}
```

#### 2. Login
- **POST** `{{baseUrl}}/auth/login`
- Body (JSON):
```json
{
  "email": "test@customer.com",
  "password": "password123"
}
```
- Copy the `token` from the response

#### 3. Use Token for Authenticated Requests
- In Postman, go to **Authorization** tab
- Select **Bearer Token**
- Paste the JWT token

#### 4. Browse Restaurants
- **GET** `{{baseUrl}}/restaurants`

#### 5. View Food Menu
- **GET** `{{baseUrl}}/restaurants/1/food-items`

#### 6. Add to Cart
- **POST** `{{baseUrl}}/cart/items`
- Body: `{"foodItemId": 1, "quantity": 2}`

#### 7. View Cart
- **GET** `{{baseUrl}}/cart`

#### 8. Add Delivery Address
- **POST** `{{baseUrl}}/addresses`
- Body:
```json
{
  "street": "123 Test Street",
  "city": "Bangalore",
  "state": "Karnataka",
  "zipCode": "560001",
  "isDefault": true
}
```

#### 9. Place Order
- **POST** `{{baseUrl}}/orders`
- Body: `{"addressId": 1, "paymentMethod": "CASH_ON_DELIVERY"}`

#### 10. View Orders
- **GET** `{{baseUrl}}/orders/my-orders`

---

## 🎨 Application Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero banner, popular restaurants, categories |
| Login | `/login` | User login form |
| Register | `/register` | New user registration |
| Restaurants | `/restaurants` | Browse all restaurants |
| Restaurant Detail | `/restaurants/:id` | Menu, reviews, food items |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Address, payment, place order |
| Order Confirmation | `/order-confirmation/:id` | Order success page |
| My Orders | `/my-orders` | Order history |
| Order Tracking | `/orders/:id` | Track order status |
| Profile | `/profile` | Manage profile & addresses |
| Owner Dashboard | `/owner/dashboard` | Manage restaurant & orders |
| Admin Dashboard | `/admin/dashboard` | System administration |

---

## ⚠ Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running on port 3306
- Verify credentials in `application.properties`
- Make sure `food_delivery_db` database exists

### CORS Errors
- Backend CORS is configured for `http://localhost:3000`
- Make sure frontend runs on port 3000

### JWT Token Expired
- Tokens expire after 24 hours
- Login again to get a new token

### Port Already in Use
- Backend: Change `server.port` in `application.properties`
- Frontend: React will ask to use another port automatically

---

## 👩‍💻 Developed By

**Anshika Reddy** - College Project

---

## 📄 License

This project is for educational purposes.
