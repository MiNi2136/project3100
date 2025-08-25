# Atendo - Smart Attendance Management System

## ✅ **What's New - Student Dashboard with QR Scanner**

The student dashboard now includes:
- **📍 Current Running Sessions**: Shows active sessions created by teachers with QR codes
- **📱 QR Code Scanner**: Students can scan QR codes to mark attendance
- **📚 Attendance History**: View past attendance records
- **🎨 Modern UI**: Clean, responsive design with emojis and gradients

---

## 🚀 **Features**

### **For Teachers:**
- **👨‍🏫 Create Sessions**: Set up attendance sessions with location, time, and distance parameters
- **📊 View Analytics**: See which students attended and their locations
- **🔍 QR Code Generation**: Automatic QR codes for each session
- **📈 Dashboard**: Manage all sessions from one place

### **For Students:**
- **📱 QR Scanner**: Built-in camera scanner to mark attendance
- **📍 Location Tracking**: Automatic location verification 
- **📸 Photo Capture**: Take attendance photos for verification
- **📚 History**: View all past attendance records
- **🔔 Real-time Updates**: See current active sessions

### **Security Features:**
- **🔐 JWT Authentication**: Secure login with JSON Web Tokens
- **🔒 Password Hashing**: Passwords are hashed and salted for security
- **📧 Email Verification**: OTP verification during registration
- **🔄 Password Reset**: Forgot password functionality with email OTP

---

## 🛠 **Technology Stack**

### **Frontend (React)**
- **React 18** - Modern UI framework
- **React Router** - Navigation and routing
- **Axios** - API communication
- **html5-qrcode** - QR code scanning
- **CSS3** - Styling with gradients and animations

### **Backend (Node.js)**
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **Nodemailer** - Email services

---

## 📱 **How It Works**

### **Attendance Flow:**
1. **Teacher** creates a session and displays the QR code
2. **Student** opens the app and sees current running sessions
3. **Student** clicks "Scan QR Code" to open the camera scanner
4. **Student** scans the QR code displayed by the teacher
5. **Student** fills out attendance form (roll number, photo)
6. **System** verifies location and saves attendance
7. **Student** gets confirmation message

### **QR Code Format:**
The QR codes contain session information in this format:
```
http://localhost:3000/student-dashboard?session_id=123&email=teacher@example.com
```

---

## 🚀 **Getting Started**

### **Prerequisites:**
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Modern web browser with camera support

### **Installation:**

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Atendo-main
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   Email=your_email@gmail.com
   PASSWORD=your_email_app_password
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Application:**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   node app.js
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm start
   ```

5. **Access the App:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 📱 **Usage**

### **For Teachers:**
1. **Log in** to your account as a teacher
2. **Navigate** to the dashboard and create a new attendance session
3. **Specify** the location radius and other session details
4. **Generate** the QR code and display it to your students
5. **View** attendance details and student submissions on the dashboard

### **For Students:**
1. **Log in** to your account as a student
2. **View** current running sessions on your dashboard
3. **Click "Scan QR Code"** to open the camera scanner
4. **Scan** the QR code displayed by your teacher
5. **Take your photo** and enter your roll number
6. **Submit** your attendance (location is automatically detected)
7. **View** your attendance records and session details on the dashboard

---

## 🐛 **Troubleshooting**

### **Common Issues:**

1. **QR Scanner not working:**
   - Make sure you're using HTTPS or localhost
   - Allow camera permissions in browser
   - Check if html5-qrcode package is installed

2. **CORS Errors:**
   - Verify backend CORS settings allow frontend origin
   - Check if backend is running on correct port (5000)

3. **Location Errors:**
   - Allow location permissions in browser
   - Use HTTPS for production deployment

---

**Made with ❤️ using React, Node.js, and MongoDB**

## Deployment

The application is deployed and accessible at [Attendo Deploy](https://atendo-deploy.onrender.com).


## Contact

For questions or feedback, feel free to contact us at [rahulagniotri4444@gmail.com](mailto:rahulagniotri4444@gmail.com), [dhruvilpatel2002@gmail.com](mailto:dhruvilpatel2002@gmail.com).
