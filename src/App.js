import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";

function Home() {
  const [data, setData] = useState("Loading msg from API...");

  useEffect(() => {
    (async function () {
      const API_PATH = "api/orchestrators/HelloOrchestrator";

      // get the status query from the orchestrator
      let { statusQueryGetUri } = await (await fetch(API_PATH)).json();
      // remove the host name from the status query
      statusQueryGetUri = statusQueryGetUri.substring(
        statusQueryGetUri.indexOf("/runtime/")
      );
      console.log(statusQueryGetUri);

      let statusJson = await (await fetch(statusQueryGetUri)).json();
      console.log(statusJson);

      // wait for the function to complete
      while (
        statusJson.runtimeStatus === "Running" ||
        statusJson.runtimeStatus === "Pending"
      ) {
        // sleep 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));

        statusJson = await (await fetch(statusQueryGetUri)).json();
        console.log(statusJson);
      }

      // display the output
      console.log(typeof statusJson.output);
      console.log("HELLO");
      setData(statusJson.output.join(", "));
    })();
  }, []);

  return (
    <div>
      <h1>TEST</h1>
      <div>{data}</div>
    </div>
  );
}

function About() {
  return <div>About, yo why you no work</div>;
}

function Navbar() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
