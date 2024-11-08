import flowbite from "flowbite/plugin";
import flowbite_react from "flowbite-react/tailwind";

export default {
  content: [
    flowbite_react.content(),
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js", // Add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite, flowbite_react.plugin()],
};
