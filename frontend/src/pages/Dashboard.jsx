import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import Navbar from "../components/Navbar";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

axios.defaults.baseURL = "http://localhost:5000";

const handleLogout = () => {
  window.location.href = "http://localhost:5000/auth/logout";
};

const Dashboard = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [segmentCount, setSegmentCount] = useState(0);
  const [campaignCount, setCampaignCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [segments, setSegments] = useState([]);
  const [filters, setFilters] = useState({
    segmentId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resCustomers, resSegments, resCampaigns] = await Promise.all([
          axios.get("/api/customers/count"),
          axios.get("/api/segments"),
          axios.get("/api/campaigns/count"),
        ]);

        setCustomerCount(resCustomers.data.count || 0);
        setSegmentCount(resSegments.data.length || 0);
        setSegments(resSegments.data || []);
        setCampaignCount(resCampaigns.data.count || 0);

        fetchLogs();
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        // Dummy counts fallback
        setCustomerCount(120);
        setSegmentCount(5);
        setCampaignCount(8);
      }
    };

    fetchInitialData();
  }, []);

  // const fetchLogs = async () => {
  //   try {
  //     const response = await axios.get("/api/campaigns/logs", {
  //       params: filters,
  //     });
  //     const data = response.data || [];

  //     if (data.length === 0) {
  //       // Dummy data fallback
  //       const mockLogs = [
  //         { status: "SENT", timestamp: new Date() },
  //         { status: "SENT", timestamp: new Date() },
  //         { status: "FAILED", timestamp: new Date() },
  //       ];
  //       setLogs(mockLogs);
  //     } else {
  //       setLogs(data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching campaign logs:", error);
  //     // Dummy logs fallback
  //     const mockLogs = [
  //       { status: "SENT", timestamp: new Date() },
  //       { status: "SENT", timestamp: new Date() },
  //       { status: "FAILED", timestamp: new Date() },
  //     ];
  //     setLogs(mockLogs);
  //   }
  // };

  const fetchLogs = async () => {
  try {
    const response = await axios.get("/api/campaigns/logs", {
      params: filters,
    });
    const data = response.data || [];

    if (data.length === 0) {
      const mockLogs = [
        { status: "SENT", timestamp: new Date("2024-12-01") },
        { status: "SENT", timestamp: new Date("2024-12-01") },
        { status: "SENT", timestamp: new Date("2024-12-02") },
        { status: "FAILED", timestamp: new Date("2024-12-02") },
        { status: "SENT", timestamp: new Date("2024-12-03") },
        { status: "SENT", timestamp: new Date("2024-12-04") },
        { status: "FAILED", timestamp: new Date("2024-12-04") },
        { status: "SENT", timestamp: new Date("2024-12-05") },
        { status: "SENT", timestamp: new Date("2024-12-06") },
        { status: "SENT", timestamp: new Date("2024-12-06") },
      ];
      setLogs(mockLogs);
    } else {
      setLogs(data);
    }
  } catch (error) {
    console.error("Error fetching campaign logs:", error);
    const mockLogs = [
      { status: "SENT", timestamp: new Date("2024-12-01") },
      { status: "SENT", timestamp: new Date("2024-12-01") },
      { status: "SENT", timestamp: new Date("2024-12-02") },
      { status: "FAILED", timestamp: new Date("2024-12-02") },
      { status: "SENT", timestamp: new Date("2024-12-03") },
      { status: "SENT", timestamp: new Date("2024-12-04") },
      { status: "FAILED", timestamp: new Date("2024-12-04") },
      { status: "SENT", timestamp: new Date("2024-12-05") },
      { status: "SENT", timestamp: new Date("2024-12-06") },
      { status: "SENT", timestamp: new Date("2024-12-06") },
    ];
    setLogs(mockLogs);
  }
};


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchLogs();
  };

  // Line Chart Data
  const dateMap = {};
  logs.forEach((log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!dateMap[date]) dateMap[date] = 0;
    if (log.status === "SENT") dateMap[date]++;
  });

  const lineLabels = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));
  const lineDataPoints = lineLabels.map((date) => dateMap[date]);

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Campaigns Sent",
        data: lineDataPoints,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.2,
      },
    ],
  };

  // Pie Chart Data
  const sentCount = logs.filter((log) => log.status === "SENT").length;
  const failedCount = logs.filter((log) => log.status === "FAILED").length;

  const pieData = {
    labels: ["Sent", "Failed"],
    datasets: [
      {
        data: [sentCount, failedCount],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h2> 📊 CRM Dashboard
        <button onClick={handleLogout} style={{ float: "right", padding: "6px 12px" }}>
        Logout
        </button>
        </h2>

        <div className="dashboard-stats">
          <div className="stat-card">👤 Total Customers: {customerCount}</div>
          <div className="stat-card">🎯 Total Segments: {segmentCount}</div>
          <div className="stat-card">📬 Total Campaigns: {campaignCount}</div>
        </div>

        <div className="filter-bar">
          <select name="segmentId" value={filters.segmentId} onChange={handleFilterChange}>
            <option value="">All Segments</option>
            {segments.map((seg) => (
              <option key={seg._id} value={seg._id}>
                {seg.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />

          <button onClick={handleApplyFilters}>Apply Filters</button>
        </div>

        <div className="dashboard-charts">
          <div className="chart-container">
            <h3>📈 Campaign Trends</h3>
            <Line data={lineData} />
          </div>
          <div className="chart-container">
            <h3>📊 Delivery Stats</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
