# RESTful API for Scavenger Hunt Backend

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)

## Description

The ScavengerHunt API is designed for managing a picture puzzle game where players move pieces around to create the perfect image. Players compete to complete puzzles in the shortest time and with the fewest moves possible. This API provides a set of endpoints to support various game-related functionalities.

## Features

- Express.js server.
- Basic API endpoints.
- Customizable for your specific use case.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed.
- NPM (Node Package Manager) installed.
- Git installed (optional for version control).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nicholasikiroma/scavengerHunt.git

2. Change to the project directory:

    ```bash
    cd scavengerHunt
    ```

3. Install dependencies:

    ```bash
    npm i
    ```

## Usage

```bash
npm start
```

## Environment Variables

The API uses environment variables to configure certain settings. You can customize these settings by creating a .env file in the project directory and setting the variables accordingly. Example:

```plaintext
SALT_ROUNDS=<replace-with-salt-for-hashing-passwords>
ENCRYPTION_kEY=<replace-with-encryption-key-for-ciphers>
DB_HOST=<replace-with-db-hostname>
DB_NAME=<replace-with-db-name>
DB_USER=<replace-with-db-user-name>
DB_PASS=<replace-with-db-password>
DB_DIALECT=<replace-with-db-dialect>
NODE_ENV=<replace-with-environment>
DB_URL=<replace-with-db-url>
COOKIE_SECRET=<replace-with-COOKIE_SECRET>
COOKIE_NAME=<replace-with-COOKIE_NAME>
```

## API Documentation

The API documentation is accessible via the following URL:

[API Documentation](https://scavenger-hunt-gm0j.onrender.com/docs)

You can access this URL in your web browser to view the documentation, including details about the available endpoints, request and response formats, and usage examples.
