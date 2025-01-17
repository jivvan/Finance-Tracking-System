// src/App.js
import React, { useEffect, useState } from "react";
import AppRouter from "./AppRouter";
import { ToastContainer } from "react-toastify";
import LoadingScreen from "./Components/LoadingScreen";
import "react-toastify/dist/ReactToastify.css";
import { useStore } from "./lib/utils";
import { toast } from "react-toastify";
import axios from "axios";
import { Flowbite, DarkThemeToggle } from "flowbite-react";

function App() {
  const [loading, setLoading] = useState(true);
  const setDashSummary = useStore((state) => state.setDashSummary);
  const setCategories = useStore((state) => state.setCategories);
  const setAccounts = useStore((state) => state.setAccounts);
  const setGoals = useStore((state) => state.setGoals);
  const setProfile = useStore((state) => state.setProfile);
  const rehydrate = useStore((state) => state.rehydrateFlag);

  async function fetchCategories(token) {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/categories",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setCategories(response.data);
  }

  async function fetchDashSummary(token) {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/dashboard",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDashSummary(response.data);
  }

  async function fetchAccounts(token) {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/accounts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAccounts(response.data);
  }

  async function fetchGoals(token) {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/api/goals",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setGoals(response.data);
  }

  async function fetchProfile(token) {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/auth/profile",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    setProfile(response.data.user_details);
  }

  async function hydrateData() {
    const token = localStorage.getItem("token");
    if (token !== null) {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashSummary(token),
          fetchAccounts(token),
          fetchCategories(token),
          fetchGoals(token),
          fetchProfile(token),
        ]);
        setLoading(false);
      } catch (e) {
        toast.error("Unable to fetch data");
      }
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    hydrateData();
  }, [rehydrate]);

  return (
    <div>
      <Flowbite>
        {loading ? <LoadingScreen /> : <AppRouter />}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition:Bounce
        />
      </Flowbite>
    </div>
  );
}

export default App;
