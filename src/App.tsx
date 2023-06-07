import { useEffect, useState } from "react";
import { Libp2p } from "libp2p";
import { createLibp2pWithConfig } from "./createLibp2pWithConfig";

localStorage.debug = "libp2p:*";

function App() {
  const [libp2p, setLibp2p] = useState<null | Libp2p>(null);
  const [isRunning, setIsRunning] = useState(false);

  const create = async () => {
    if (libp2p !== null) return;
    setLibp2p(await createLibp2pWithConfig());
  };

  useEffect(() => {
    if (libp2p) {
      (window as any).libp2p = libp2p;
    }
  }, [libp2p]);
  try {
    console.log(libp2p.services.pubsub.status.registrarTopologyIds);
    console.log(libp2p.services.pubsub.components.registrar.topologies);
  } catch (error) {}

  return (
    <>
      <div id="container"></div>
      {libp2p == null ? (
        <button onClick={create}>Create</button>
      ) : isRunning ? (
        <button
          onClick={async () => {
            await libp2p.stop();
            setIsRunning(false);
          }}
        >
          Stop
        </button>
      ) : (
        <button
          onClick={async () => {
            await libp2p.start();
            setIsRunning(true);
          }}
        >
          Start
        </button>
      )}

      {/* {libp2p !== null && (

        )} */}
    </>
  );
}

export default App;
