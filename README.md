# HotelHub - Premium Booking Experience

HotelHub is a fully functional web application designed for online hotel reservations and property management. It allows Hotel Owners to offer properties/rooms and Customers to book stays seamlessly.

## 🚀 Features & Architecture

- **Backend Architecture**: Node.js & Express.js following a strict **MVC** (Model-View-Controller) structure.
- **RESTful API**: Clean API design for frontend interaction.
- **Database**: PostgreSQL (Relational Database) using raw DDL schemas and `pg` module.
- **Frontend**: Vanilla HTML/CSS/JavaScript. It demonstrates how to consume a REST API without relying on EJS or external UI frameworks.
- **Security**:
  - **Authentication**: User Registration and Login.
  - **Authorization**: Role-Based Access Control (Customer, Hotel Owner, Admin).
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
   JWT_SECRET=supersecretjwtkey_for_hotelhub_project
   DATABASE_URL=postgres://postgres:password@localhost:5432/hotelhub
   ```
4. **Create the Database in PostgreSQL**:
   Open `psql` or pgAdmin and create the database `hotelhub`. (Or change `hotelhub` in the URL to an existing database).
5. **Start the Server**:
   ```bash
   npm start
   ```
   *The database schema (`schema.sql`) will be automatically executed, creating the necessary tables inside your PostgreSQL database upon startup.*
6. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.
