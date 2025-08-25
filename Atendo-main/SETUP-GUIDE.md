# Atendo - Attendance Management System

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### 📡 Server Configuration

**Backend Port**: 5000  
**Frontend Port**: 3000  
**Database**: MongoDB Atlas  
**File Storage**: Cloudinary  

### 🔧 Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Atendo-main
```

#### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
✅ Backend will run on http://localhost:5000

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
✅ Frontend will run on http://localhost:3000

### 🔑 Environment Variables

Backend `.env` file should contain:
```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
Email=your_email@gmail.com
PASSWORD=your_app_password
```

### 📋 API Endpoints

#### User Routes (`/users`)
- `POST /signin` - User login
- `POST /signup` - User registration  
- `POST /forgotpassword` - Reset password
- `POST /sendmail` - Send verification email

#### Session Routes (`/sessions`)
- `POST /create` - Create new session (Teachers)
- `POST /getSessions` - Get teacher sessions
- `POST /getStudentSessions` - Get student attendance
- `POST /getCurrentSessions` - Get active sessions
- `POST /getQR` - Get QR code for session
- `POST /attend_session` - Mark attendance

### 🌐 Frontend Routes

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/student-dashboard` - Student dashboard
- `/teacher-dashboard` - Teacher dashboard
- `/reports` - Student attendance reports
- `/teacher-reports` - Teacher analytics
- `/forgot-password` - Password reset
- `/logout` - Logout page

### 🎯 Features

#### For Students:
- ✅ QR Code attendance marking
- ✅ Location-based verification
- ✅ Photo verification
- ✅ Attendance history
- ✅ Detailed reports with analytics

#### For Teachers:
- ✅ Create sessions with QR codes
- ✅ Set location radius for attendance
- ✅ View student attendance
- ✅ Comprehensive analytics
- ✅ Export attendance data
- ✅ Real-time session management

### 🔧 Technical Stack

**Backend:**
- Node.js + Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (File Upload)
- Multer (File Handling)
- Nodemailer (Email)

**Frontend:**
- React.js (Hooks)
- React Router
- Axios (HTTP Client)
- QR Code Generation/Scanning
- Responsive CSS

### 🚨 Troubleshooting

#### Common Issues:

1. **Port 5000 already in use**
   ```bash
   # Kill process on port 5000
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **CORS Issues**
   - Ensure backend CORS is set to `http://localhost:3000`
   - Check if frontend is running on port 3000

3. **Database Connection**
   - Verify MongoDB URI in `.env`
   - Check network connectivity
   - Ensure MongoDB Atlas IP whitelist includes your IP

4. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper image formats

### 📊 API Testing

Use tools like Postman or curl to test endpoints:

```bash
# Test backend health
curl http://localhost:5000

# Test user login
curl -X POST http://localhost:5000/users/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 🔐 Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing
- ✅ CORS protection
- ✅ Input validation
- ✅ File type verification
- ✅ Location-based attendance verification

### 🎨 UI/UX Features

- ✅ Modern, responsive design
- ✅ Real-time updates
- ✅ Interactive dashboards
- ✅ Mobile-friendly interface
- ✅ Smooth animations
- ✅ Professional styling

---

## 📞 Support

For issues or questions, please check the troubleshooting section or create an issue in the repository.

**Happy Coding!** 🚀
