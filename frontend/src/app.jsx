import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Campaigns from "./pages/Campaign";
import Segments from "./pages/Segment";
import LoginPage from "./pages/LoginPage";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/auth/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/customers" element={user ? <Customer /> : <Navigate to="/" />} />
        <Route path="/campaigns" element={user ? <Campaigns /> : <Navigate to="/" />} />
        <Route path="/segments" element={user ? <Segments /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
