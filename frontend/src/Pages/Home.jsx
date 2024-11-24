// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="py-16 m-auto dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-center px-6 py-8 mx-auto">
        <h1 className="mb-4 text-4xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to Finance Tracker
        </h1>
        <p className="mb-8 text-lg text-center text-gray-700 dark:text-gray-300">
          Manage your finances with ease and confidence. Track your income,
          expenses, and savings effortlessly.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/signup"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign Up Today!
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;
