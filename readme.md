# Color Palette Backend

This is the backend for the Color Palette application. It provides RESTful APIs for user authentication and color palette management.

## Features

- **User Authentication:** Users can sign up, sign in, and log out securely using JWT (JSON Web Tokens) for authentication.
- **Color Palette Management:** Users can save color palettes to their accounts and retrieve them later.


## Installation

To run this backend server locally, follow these steps:

1. Clone this repository to your local machine.
   ```bash
   git clone https://github.com/your-username/color-palette-backend.git


### API Documentation

- **POST /api/v1/signup:** Register a new user with the provided email and password.
- **POST /api/v1/login:** Sign in an existing user with the provided email and password.
- **POST /api/v1/save:** Save a single color for the currently authenticated user.
- **POST /api/v1/savefullpalette:** Save a new color palette for the currently authenticated user.
- **GET /api/v1/getsaved/:userId:** Retrieve all saved color for the currently authenticated user.
- **GET /api/v1/getfullpalette/:userId:** Retrieve a all saved color palette for the currently authenticated user.
- **GET /api/v1/image-proxy:** Proxy server to fetch images.



## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
