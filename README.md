# Customer Management System (CMS)

A modern, full-stack customer relationship management system with authentication, customer CRUD operations, and more.

## Features

- 🔐 **JWT Authentication**: Secure login and registration with JSON Web Tokens
- 📊 **Dashboard**: Real-time customer count statistics
- 👥 **Customer Management**: Add, edit, delete, and search customers with pagination
- 🛡️ **Validation**: Form validation on both frontend and backend
- 🐳 **Docker Support**: Containerized development and deployment
- 🧪 **Testing**: Unit tests using Jest and Supertest

## Tech Stack

### Frontend
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [React Hook Form](https://react-hook-form.com/) - Performant form management
- [Zod](https://zod.dev/) - Schema validation and type inference

### Backend
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web application framework
- [Supabase](https://supabase.com/) - PostgreSQL database and authentication
- [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication

### DevOps
- [Docker](https://www.docker.com/) - Containerization
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/visionmedia/supertest) - Unit and integration testing

## Quick Start

### Prerequisites
- Node.js 22+
- npm or yarn
- Docker and Docker Compose (optional)

### Using Docker Compose (Recommended)

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd customer-management-system
   ```

2. Configure environment variables:
   Copy `backend/.env.example` to `backend/.env` and fill in your values:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret
   PORT=5001
   ```

3. Build and run the containers:
   ```bash
   docker-compose up -d --build
   ```

4. Initialize your database:
   - Open your Supabase dashboard
   - Run the SQL schema from `backend/supabase/schema.sql`

5. Access the app:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

### Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
.
├── backend/
│   ├── bin/
│   │   └── www                  # Server entrypoint
│   ├── scripts/                 # Utility scripts
│   │   ├── add-dummy-customers.js
│   │   ├── create-test-user.js
│   │   └── seed.js
│   ├── src/
│   │   ├── middleware/          # Express middleware
│   │   │   └── auth.js
│   │   ├── routes/              # API endpoints
│   │   │   ├── auth.js
│   │   │   └── customers.js
│   │   ├── utils/               # Helper utilities
│   │   │   └── supabase.js
│   │   └── app.js               # Express application
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.sql
│   │   └── schema.sql
│   ├── tests/                   # Jest tests
│   │   └── app.test.js
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   ├── components/          # Reusable components
│   │   └── lib/                 # API and auth helpers
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Running Tests

To run the backend unit tests:

```bash
cd backend
npm test
```

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub/GitLab/Bitbucket
2. Import your project on [Vercel](https://vercel.com/new)
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy!

### Backend (Render)
1. Push your code to GitHub/GitLab/Bitbucket
2. Create a new Web Service on [Render](https://render.com/new/web-service)
3. Configure environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
4. Deploy!

## Default Credentials

To test the application, you can create a user or use the seeded credentials:
- Email: yash@g.com
- Password: yash1234

## License

This project is for evaluation purposes.
