import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom"; // v5 navigation

export default function VerifyOtp() {
  const location = useLocation();
  const history = useHistory();

  const [userId, setUserId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.user_id) {
      setUserId(location.state.user_id);
    } else {
      setMessage("User ID not found. Please register again.");
    }
  }, [location.state]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otpCode) {
      setMessage("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/api/verify-otp/", {
        user_id: userId,
        otp_code: otpCode,
      });

      setMessage(res.data.message || "OTP verified successfully!");
      setTimeout(() => history.push("/auth/login"), 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.error || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-blueGray-800 py-10">
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="w-full lg:w-5/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">
                  Verify Your OTP
                </h6>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form onSubmit={handleVerify}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="otp"
                  >
                    OTP Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 
                               bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                  />
                </div>

                {message && (
                  <p
                    className={`text-center mb-4 text-sm font-medium ${
                      message.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    disabled={loading || !otpCode}
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold 
                               uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none 
                               focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150
                               disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
