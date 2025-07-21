# Portfolio Backend

This is the backend server for the portfolio website. It provides APIs to manage and serve portfolio content including projects, about information, contact details, and resume data.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your database configuration:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=portfolio
   ```
4. Set up the database:
   - Create a new MySQL database
   - Import the schema from `src/database/schema.sql`

## Development

To start the development server with hot-reload:

```bash
npm run dev
```

## Build

To build the project:

```bash
npm run build
```

## Production

To start the production server:

```bash
npm start
```

## API Endpoints

### Projects
- GET `/api/projects` - Get all projects
- GET `/api/projects/:id` - Get a specific project

### About
- GET `/api/about` - Get about information

### Contact
- GET `/api/contact` - Get contact information

### Resume
- GET `/api/resume` - Get resume information

## Database Schema

The database includes tables for:
- Projects (title, description, image_url, github_url, live_url, technologies)
- About (title, content, image_url, skills)
- Contact (email, phone, linkedin_url, github_url)
- Resume (category, title, organization, dates, description)
