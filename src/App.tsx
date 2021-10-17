import "./App.css";

import { useEffect, useState } from "react";
import { HiStatusOnline, HiStatusOffline } from "react-icons/hi";

export interface NetworkState {
  since?: Date;
  online?: boolean;
  rtt?: number;
  type?: string;
  downlink?: number;
  saveData?: boolean;
  downlinkMax?: number;
  effectiveType?: string;
}

function getConnection() {
  const nav = navigator as any;
  if (typeof nav !== "object") return null;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

function getConnectionProperty(): NetworkState {
  const c = getConnection();
  if (!c) return {};
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType,
  };
}

function useNetwork(): NetworkState {
  const [state, setState] = useState(() => {
    return {
      since: undefined,
      online: navigator.onLine,
      ...getConnectionProperty(),
    };
  });

  useEffect(() => {
    const onOnline = () => {
      setState((prevState) => ({
        ...prevState,
        online: true,
        since: new Date(),
      }));
    };

    const onOffline = () => {
      setState((prevState) => ({
        ...prevState,
        online: false,
        since: new Date(),
      }));
    };

    const onConnectionChange = () => {
      setState((prevState) => ({
        ...prevState,
        ...getConnectionProperty(),
      }));
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const connection = getConnection();
    connection?.addEventListener("change", onConnectionChange);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      connection?.removeEventListener("change", onConnectionChange);
    };
  }, []);

  return state;
}

function App() {
  const { online } = useNetwork();

  return (
    <div className="App">
      <header className="App-header">
        {online ? (
          <h1>
            You are online <HiStatusOnline />
          </h1>
        ) : (
          <h1>
            You are offline <HiStatusOffline />
          </h1>
        )}
      </header>
    </div>
  );
}

export default App;
