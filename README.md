# Book Rental API

This is a Book Rental API built with Laravel. It allows users to rent books, manage their rentals, and more.

## Setup and Installation

### Prerequisites

-   PHP >= 7.3
-   Composer
-   MySQL
-   Node.js & npm

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/shahadatkhokhar/book-rental-api.git
    cd book-rental-api
    ```

2. Install dependencies:

    ```sh
    composer install
    npm install
    ```

3. Copy the `.env.example` file to `.env`:

    ```sh
    cp .env.example .env
    ```

4. Generate an application key:
    ```sh
    php artisan key:generate
    ```

### Database Configuration

1. Update the `.env` file with your MySQL database credentials:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

2. Run the database migrations:
    ```sh
    php artisan migrate
    ```

### SMTP Configuration

1. Update the `.env` file with your Gmail SMTP credentials:
    ```env
    MAIL_MAILER=smtp
    MAIL_HOST=smtp.gmail.com
    MAIL_PORT=587
    MAIL_USERNAME=your_email@gmail.com
    MAIL_PASSWORD=your_email_password
    MAIL_ENCRYPTION=tls
    MAIL_FROM_ADDRESS=your_email@gmail.com
    MAIL_FROM_NAME="${APP_NAME}"
    ```

### Running the Application

1. Start the local development server:
    ```sh
    php artisan serve
    ```
2. Visit `http://localhost:8000` in your browser.

### Running Tests

1. Run the tests using:

    ```sh
    php artisan test
    ```
