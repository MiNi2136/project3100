# 🎓 EduAttend - Advanced Smart Attendance Management System

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MiNi2136/eduattend)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://atendo-deploy.onrender.com)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://mongodb.com/)

> A modern, secure, and user-friendly attendance management system designed for educational institutions with real-time QR code scanning, location verification, and comprehensive analytics.

---

## 🌟 **Latest Updates & Features**

### **🚀 Version 2.0 - Major Enhancements**
- **📱 Full Mobile Responsiveness**: Optimized for phones, tablets, and desktops
- **🔐 Enhanced Authentication**: Fixed JWT token handling with improved security
- **📊 Advanced Session Management**: Time-based active session filtering
- **🛠️ Comprehensive Error Handling**: Detailed debugging and user-friendly error messages
- **📸 Improved Camera Integration**: Enhanced photo capture with null safety checks
- **⚙️ Settings Page**: User profile management and configuration options
- **🎨 Modern UI/UX**: Updated design with gradients, animations, and responsive layouts

---

## 🎯 **Key Features**

### **👨‍🏫 For Teachers**
- **✨ Create Smart Sessions**: Set up attendance sessions with location, time, and distance parameters
- **📊 Comprehensive Analytics**: Detailed attendance reports with student performance data
- **🔍 QR Code Generation**: Automatic QR codes for seamless attendance marking
- **📈 Enhanced Dashboard**: Modern interface to manage all sessions efficiently
- **📋 Attendance Reports**: Export and view detailed attendance analytics
- **🎯 CT Marks Management**: Grade and track student performance
- **⚙️ Profile Settings**: Manage teacher profile and preferences

### **👨‍🎓 For Students**
- **📱 QR Code Scanner**: Built-in camera scanner with real-time detection
- **📍 Smart Location Tracking**: Automatic location verification with distance calculation
- **📸 Photo Verification**: Capture attendance photos for identity confirmation
- **📚 Attendance History**: Complete record of all past attendance
- **🔔 Real-time Sessions**: View only currently active sessions
- **📊 Personal Dashboard**: Track attendance statistics and performance
- **⚙️ Profile Management**: Update personal information and settings

### **🔐 Security & Authentication**
- **🛡️ JWT Authentication**: Secure login with JSON Web Tokens (24-hour expiry)
- **🔒 Password Security**: Bcrypt hashing with salt for password protection
- **📧 Email Verification**: OTP verification during registration and password reset
- **🔄 Token Refresh**: Automatic token validation and refresh mechanisms
- **🚪 Secure Logout**: Complete session cleanup and token invalidation

---

## 🏗️ **Technology Stack**

### **Frontend (React.js)**
```
React 18.2.0          - Modern UI framework with hooks
React Router Dom      - Client-side routing and navigation
Axios                - HTTP client for API communication
html5-qrcode         - QR code scanning functionality
CSS3                 - Responsive styling with Flexbox/Grid
JavaScript (ES6+)    - Modern JavaScript features
```

### **Backend (Node.js)**
```
Express.js 4.18.2    - Web application framework
MongoDB & Mongoose   - NoSQL database with ODM
JWT (jsonwebtoken)   - Authentication tokens
Multer              - File upload middleware
Cloudinary          - Cloud image storage and processing
Nodemailer          - Email services for OTP
Bcryptjs            - Password hashing
Cors                - Cross-origin resource sharing
```

### **Development Tools**
```
Nodemon             - Development server auto-restart
ESLint              - Code linting and formatting
Git & GitHub        - Version control and collaboration
VS Code             - Development environment
```

---

## 🚀 **Quick Start Guide**

### **📋 Prerequisites**
- **Node.js** v14.0.0 or higher
- **MongoDB** (local installation or cloud Atlas)
- **Modern Browser** with camera and location support
- **Git** for version control

### **⚡ Installation Steps**

1. **📥 Clone Repository**
   ```bash
   git clone https://github.com/MiNi2136/eduattend.git
   cd eduattend/Atendo-main
   ```

2. **🔧 Backend Configuration**
   ```bash
   cd backend
   npm install
   ```
   
   Create `.env` file in backend directory:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/eduattend
   # or use MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/eduattend
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Server Configuration
   PORT=5000
   
   # Cloudinary Configuration (for image storage)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email Configuration (for OTP)
   EMAIL=your_email@gmail.com
   PASSWORD=your_gmail_app_password
   ```

3. **🎨 Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **🚀 Start Development Servers**
   
   **Backend Server (Terminal 1):**
   ```bash
   cd backend
   npm start
   # Server will start on http://localhost:5000
   ```
   
   **Frontend Server (Terminal 2):**
   ```bash
   cd frontend
   npm start
   # Application will open on http://localhost:3000
   ```

5. **🌐 Access Application**
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **Live Demo**: [https://atendo-deploy.onrender.com](https://atendo-deploy.onrender.com)

---

## 📱 **How to Use EduAttend**

### **🎓 For Teachers - Complete Workflow**

1. **📝 Account Setup**
   - Register as a teacher with email verification
   - Complete profile setup with institutional details

2. **📅 Session Management**
   - Navigate to Teacher Dashboard
   - Click "New Session" to create attendance session
   - Configure: Session name, duration, location radius, date/time
   - Generate QR code automatically

3. **📊 Conducting Sessions**
   - Display generated QR code to students (projector/screen)
   - Monitor real-time attendance submissions
   - View student photos and location verification

4. **📈 Analytics & Reports**
   - Access detailed attendance reports
   - Export data for institutional records
   - Track student performance with CT marks
   - Generate attendance certificates

### **👨‍🎓 For Students - Attendance Process**

1. **📱 Account Registration**
   - Register with student email and roll number
   - Verify account through OTP

2. **📍 Marking Attendance**
   - Login to student dashboard
   - View current active sessions
   - Click "Scan QR Code" to open camera
   - Scan teacher's QR code
   - Camera captures attendance photo
   - Enter roll number and submit
   - Receive confirmation message

3. **📚 Tracking Records**
   - View complete attendance history
   - Check session details and performance
   - Access personal analytics dashboard

---

## 🔧 **Advanced Configuration**

### **🗄️ Database Schema**

**Teachers Collection:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  sessions: [{
    session_id: String,
    name: String,
    date: Date,
    time: String,
    duration: Number,
    location: String,
    radius: Number,
    attendance: [StudentAttendance]
  }]
}
```

**Students Collection:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  sessions: [{
    session_id: String,
    teacher_email: String,
    image: String,
    date: Date,
    location: String,
    distance: Number
  }]
}
```

### **🔐 Security Features**

- **JWT Token Expiry**: 24-hour automatic expiration
- **Password Requirements**: Minimum 8 characters with complexity
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Restricted cross-origin requests
- **File Upload Security**: Image type and size validation

---

## 🐛 **Troubleshooting Guide**

### **❌ Common Issues & Solutions**

**1. Camera/QR Scanner Issues:**
```
Problem: QR scanner not working
Solutions:
- Ensure HTTPS or localhost environment
- Grant camera permissions in browser
- Check browser compatibility (Chrome/Firefox recommended)
- Verify html5-qrcode package installation
```

**2. Authentication Errors:**
```
Problem: 401 Unauthorized errors
Solutions:
- Check JWT token expiry (24 hours)
- Verify JWT_SECRET in .env file
- Clear browser localStorage and re-login
- Ensure proper token format in requests
```

**3. Location/GPS Issues:**
```
Problem: Location not detected
Solutions:
- Enable location services in browser
- Use HTTPS for production deployment
- Check GPS accuracy settings
- Verify location permissions granted
```

**4. Database Connection:**
```
Problem: MongoDB connection failed
Solutions:
- Verify MongoDB service is running
- Check MONGODB_URI in .env file
- Ensure database permissions are correct
- For Atlas: whitelist IP addresses
```

**5. File Upload Problems:**
```
Problem: Image upload failing
Solutions:
- Verify Cloudinary credentials in .env
- Check file size limits (max 10MB)
- Ensure proper image formats (jpg, png, gif)
- Verify multer middleware configuration
```

---

## 🚀 **Deployment Guide**

### **🌐 Production Deployment**

**1. Environment Variables:**
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_url
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=production_cloudinary_name
CLOUDINARY_API_KEY=production_api_key
CLOUDINARY_API_SECRET=production_api_secret
EMAIL=production_email@domain.com
PASSWORD=production_email_password
```

**2. Build Frontend:**
```bash
cd frontend
npm run build
```

**3. Deploy Options:**
- **Heroku**: Full-stack deployment
- **Vercel**: Frontend deployment
- **Render**: Backend deployment
- **Netlify**: Frontend static hosting

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Open** Pull Request

### **📝 Code Style Guidelines**
- Use ESLint configuration provided
- Follow React best practices
- Add comments for complex logic
- Write meaningful commit messages

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Authors & Contributors**

- **Lead Developer**: [MiNi2136](https://github.com/MiNi2136)
- **Contributors**: Open for community contributions

---

## 📞 **Support & Contact**

- **📧 Email**: [rahulagniotri4444@gmail.com](mailto:rahulagniotri4444@gmail.com)
- **📧 Email**: [dhruvilpatel2002@gmail.com](mailto:dhruvilpatel2002@gmail.com)
- **🐛 Issues**: [GitHub Issues](https://github.com/MiNi2136/eduattend/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/MiNi2136/eduattend/discussions)

---

## 🙏 **Acknowledgments**

- **React Team** - For the amazing frontend framework
- **Express.js Community** - For the robust backend framework
- **MongoDB** - For the flexible NoSQL database
- **Cloudinary** - For image storage and processing
- **GitHub Community** - For hosting and collaboration tools

---

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**

**Made with ❤️ for Educational Institutions**
