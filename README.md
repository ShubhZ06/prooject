# StockMaster IMS

Inventory management dashboard with, built with Next.js (frontend) and Node.js/Express (backend).

## Demo Video

Add your walkthrough link here so it is easy to find:

> [Watch the demo](https://drive.google.com/drive/folders/1J8PguUxX7vXd5F8CDcbEJoNfWR9ts9IU?usp=drive_link)

## Tech Stack & Key Imports

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express, Mongoose (MongoDB), Helmet, CORS, cookie-parser, morgan
- **Auth & Security**: bcryptjs, jsonwebtoken


## Prerequisites

- Node.js (LTS)
- MongoDB instance/URI

## Setup

1. **Install dependencies**
   - Root (frontend): `npm install`
   - Backend API: `cd server && npm install`

2. **Environment variables**  
   Create a `.env.local` file in the project root (used by both frontend and backend):

   ```bash
   # Backend
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-jwt-secret
   CLIENT_ORIGIN=http://localhost:3000

   # Admin seed (optional)
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=changeme
   ADMIN_FULL_NAME=Admin User

   # Frontend API base
   NEXT_PUBLIC_API_BASE_URL=/api

3. **Run in development**
   - Run frontend only: `npm run dev`
   - Run backend only: `cd server && npm run dev`
   - Run both together: `npm run dev:all`

The app will be available at `http://localhost:3000` with the API served under `/api`.