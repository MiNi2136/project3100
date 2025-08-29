import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import { Student } from "../model/Student.js";
import { Teacher } from "../model/Teacher.js";
import JWT from "../middleware/JWT.js";

//login
async function Login(req, res) {
  const { email, password } = req.body;
  let type = "student";
  //check if user is a student
  let user = await Student.findOne({ email });
  if (!user) {
    type = "teacher";
    user = await Teacher.findOne({ email });
  }

  if (user) {
    if (user.password === password) {
      const token = JWT.generateToken({ email: user.email });
      user.type = type;
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .status(200)
        .json({ user: user, type: type, token: token });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } else {
    res.status(400).json({ message: "No such User" });
  }
}
// Create a new user
async function Signup(req, res) {
  const { name, email, pno, dob, password, type } = req.body;
  if (type === "student") {
    const user = new Student({
      name: name,
      email: email,
      pno: pno,
      dob: dob,
      password: password,
    });
    try {
      const existingUser = await Student.findOne({ email: email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const newUser = await user.save();
        res.status(201).json(newUser);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  } else {
    const user = new Teacher({
      name: name,
      email: email,
      pno: pno,
      dob: dob,
      password: password,
    });
    try {
      const existingUser = await Teacher.findOne({ email: email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const newUser = await user.save();
        res.status(201).json(newUser);
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
//change password
async function ForgotPassword(req, res) {
  const { email, password } = req.body;
  //check if user is a student
  let user = await Student.findOneAndUpdate({ email }, { password }).exec();
  if (!user) {
    user = await Teacher.findOneAndUpdate({ email }, { password }).exec();
  }
  if (user) {
    res.status(200).json({ message: "Password changed successfully" });
  } else {
    res.status(400).json({ message: "No such User" });
  }
}

//edit user details
async function EditUserDetails(req, res) {
  const { email, name, pno, dob } = req.body;
  //check if user is a student
  let user = await Student.findOneAndUpdate({ email }, { name, pno, dob }).exec();
  if (!user) {
    user = await Teacher.findOneAndUpdate({ email }, { name, pno, dob }).exec();
  }
  if (user) {
    res.status(200).json({ message: "User updated" });
  }
}

// Get user profile
async function GetProfile(req, res) {
  try {
    const { token } = req.body;
    
    // Verify token and get user email
    const decoded = JWT.verifyTokenDirect(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const email = decoded.email;
    let user = null;
    let userType = "student";
    
    // Check if user is a student
    user = await Student.findOne({ email }).select('-password');
    if (!user) {
      userType = "teacher";
      user = await Teacher.findOne({ email }).select('-password');
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Add userType to user object
    const userWithType = {
      ...user.toObject(),
      userType: userType
    };
    
    res.status(200).json({ user: userWithType });
  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Update user profile
async function UpdateProfile(req, res) {
  try {
    const { token, name, email: newEmail, password, phone, designation, department } = req.body;
    
    // Verify token and get user email
    const decoded = JWT.verifyTokenDirect(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    const currentEmail = decoded.email;
    let user = null;
    let userType = "student";
    let updateData = {};
    
    // Prepare update data
    if (name) updateData.name = name;
    if (newEmail && newEmail !== currentEmail) updateData.email = newEmail;
    if (password) updateData.password = password;
    if (phone) updateData.pno = phone; // Using 'pno' as it's the field name in the models
    
    // Check if user is a student
    user = await Student.findOne({ email: currentEmail });
    if (!user) {
      userType = "teacher";
      user = await Teacher.findOne({ email: currentEmail });
      
      // Add teacher-specific fields
      if (designation) updateData.designation = designation;
      if (department) updateData.department = department;
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update the user
    let updatedUser = null;
    if (userType === "student") {
      updatedUser = await Student.findOneAndUpdate(
        { email: currentEmail },
        updateData,
        { new: true }
      ).select('-password');
    } else {
      updatedUser = await Teacher.findOneAndUpdate(
        { email: currentEmail },
        updateData,
        { new: true }
      ).select('-password');
    }
    
    // Add userType to response
    const userWithType = {
      ...updatedUser.toObject(),
      userType: userType
    };
    
    res.status(200).json({ 
      message: "Profile updated successfully",
      user: userWithType 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
}

//send mail
function SendMail(req, res) {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP for registration",
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "OTP sent successfully", otp: otp });
    }
  });
}

const UserController = {
  Login,
  Signup,
  ForgotPassword,
  EditUserDetails,
  SendMail,
  GetProfile,
  UpdateProfile,
};

export default UserController;
