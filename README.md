# Complete Auth App

## Description

This is a complete Authentication application built with Node.js and Express.js that provides user authentication functionality. It allows users to register, log in, and access protected routes.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/DigvijayDheer/Complete_Auth_App.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Node_Auth_App
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Access the application:

   Open your web browser and visit `http://localhost:5000`.

## Features

- User registration with secure password hashing using `bcryptjs`
- User login with session management using `express-session`
- Integration with Google OAuth2.0 for social login using `passport-google-oauth20`
- CSRF protection for secure form submissions using `csurf`
- Flash messages for displaying temporary notifications using `connect-flash`
- MongoDB database integration using `mongoose`
- Email verification using `nodemailer`
- Development server with automatic restart using `nodemon`

## Routes

- `POST /signup`: User registration endpoint
- `POST /login`: User login endpoint
- `GET /logout`: User logout endpoint
- `GET /profile`: User profile page
- `POST /send-verification-email`: Endpoint to send a verification email
- `GET /google`: Google authentication endpoint

## Configuration

- Create a `.env` file in the project directory and set the following environment variables:
  - `PORT`: Port number for the server (default: 5000)
  - Database connection details (e.g., `MONGO_URI`)
  - Session secret (e.g., `SESSION_SECRET`)
  - Google OAuth2.0 credentials (e.g., `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`)

## Contributing

Contributions are welcome! Please submit any bug reports, feature requests, or pull requests through the [GitHub issues](https://github.com/DigvijayDheer/Complete_Auth_App.git) page.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

```

You can copy and paste the above content into your `README.md` file. Feel free to modify or enhance it to better suit your project.
```
