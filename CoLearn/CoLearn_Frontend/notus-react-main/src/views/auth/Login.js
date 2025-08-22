import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const history = useHistory();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("http://localhost:8000/api/login/", formData, {
        withCredentials: true,
      });

      if (res.status === 200) {
        history.push("/admin/dashboard");
      } else {
        setErrorMessage("Invalid response from server");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Invalid username or password");
    }
  };

  const handleGoogleLogin = () => {
    // Here you'll call your Google login flow
    console.log("Google login clicked");
  };

  const handleGithubLogin = () => {
    // Here you'll call your Github login flow
    console.log("Github login clicked");
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-4/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">Sign in with</h6>
              </div>
              <div className="btn-wrapper text-center">
                <button
                  onClick={handleGithubLogin}
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                >
                  <img
                    alt="Github"
                    className="w-5 mr-1"
                    src={require("assets/img/github.svg").default}
                  />
                  Github
                </button>
                <button
                  onClick={handleGoogleLogin}
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                >
                  <img
                    alt="Google"
                    className="w-5 mr-1"
                    src={require("assets/img/google.svg").default}
                  />
                  Google
                </button>
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>

            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              {errorMessage && (
                <p className="text-red-500 text-sm text-center mb-3">{errorMessage}</p>
              )}

              <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>Or sign in with credentials</small>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                    />
                    <span className="ml-2 text-sm font-semibold text-blueGray-600">
                      Remember me
                    </span>
                  </label>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="submit"
                    className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="flex flex-wrap mt-6 relative">
            <div className="w-1/2">
              <a href="#!" onClick={(e) => e.preventDefault()} className="text-blueGray-200">
                <small>Forgot password?</small>
              </a>
            </div>
            <div className="w-1/2 text-right">
              <Link to="/auth/register" className="text-blueGray-200">
                <small>Create new account</small>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
