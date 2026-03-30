# 🏗️ Crane Service Platform - Full MERN Stack

A modern, full-featured web application for managing crane rental services. Built with **React (Vite)**, **Node.js (Express)**, **MongoDB**, and **Tailwind CSS**.

---

## 📋 Project Overview

**Crane Service Platform** is a complete SaaS application that allows users to:

- Browse and search available crane services
- Book cranes for specific dates and locations
- Track booking status and payment
- Admins can manage services, users, bookings, and generate reports
- Email notifications for confirmations and status updates

---

## 🏗️ Project Architecture

```
Crane Service Platform
├── Frontend (React + Vite)          → Deployed to Vercel
│   ├── Pages (Services, Booking, Dashboard, Admin)
│   ├── Components (Reusable UI components)
│   ├── Contexts (State management)
│   └── Routes (User & Admin routing)
│
├── Backend (Node.js + Express)      → Deployed to Render
│   ├── Models (User, Service, Booking)
│   ├── Routes (Auth, Services, Bookings, Admin)
│   ├── Middleware (Authentication, Authorization)
│   └── Utils (Email, Database)
│
└── Database (MongoDB)               → MongoDB Atlas Cloud
    ├── Users Collection
    ├── Services Collection
    └── Bookings Collection
```

---

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite 8** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API calls
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 9** - ODM for MongoDB
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variable management

---

## 📁 Project Structure

```
crane-service-platform/
│
├── frontend/                          # React Frontend (Port 5173)
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   ├── contexts/                # Global state (Theme, User, etc)
│   │   ├── pages/                   # Page components (Home, Dashboard, etc)
│   │   ├── routes/                  # Route configurations
│   │   ├── lib/                     # Utility functions
│   │   ├── App.jsx                  # Main App component with routing
│   │   ├── main.jsx                 # React entry point
│   │   ├── index.css                # Global styles
│   │   └── App.css                  # App-specific styles
│   ├── public/                      # Static assets
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   └── eslint.config.js             # ESLint configuration
│
├── backend/                           # Express Backend (Port 5000)
│   ├── models/
│   │   ├── User.js                  # User schema & model
│   │   ├── Service.js               # Service/crane schema
│   │   └── Booking.js               # Booking/reservation schema
│   │
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints (register, login)
│   │   ├── services.js              # Service listing endpoints
│   │   ├── contact.js               # Contact form endpoint
│   │   ├── user/
│   │   │   └── bookings.js          # User booking operations
│   │   ├── admin/
│   │   │   ├── bookings.js          # Admin booking management
│   │   │   ├── users.js             # Admin user management
│   │   │   ├── services.js          # Admin service management
│   │   │   └── reports.js           # Analytics & reports
│   │   └── shared/                  # Shared utilities
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication middleware
│   │   └── admin.js                 # Admin role verification
│   │
│   ├── utils/
│   │   └── mailer.js                # Email templates & sending
│   │
│   ├── server.js                    # Main server entry point
│   ├── package.json                 # Backend dependencies
│   └── .env.example                 # Environment variables template
│
├── .gitignore                        # Git ignore rules
├── README.md                         # This file
└── DEPLOYMENT.md                    # Deployment instructions
```

---

## 🔧 Core Functionalities

### Authentication & Authorization

- User registration with email validation
- Secure password hashing with bcrypt
- JWT-based authentication
- Admin role-based access control
- Token expiration (1 day)

### Service Management

- Browse available crane services
- View detailed service information
- Admin can create, update, delete services
- Service categories and pricing (hourly & daily rates)

### Booking System

- Users can create booking requests
- Automatic GST calculation
- Flexible date range selection
- Work location tracking
- Booking status management (pending → confirmed/rejected)
- Payment status tracking

### Admin Dashboard

- Complete user management
- Booking approval/rejection workflow
- Service management
- Revenue reports and analytics
- Statistics & insights

### Email Notifications

- Welcome email on registration
- Booking confirmation emails
- Booking status updates
- Contact form submissions
- Admin notifications for new bookings

---

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crane-service

# JWT Authentication
JWT_SECRET=your_super_secret_key_here

# Email Configuration (Gmail or custom SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Admin Setup
ADMIN_SETUP_KEY=setup_key_for_first_admin

# Admin Notifications
ADMIN_NOTIFICATION_EMAIL=admin@DATTAcranes.com
```

For frontend, create `.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- Gmail account (for email notifications)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/crane-service-platform.git
cd crane-service-platform
```

**2. Setup Backend**

```bash
cd backend
npm install
# Create .env file with required variables
npm start
# Backend runs on http://localhost:5000
```

**3. Setup Frontend**

```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/bootstrap-admin` - Create first admin (setup key required)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service details
- `POST /api/admin/services` - Create service (admin only)
- `PUT /api/admin/services/:id` - Update service (admin only)
- `DELETE /api/admin/services/:id` - Delete service (admin only)

### Bookings

- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/admin/bookings` - Get all bookings (admin only)
- `PUT /api/admin/bookings/:id/confirm` - Confirm booking (admin only)
- `PUT /api/admin/bookings/:id/reject` - Reject booking (admin only)

### Admin

- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/reports` - Get reports & analytics (admin only)

---

## 🔐 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Email validation
- ✅ Admin setup key protection
- ✅ CORS configuration for production
- ✅ Environment variable protection (no secrets in code)

---

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  contactNumber: String,
  role: ["user" | "admin"],
  createdAt: Date,
  updatedAt: Date
}
```

### Service Collection

```javascript
{
  _id: ObjectId,
  name: String,
  model: String,
  category: String,
  description: String,
  pricePerHour: Number,
  pricePerDay: Number,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  serviceId: ObjectId (ref: Service),
  startDate: Date,
  endDate: Date,
  workLocation: {
    area: String,
    district: String,
    state: String,
    pincode: String
  },
  basePrice: Number,
  gstPercentage: Number,
  gstAmount: Number,
  totalPrice: Number,
  status: ["pending" | "confirmed" | "rejected"],
  paymentStatus: ["unpaid" | "paid"],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing

### Test User Credentials

```
Email: testuser@example.com
Password: Test@123
Role: User
```

### Test Admin Credentials

```
Email: admin@example.com
Password: Admin@123
Role: Admin
```

---

## 📦 Deployment

### Frontend Deployment (Vercel)

```bash
# Build for production
npm run build

# Push to GitHub and connect Vercel
# Set environment variable:
VITE_API_URL=https://your-backend.onrender.com
```

### Backend Deployment (Render)

```bash
# Push to GitHub and create Web Service on Render
# Set environment variables in Render dashboard
# Build command: npm install
# Start command: node server.js
```

### Database (MongoDB Atlas)

- Create free cluster
- Whitelist all IPs: `0.0.0.0/0`
- Get connection string and add to backend `.env`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 🐛 Troubleshooting

### Backend Issues

1. **"MongoDB connection error"** - Check MONGO_URI in .env
2. **"Port 5000 already in use"** - Change PORT in .env or kill process
3. **"Email not sending"** - Verify SMTP credentials and enable "Less secure apps"

### Frontend Issues

1. **"API calls returning 404"** - Ensure backend is running on correct port
2. **"CORS errors"** - Check backend CORS configuration
3. **"Vite not starting"** - Run `npm install` and clear node_modules cache

### Common Fixes

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Kill process on port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Check environment variables
cat .env
```

---

## 📝 Code Comments & Documentation

All files include comprehensive comments explaining:

- **File Purpose** - What each file does
- **Function Documentation** - Parameters, return values, purpose
- **State Management** - How data flows through the app
- **API Integration** - How frontend communicates with backend
- **Validation Logic** - Input validation and error handling

---

## 🤝 Contributing

1. Create a new branch for your feature
2. Make changes with clear commit messages
3. Keep code style consistent
4. Test thoroughly before pushing
5. Submit pull request with description

---

## 📞 Support

For issues and questions:

- Check the troubleshooting section above
- Review error logs in terminal/console
- Check MongoDB Atlas dashboard for database issues
- Verify all environment variables are correctly set

---

## 📄 License

ISC License - Free to use for personal and commercial projects

---

## 🎯 Next Steps

1. **Setup MongoDB Atlas** - Create free cluster and get connection string
2. **Email Configuration** - Set up Gmail app password for Nodemailer
3. **Admin Setup** - Create first admin account using bootstrap-admin endpoint
4. **Deploy to Production** - Follow deployment guide for Vercel + Render
5. **Custom Domain** - Add custom domain via Vercel dashboard

---

## 📈 Performance Tips

- ✅ Images are optimized via Vercel CDN
- ✅ Frontend bundle is minified and tree-shaken
- ✅ API requests use proper error handling
- ✅ Database queries are indexed
- ✅ Use UptimeRobot to prevent backend cold starts

---

## 🔄 Version History

| Version | Date | Changes                                |
| ------- | ---- | -------------------------------------- |
| 1.0.0   | 2024 | Initial release with all core features |

---

**Happy Coding! 🚀**

_Built with ❤️ for the crane rental industry_
