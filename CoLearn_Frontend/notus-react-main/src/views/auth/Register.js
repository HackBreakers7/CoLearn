import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle regular inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle skill entry
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!skills.includes(inputValue.trim())) {
        setSkills([...skills, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  // Remove skill
  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Submit form to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        skills: skills,
      };

      const res = await axios.post("http://127.0.0.1:8000/api/register/", payload);
      setSuccess(res.data.message);
      setFormData({
        full_name: "",
        username: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
      });
      setSkills([]);
      
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">
                  Sign up with
                </h6>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>Or sign up with credentials</small>
              </div>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

              <form onSubmit={handleSubmit}>
                {/* Name + Username */}
                <div className="flex flex-col md:flex-row gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      style={{ width: "95%" }}
                      placeholder="Name"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      style={{ width: "95%" }}
                      placeholder="Username"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="flex flex-col md:flex-row gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      style={{ width: "95%" }}
                      placeholder="Email"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      style={{ width: "95%" }}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Skills
                  </label>
                  <div
                    className="border border-gray-300 rounded-lg p-2 bg-white shadow-sm"
                    style={{ width: "98%" }}
                  >
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full border-0 focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                    {skills.length > 0 && (
                      <div className="flex flex-wrap mt-2 gap-2">
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm shadow-md transition-transform transform hover:scale-105"
                          >
                            <span className="mr-2 font-medium">{skill}</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-colors duration-200"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password + Confirm Password */}
                <div className="flex flex-col md:flex-row gap-4 mb-3">
                  <div className="flex-1">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      style={{ width: "95%" }}
                      placeholder="Password"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      style={{ width: "95%" }}
                      placeholder="Confirm Password"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                  <button
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
