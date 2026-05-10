# 360Degrees HR Platform Backend Setup Guide

## Project Overview

This is the backend service for the 360Degrees HR Platform.

### Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma ORM
* Swagger

---

# Prerequisites

Before running the project, ensure the following are installed:

## 1. Node.js

Install Node.js LTS version.

Recommended:

```bash
v20.19+
```

Verify installation:

```bash
node -v
npm -v
```

---

## 2. PostgreSQL

Install PostgreSQL locally.

Verify installation:

```bash
psql --version
```

Ensure PostgreSQL service is running.

---

# Project Setup

## 1. Clone Repository

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd degrees_360
```

---

# Install Dependencies

Run:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file at the root of the project.

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hr_platform"
JWT_SECRET="supersecret"
PORT=5000
```

## Notes

Replace:

* `postgres` with your PostgreSQL username
* `password` with your PostgreSQL password
* `5432` with your PostgreSQL port if different

---

# Database Setup

## 1. Create Database

Open PostgreSQL shell:

```bash
psql -U postgres
```

Create database:

```sql
CREATE DATABASE hr_platform;
```

---

# Prisma Setup

## 1. Generate Prisma Client

```bash
npx prisma generate
```

---

## 2. Run Database Migration

```bash
npx prisma migrate dev --name init
```

This command:

* Creates database tables
* Applies migrations
* Syncs Prisma schema

---

## 3. Open Prisma Studio (Optional)

```bash
npx prisma studio
```

This opens a visual database interface in the browser.

---

# Running the Project

Start development server:

```bash
npm run dev
```

Expected output:

```bash
Server running on port 5000
```

---

# Available Scripts

## Development Server

```bash
npm run dev
```

---

# Project Structure

```bash
degrees_360/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# Current Implemented Modules

## Infrastructure

* Express server setup
* TypeScript configuration
* PostgreSQL integration
* Prisma ORM setup
* Environment configuration

---

## Middleware

* Helmet
* Morgan
* CORS
* JSON parser

---

## Database Foundation

### Models

* Company
* User
* Employee
* Department

---

# Important Notes

## Prisma Location

Prisma files MUST remain in:

```bash
/prisma
```

Do NOT move Prisma inside `/src`.

---

## Environment File

The `.env` file MUST remain at project root.

Correct:

```bash
/.env
```

Wrong:

```bash
/src/.env
/prisma/.env
```

---

# Common Errors

## Prisma Cannot Find Schema

Ensure schema exists at:

```bash
prisma/schema.prisma
```

---

## Cannot Reach Database Server

Ensure:

* PostgreSQL is running
* Port is correct
* Username/password are correct

---

## ts-node-dev Not Found

Install dependencies:

```bash
npm install
```

---

# API Base URL

Local development:

```bash
http://localhost:5000
```

---

# Upcoming Modules

* Authentication
* JWT Authorization
* Employee Management
* Payroll
* Leave Management
* Recruitment
* Performance Management
* Notifications

---

# Maintainers

Backend Lead:
Arthur
