# BookEasy - Online Appointment Booking System

BookEasy is a fully functional web application designed for online appointment scheduling. It allows Service Providers to offer services and Customers to book appointments seamlessly.

This project was built as a capstone assessment for Web Programming II.

## 🚀 Features & Architecture

- **Backend Architecture**: Node.js & Express.js following a strict **MVC** (Model-View-Controller) structure.
- **RESTful API**: Clean API design for frontend interaction.
- **Database**: PostgreSQL (Relational Database) using raw DDL schemas and `pg` module.
- **Frontend**: Vanilla HTML/CSS/JavaScript. It demonstrates how to consume a REST API without relying on EJS or external UI frameworks.
- **Security**:
  - **Authentication**: User Registration and Login.
  - **Authorization**: Role-Based Access Control (Customer, Provider, Admin).
  - **Hashing**: Passwords are securely hashed using `bcrypt`.
  - **Sessions**: Stateless JWT (JSON Web Token) authentication.
- **Advanced Features (Beyond Course Scope)**:
  - Rate limiting for brute-force protection.
  - Input validation via `express-validator`.
  - Application request logging via `morgan`.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Server**: Express.js
- **Database**: PostgreSQL (`pg`)
- **Security**: `bcrypt`, `jsonwebtoken`, `express-rate-limit`, `cors`
- **Frontend**: Vanilla JS, HTML5, CSS3

## 📂 Project Structure (MVC)
- `src/models`: Database schema execution and logical representations.
- `src/controllers`: Business logic and request handling.
- `src/routes`: Express Router definitions for endpoints.
- `src/middleware`: JWT authentication and RBAC guards.
- `src/config`: Database initialization scripts.
- `public`: Vanilla frontend files (Views).
- `schema.sql`: DDL definition for the relational database.

## 💾 Database Schema (DDL)

The database schema is written in `schema.sql` (PostgreSQL Dialect).
* **users**: `id` (SERIAL), `name`, `email`, `password_hash`, `role` (customer, provider, admin), `created_at`
* **services**: `id` (SERIAL), `provider_id` (FK), `name`, `description`, `duration_minutes`, `price`, `created_at`
* **appointments**: `id` (SERIAL), `customer_id` (FK), `service_id` (FK), `appointment_date`, `status`, `created_at`

## ⚙️ Setup and Installation Instructions

1. **Clone the repository** (or extract the folder).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   The `.env` file is used to store environment variables. Make sure your local PostgreSQL server is running and configure the `DATABASE_URL`:
   ```env
   PORT=3000
   JWT_SECRET=supersecretjwtkey_for_bookeasy_project
   DATABASE_URL=postgres://postgres:password@localhost:5432/bookeasy
   ```
4. **Create the Database in PostgreSQL**:
   Open `psql` or pgAdmin and create the database `bookeasy`. (Or change `bookeasy` in the URL to an existing database).
5. **Start the Server**:
   ```bash
   npm start
   ```
   *The database schema (`schema.sql`) will be automatically executed, creating the necessary tables inside your PostgreSQL database upon startup.*
6. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## 🧪 How to Test the Flow
1. Go to `http://localhost:3000/register.html` and register an account with the role **Service Provider**.
2. Login and navigate to your Dashboard to create a new Service.
3. Logout and register a new account with the role **Customer**.
4. Login and book the service created by the provider on the Home page.
5. You can view the scheduled appointments in the Dashboard.
