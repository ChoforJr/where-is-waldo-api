# Where's Waldo API

A RESTful backend API for the **Where's Waldo** photo tagging game. This server manages game sessions, player progress, character locations, and gameplay statistics.

## 🔗 Related Projects

- **Client Repository:** [where-is-waldo](https://github.com/ChoforJr/where-is-waldo)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Related Projects](#related-projects)
- [Author](#author)

## ✨ Features

- Manage multiple game levels with different difficulty settings
- Track player progress and game sessions
- Validate character location detection with coordinates
- Record finished gameplay statistics
- Input validation and error handling
- CORS-enabled for secure cross-origin requests
- Password hashing with bcryptjs
- Automated scheduled tasks with node-cron

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** JavaScript (with TypeScript support)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** bcryptjs
- **Middleware:** CORS, express-validator
- **Task Scheduler:** node-cron
- **Build Tools:** TypeScript, tsx

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Git

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/ChoforJr/where-is-waldo-api.git
cd where-is-waldo-api
```

2. Install dependencies:

```bash
npm install
```

## ⚙️ Setup

1. Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/where_is_waldo"
ALLOWED_URL1="http://localhost:3000"
```

2. Generate Prisma Client and run migrations:

```bash
npm run prismaGen
npm run prismaMg
```

3. Build TypeScript (if needed):

```bash
npm run build
```

## 📖 Usage

### Development

Start the development server with file watching:

```bash
npm run dev
```

The server runs on `http://localhost:3000` by default.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

## 🔌 API Endpoints

### Get Game Sessions

**GET** `/gameplay/all`

- Retrieve all game sessions
- Returns: Array of gameplay records

**GET** `/gameplay/finished`

- Retrieve all completed game sessions
- Returns: Array of finished gameplay records

**GET** `/gameplay/:gameID`

- Retrieve specific game session by ID
- Parameters: `gameID` (number)
- Returns: Single gameplay record

**GET** `/gameplay/level/:level`

- Retrieve game sessions by difficulty level
- Parameters: `level` (number)
- Returns: Array of gameplay records

### Create Game Session

**POST** `/gameplay/level/:level`

- Start a new game session at a specific level
- Parameters: `level` (number)
- Body: Player and game initialization data
- Returns: Created gameplay record

### Update Game Progress

**PATCH** `/gameplay/:gameID/player`

- Update player information (user name, score, etc.)
- Parameters: `gameID` (number)
- Body: Player data (validated)
- Returns: Updated gameplay record

**PATCH** `/gameplay/:gameID/character`

- Update character location (mark character as found)
- Parameters: `gameID` (number)
- Body: Character location coordinates (validated)
- Returns: Updated character record

## 📁 Project Structure

```
.
├── app.js                    # Express app configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── prisma.config.ts          # Prisma configuration
│
├── config/
│   └── prisma.js             # Prisma setup and client export
│
├── routes/
│   └── indexRouter.js        # API route definitions
│
├── controllers/              # Business logic handlers
│   ├── readDB.js             # GET request handlers
│   ├── postToDB.js           # POST request handlers
│   ├── putToDB.js            # PATCH request handlers
│   └── deleteFromDB.js       # DELETE request handlers
│
├── prisma_queries/           # Reusable database queries
│   ├── create.js             # Create operations
│   ├── read.js               # Read operations
│   ├── update.js             # Update operations
│   └── delete.js             # Delete operations
│
├── validations/
│   └── validateInputs.js     # Input validation rules
│
├── prisma/
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migration files
│
└── public/                   # Static assets
    ├── index.js
    └── style.css
```

## 🧑‍💻 Development

### Available Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start development server with hot reload |
| `npm run build`       | Build TypeScript to JavaScript           |
| `npm start`           | Run production build                     |
| `npm run prismaGen`   | Generate Prisma Client                   |
| `npm run prismaMg`    | Run Prisma migrations                    |
| `npm run startRawSql` | Generate and view raw SQL                |
| `npm run watchRawSql` | Watch and update raw SQL                 |

### Database Management

- **View data in Prisma Studio:**

  ```bash
  npx prisma studio
  ```

- **Create new migration:**

  ```bash
  npx prisma migrate dev --name your_migration_name
  ```

- **Reset database (dev only):**
  ```bash
  npx prisma migrate reset
  ```

## 🔗 Related Projects

- **Client Repository:** [where-is-waldo](https://github.com/ChoforJr/where-is-waldo)

## 👨‍💻 Author

**FORSAKANG CHOFOR JUNIOR**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)
