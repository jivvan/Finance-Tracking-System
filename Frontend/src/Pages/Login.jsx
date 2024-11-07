// src/pages/Login.jsx
import React, { useState } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/auth/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        alert("Login successful!");
        localStorage.setItem("token", response.data.access_token);
        navigate("/Dashboard");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("There was an error!", error);
      if (error.response) {
        alert(
          `Login failed: ${error.response.data.message || "Unknown error"}`
        );
      } else if (error.request) {
        alert("No response received from the server. Please try again later.");
      } else {
        alert(
          "An error occurred while setting up the request. Please try again."
        );
      }
    }
  };

  return (
    <section className="dark:bg-gray-900 py-14">
      <div className="container flex items-center justify-between mx-auto">
        <div className="w-1/2 mb-32 ml-28 ">
          <h1 className="text-4xl font-bold text-left text-blue-600">
            Welcome back!
          </h1>
          <p className="mt-2 text-2xl text-left text-gray-900 dark:text-white">
            Manage your finances with ease and confidence.
          </p>
        </div>
        <div className="flex justify-end w-1/2 mr-32 ">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-center">
                Log In
              </h1>
              <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400">
                Are you new to Finance Tracker?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <Label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </Label>
                  <TextInput
                    type="text"
                    name="username"
                    id="username"
                    placeholder=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </Label>
                  <TextInput
                    type="password"
                    name="password"
                    id="password"
                    placeholder=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox
                        id="remember"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </Label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <Button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Sign in
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
