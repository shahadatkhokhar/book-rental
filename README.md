# Book Rental API

This project is a Book Rental API that allows users to register, login, search for books, rent books, return books, and view rental history. It also includes tests for various routes.

## Setup

### Prerequisites

- Node.js
- npm or yarn
- MySQL (or any other SQL database supported by Sequelize)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shahadatkhokhar/book-rental.git
   cd book-rental
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and copy .env.example and put your credentials in

4. Seed the database (optional):
   ```bash
   yarn seed
   ```

### Running the Server

Start the server:

```bash
npm start
# or
yarn start
```

The server will start on `http://localhost:8000`.

## Running Tests

To run the tests, use the following command:

```bash
npm test
# or
yarn test
```

## API Endpoints

### Auth Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get authenticated user (protected)
- `POST /api/auth/logout` - Logout a user (protected)

### Book Routes

- `GET /api/books/search` - Search books by title or genre (protected)
- `GET /api/books/popular` - Get the most popular book (protected)
- `GET /api/books/overdue` - Get the most overdue book (protected)

### Rental Routes

- `POST /api/rentals/rent` - Rent a book (protected)
- `POST /api/rentals/return/:id` - Return a rented book (protected)
- `GET /api/rentals/history` - Get rental history (protected)

## Middleware

### Auth Middleware

The auth middleware is used to protect routes that require authentication. It verifies the JWT token and attaches the decoded user information to the request object.

## License

This project is licensed under the MIT License.
