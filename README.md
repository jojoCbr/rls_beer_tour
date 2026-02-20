# RLS Beer on TOUR

A mobile-friendly application for logging and ranking beers, featuring image uploads and a responsive UI.

## Features

- **Beer Logging**: Log new beers with name, bar, score (1-5), and notes.
- **Image Upload**: Capture or upload photos of your beer directly from the app.
- **Smart Suggestions**: Type-to-search or select existing beers and bars using searchable text inputs.
- **Global Rankings**: View top beer drinkers and top-rated bars based on user logs.
- **Mobile-First Design**: Responsive navigation with a hamburger menu for seamless use on smartphones.
- **Dashboard**: Track your personal history with a gallery view of your beer logs.

## Tech Stack

- **Frontend**: Next.js (TypeScript), Tailwind CSS.
- **Backend**: Node.js (Express), Knex.js.
- **Database**: PostgreSQL.
- **Infrastructure**: Docker & Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:jojoCbr/rls_beer_tour.git
cd rls_beer_tour
```

### 2. Run with Docker Compose

The easiest way to run the entire stack is using Docker Compose. This will start the database, backend, and frontend.

```bash
docker compose up -d --build
```

### 3. Initialize the Database

Once the containers are running, you need to run the migrations and seeds to set up the database schema and initial data.

```bash
# Run migrations
docker exec beer_app-backend-1 npm run migrate:latest

# (Optional) Run seeds for initial data
docker exec beer_app-backend-1 npm run seed:run
```

### 4. Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## Development

### Backend
The backend serves static files (uploaded images) from the `backend/uploads` directory. For production-like testing of image uploads, ensure this directory has the correct write permissions.

### Frontend
The frontend uses environment variables to point to the backend API. In the Docker setup, this is handled automatically via `docker-compose.yml`.

## License

ISC
