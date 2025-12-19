# Natures - Tour Booking Online Platform

## Overview

Natures is a modern tour booking platform that connects adventure seekers with unique nature experiences. Built with a robust Node.js backend, this platform provides seamless booking, and user management for nature enthusiasts worldwide.

## Features

- **Express Server**: RESTful API server setup
- **MongoDB Integration**: Mongoose ODM with connection pooling
- **Environment Configuration**: Secure configuration using dotenv
- **Error Handling**: Comprehensive error handling for uncaught exceptions and rejections
- **Development/Production Setup**: Conditional server startup based on environment

## Prerequisites

- Node.js (v12 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy the example environment file:
     ```bash
     cp config.env.example config.env
     ```
   - Edit `config.env` with your configuration:
     ```
     DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/databaseName?retryWrites=true&w=majority
     DB_PASSWORD=your_mongodb_password
     PORT=3000
     NODE_ENV=development
     ```

## Project Structure

```
├── app.js              # Main Express application
├── server.js           # Server setup and database connection
├── config.env          # Environment configuration (not tracked in git)
├── package.json        # Dependencies and scripts
└── ...                # Other project files
```

## Database Configuration

The application uses MongoDB with the following Mongoose options:

- `useNewUrlParser: true` - New URL parser
- `useCreateIndex: true` - Creates indexes for unique fields
- `useFindAndModify: false` - Disables deprecated findAndModify()
- `useUnifiedTopology: true` - New server discovery and monitoring engine

## Error Handling

The application includes comprehensive error handling:

1. **Uncaught Exceptions**: Catches synchronous errors throughout the application
2. **Unhandled Rejections**: Catches promise rejections that aren't handled

In both cases, the application logs the error and gracefully shuts down.

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on the port specified in `config.env` (default: 3000).

### Production Mode

```bash
npm start
```

The server runs with production optimizations.

## Environment Variables

Atached a .env.exampe file in root directory

## Error Codes

- `1`: Process exit due to uncaught exception or unhandled rejection

## Security Features

- Database credentials stored in environment variables
- Password replacement in connection string
- Separate configurations for development and production

## Dependencies

### Core Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `dotenv`: Environment configuration

### Development Dependencies

[Add your dev dependencies here]

## Scripts

- `npm start`: Start the application in production mode
- `npm run dev`: Start the application in development mode with hot reload
- [Add other scripts as needed]

## Troubleshooting

### Common Issues

1. **Connection refused to MongoDB**

   - Verify your MongoDB connection string
   - Check if IP is whitelisted in MongoDB Atlas
   - Ensure database user has correct permissions

2. **Environment variables not loading**

   - Ensure `config.env` file exists in root directory
   - Check file permissions
   - Verify variable names match those in code

3. **Port already in use**
   - Change PORT in config.env
   - Check for other running Node.js processes
