// components/CustomerTimeline.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomerTimeline.css";

const CustomerTimeline = ({ customerId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!customerId) return;
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/api/logs/customer/${customerId}`);
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to load timeline logs", err);
      }
    };
    fetchLogs();
  }, [customerId]);

  return (
    <div className="timeline-container">
      <h3>📜 Activity Timeline</h3>
      {logs.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <ul className="timeline">
          {logs.map((log) => (
            <li key={log._id}>
              <div className={`status ${log.status}`}>
                <strong>{log.status}</strong> - {log.message}
              </div>
              {log.segmentName && <div>Segment: {log.segmentName}</div>}
              <div className="timestamp">
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerTimeline;
