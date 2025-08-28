//create a new session component
import React, { useState, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "../styles/StudentForm.css";

const StudentForm = ({ togglePopup }) => {
  //eslint-disable-next-line
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [image, setImage] = useState({ contentType: "", data: "" });
  const [photoData, setPhotoData] = useState(""); // To store the captured photo data
  const videoRef = useRef(null);

  const constraints = {
    video: true,
  };
  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());
    videoRef.current.srcObject = null;
  };
  const capturePhoto = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas
      .getContext("2d")
      .drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const photoDataUrl = canvas.toDataURL("image/png");

    setImage(await fetch(photoDataUrl).then((res) => res.blob()));

    setPhotoData(photoDataUrl);
    stopCamera();
  };
  const ResetCamera = () => {
    setPhotoData("");
    startCamera();
  };

  const AttendSession = async (e) => {
    e.preventDefault();
    let regno = e.target.regno.value;
    //get user IP address
    axios.defaults.withCredentials = false;
    const res = await axios.get("https://api64.ipify.org?format=json");
    axios.defaults.withCredentials = true;
    //
    let IP = res.data.ip;
    if (navigator.geolocation) {
      console.log("Geolocation is supported!");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let locationString = `${latitude},${longitude}`;

          if (regno.length > 0) {
            const formData = {
              token: token,
              regno: regno,
              session_id: localStorage.getItem("session_id"),
              teacher_email: localStorage.getItem("teacher_email"),
              IP: IP,
              date: new Date().toISOString().split("T")[0],
              Location: locationString,
              student_email: localStorage.getItem("email"),
              image: image,
            };
            try {
              console.log("sending data to server");
              const response = await axios.post(
                `${API_BASE_URL}/sessions/attend_session`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              //replace the contents of the popup with success message
              document.querySelector(
                ".form-popup-inner"
              ).innerHTML = `
                <div style="text-align: center; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                  <h3 style="color: #27ae60; margin-bottom: 10px;">Attendance Marked Successfully!</h3>
                  <p style="color: #555; margin-bottom: 20px;">${response.data.message}</p>
                  <button onclick="window.location.reload()" style="
                    background: linear-gradient(135deg, #27ae60, #219a52);
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                  ">Close & Return to Dashboard</button>
                </div>
              `;
            } catch (err) {
              console.error(err);
              // Show error message
              document.querySelector(
                ".form-popup-inner"
              ).innerHTML = `
                <div style="text-align: center; padding: 20px;">
                  <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                  <h3 style="color: #e74c3c; margin-bottom: 10px;">Attendance Failed!</h3>
                  <p style="color: #555; margin-bottom: 20px;">Please try again or contact your teacher.</p>
                  <button onclick="window.location.reload()" style="
                    background: linear-gradient(135deg, #e74c3c, #c0392b);
                    color: white;
                    border: none;
                    padding: 10px 25px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                  ">Try Again</button>
                </div>
              `;
            }
          } else {
            alert("Please fill all the fields");
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="form-popup">
      <button onClick={togglePopup}>
        <strong>X</strong>
      </button>
      <div className="form-popup-inner">
        <h5>Enter Your Details</h5>
        {!photoData && <video ref={videoRef} width={300} autoPlay={true} />}
        {photoData && <img src={photoData} width={300} alt="Captured" />}
        <div className="cam-btn">
          <button onClick={startCamera}>Start Camera</button>
          <button onClick={capturePhoto}>Capture</button>
          <button onClick={ResetCamera}>Reset</button>
        </div>

        <form onSubmit={AttendSession}>
          <input
            type="text"
            name="regno"
            placeholder="RegNo"
            autoComplete="off"
          />
          <button type="submit">Done</button>
        </form>
      </div>
    </div>
  );
};

export default StudentForm;
