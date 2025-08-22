import React from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      console.log("Google Login Response:", data);

      if (res.ok) {
        alert("Google login successful!");
        // Save tokens to localStorage or cookies
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
      } else {
        alert(data.error || "Google login failed");
      }
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
