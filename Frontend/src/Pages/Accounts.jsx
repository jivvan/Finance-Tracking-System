import React, { useEffect, useState } from "react";
import Header1TEMP from "../Components/Header1TEMP";
import { Card, Button } from "flowbite-react";
import axios from "axios";

function Accounts() {
  const [cardsData, setCardsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://finance-tracking-system.onrender.com/api/accounts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCardsData(response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header1TEMP />
      <div className="px-10 pt-10">
        <div><h1 className="text-2xl style-bold">Accounts</h1></div>
        <div className="flex flex-wrap justify-start mt-8 gap-8">
        {cardsData.map((card, index) => (
          <Card key={index} className="max-w-sm flex flex-col items-center justify-center">
            <div className="flex justify-center items-center mb-4">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/6020/6020687.png" // Placeholder profile image
                    alt="Profile"
                    className="border border-gray-300 rounded-full w-24 h-24 object-cover"
                />
            </div>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center">
              {card.name}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400 text-center">
              Balance: {card.balance}
            </p>
            <Button color="blue" className="bg-blue-500 hover:bg-blue-700 text-white mt-4">
              View Details
              <svg className="-mr-1 ml-2 h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Accounts;