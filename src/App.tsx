import "./App.css";

import { TID } from "@atproto/common-web";
import { useState } from "react";

import viteLogo from "/vite.svg";

import reactLogo from "./assets/react.svg";
import { agent } from "./lib";

function App() {
  const [count] = useState(0);

  const handleClick = () => {
    void agent.com.atproto.repo
      .putRecord({
        collection: "dev.unsocial.pds.test",
        repo: "compeito.pds.unsocial.dev",
        rkey: TID.next().str,
        record: {
          timestamp: new Date().toISOString(),
        },
        validate: false,
      })
      .then(console.log);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => handleClick()}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
