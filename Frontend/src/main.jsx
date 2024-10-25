import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // import Tailwind CSS
import LoginSignup from './LoginSignup';

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <LoginSignup />
  </React.StrictMode>
);
