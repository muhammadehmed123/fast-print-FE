// src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authService";

export default function VerifyEmail() {
  const { uidb64, token } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail(uidb64, token)
      .then(() => {
        setMsg("Email verified! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch(() => setMsg("Invalid or expired verification link."));
  }, [uidb64, token, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      <p>{msg}</p>
    </div>
  );
}
