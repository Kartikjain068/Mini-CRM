// src/pages/Campaign.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Campaign.css";
import Navbar from "../components/Navbar";

const Campaigns = () => {
  const [segments, setSegments] = useState([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState("");
  const [message, setMessage] = useState("");
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchSegments();
    fetchCampaigns();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await axios.get("/api/segments");
      setSegments(res.data);
    } catch (err) {
      console.error("Failed to fetch segments", err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("/api/campaigns");
      setCampaigns(res.data);
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  };

  const handleLaunchCampaign = async () => {
    if (!selectedSegmentId || !message.trim()) return alert("Fill all fields!");

    try {
      await axios.post("/api/campaigns", {
        segmentId: selectedSegmentId,
        message,
      });
      alert("🚀 Campaign Launched!");
      setMessage("");
      fetchCampaigns();
    } catch (err) {
      console.error("Launch error", err);
      alert("Failed to launch campaign");
    }
  };

  return (
    <>
      <Navbar />
      <div className="campaigns-container">
        <h2>📢 Launch a Campaign</h2>
        <div className="campaign-form">
          <select
            value={selectedSegmentId}
            onChange={(e) => setSelectedSegmentId(e.target.value)}
          >
            <option value="">Select Segment</option>
            {segments.map((seg) => (
              <option key={seg._id} value={seg._id}>
                {seg.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Enter campaign message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleLaunchCampaign}>Launch Campaign</button>
        </div>

        <h3>📜 Past Campaigns</h3>
        <div className="campaign-history">
          {campaigns.map((c) => (
            <div key={c._id} className="campaign-card">
              <p><strong>Segment:</strong> {c.segmentName || "N/A"}</p>
              <p><strong>Message:</strong> {c.message}</p>
              <p><strong>Status:</strong> ✅ {c.delivered}/{c.total}</p>
              <p><strong>Date:</strong> {new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Campaigns;
