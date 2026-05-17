# ⚡ GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## 🚀 Tech Stack

- **Frontend:** React.js, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **DevOps:** Docker + Docker Compose

## ✨ Features

- JWT Authentication (Register/Login)
- Role-Based Access Control (Admin / Sales)
- Full Leads CRUD
- Advanced Filtering by Status, Source
- Debounced Search by Name or Email
- Sort by Latest / Oldest
- Backend Pagination (10 per page)
- CSV Export
- Responsive UI with loading & empty states
- Docker Setup

## 📁 Project Structure
## ⚙️ Setup Instructions

### Prerequisites
- Node.js 20+
- MongoDB
- Docker (optional)

### Local Development

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Docker Setup

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔑 Environment Variables

See `backend/.env.example` for all required variables.

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Leads (Protected)
- `GET /api/leads` - Get all leads (with filters & pagination)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead (Admin only)
- `GET /api/leads/export` - Export leads as CSV

## 👥 Roles

| Feature | Admin | Sales |
|--------|-------|-------|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit lead | ✅ | ✅ (own only) |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ |