import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  // Randomly select a joke
  const jokes = [
    "Why don't web developers ever get lost? Because they always follow the 404!",
    "Why did the web developer go broke? Because they used up all their cache!",
    "I asked the web page for directions, but it said, '404: Destination not found.' Guess I'll just wing it! 🐦",
    "Why was the server always cold? Because it left its backend open!",
    "Why did the frontend developer break up with the backend developer? Because they just couldn't align their props!",
    "Why did the CSS file go to therapy? Because it had too many issues with its selectors!",
    "Why did the JavaScript developer go to the gym? To improve their functionality!",
    "Why did the database administrator leave the party? Because they couldn't handle the commitment!",
    "Why did the API go on a diet? Because it had too many endpoints!",
    "Why don't programmers like nature? Because it has too many bugs!",
  ];

  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Funny Message */}
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-8 text-2xl text-gray-600">
        Oops! The page you're looking for has gone on a vacation. 🏖️
      </p>

      {/* Button to Go Back Home */}
      <Button
        color="blue"
        onClick={() => navigate("/")}
        className="px-6 py-3 text-lg"
      >
        Take Me Back Home
      </Button>

      {/* Funny Footer */}
      <p className="mt-8 text-sm text-gray-500">
        In the meantime, here's a joke: {randomJoke}
      </p>
    </div>
  );
}
