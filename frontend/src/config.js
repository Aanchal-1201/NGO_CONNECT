import { Capacitor } from '@capacitor/core';

const getBaseUrl = () => {
  // 1. If we are testing as a Native App (Android/iOS via Capacitor)
  if (Capacitor.isNativePlatform()) {
    // For local Android Emulator, use 10.0.2.2. 
    // For Production, you would return the Render URL.
    return "https://ngo-connect-backend.onrender.com"; 
  }

  // 2. If we are running on a deployed site (not localhost)
  if (window.location.hostname && window.location.hostname !== 'localhost' && !window.location.hostname.includes('192.168')) {
    return "https://ngo-connect-backend.onrender.com";
  }

  // 3. If testing in web browser over local network (Vite QR Code)
  if (window.location.hostname && window.location.hostname.includes('192.168')) {
    return `http://${window.location.hostname}:3001`;
  }

  // 4. Default to Render URL to ensure it works everywhere by default
  // Change back to "http://localhost:3001" if you want to test with a local backend
  return "https://ngo-connect-backend.onrender.com";
};

const BASE_URL = getBaseUrl();
export default BASE_URL;
