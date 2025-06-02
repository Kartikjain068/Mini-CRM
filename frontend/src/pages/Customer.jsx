import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Customer.css";
import Navbar from "../components/Navbar";

const Customer = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    totalSpend: "",
    visitCount: "",
    lastPurchase: "",
  });

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [loadingSummaries, setLoadingSummaries] = useState({});
  
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to fetch customers.");
    }
  };

  const fetchActivityLogs = async (customerId) => {
    setActivityLogs([]); // Placeholder, adjust when activity log feature is implemented
  };

  const handleCustomerClick = async (cust) => {
    setSelectedCustomer(cust);
    await fetchActivityLogs(cust._id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setActivityLogs([]);
  };

  const handleCloseSummaryModal = () => {
    setShowSummaryModal(false);
    setSummaryContent("");
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customers", form);
      setCustomers([...customers, res.data]);
      setForm({
        name: "",
        email: "",
        phone: "",
        totalSpend: "",
        visitCount: "",
        lastPurchase: "",
      });
      setMessage("✅ Customer added successfully!");
      setError("");
    } catch (err) {
      setError("❌ Failed to add customer.");
      setMessage("");
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const generateSummary = async (cust) => {
    try {
      setLoadingSummaries((prev) => ({ ...prev, [cust._id]: true }));
      const res = await axios.post("http://localhost:5000/api/ai/summary", {
        customer: cust,
      });
      setSummaryContent(res.data.summary);
      setSelectedCustomer(cust);
      setShowSummaryModal(true);
    } catch (error) {
      console.error("Summary generation failed:", error);
      setSummaryContent("Failed to generate summary.");
      setSelectedCustomer(cust);
      setShowSummaryModal(true);
    } finally {
      setLoadingSummaries((prev) => ({ ...prev, [cust._id]: false }));
    }
  };

  const segmentCounts = {};
  customers.forEach((cust) => {
    cust.segmentTags?.forEach((tag) => {
      segmentCounts[tag] = (segmentCounts[tag] || 0) + 1;
    });
  });

  const allSegments = Object.keys(segmentCounts).sort();

  const filteredCustomers = customers.filter((cust) => {
    const inSegment =
      !selectedSegment || cust.segmentTags?.includes(selectedSegment);
    const matchesSearch =
      cust.name.toLowerCase().includes(search) ||
      cust.email.toLowerCase().includes(search);
    return inSegment && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <div className="customer-page">
        <div className="customer-form-section">
          <h2>Add Customer</h2>
          <form onSubmit={handleSubmit} className="customer-form">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            <input type="number" name="totalSpend" value={form.totalSpend} onChange={handleChange} placeholder="Total amount spent" min="0" />
            <input type="number" name="visitCount" value={form.visitCount} onChange={handleChange} placeholder="Number of visits" min="0" />
            <input type="date" name="lastPurchase" value={form.lastPurchase} onChange={handleChange} />
            <button type="submit">Add</button>
          </form>
          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
        </div>

        <div className="customer-list-section">
          <div className="customer-filters">
            <select value={selectedSegment} onChange={(e) => setSelectedSegment(e.target.value)} className="segment-filter-dropdown">
              <option value="">All Segments</option>
              {allSegments.map((seg) => (
                <option key={seg} value={seg}>{seg}</option>
              ))}
            </select>
            <div className="segment-counts">
              {allSegments.map((seg) => (
                <span key={seg} className="segment-count-badge">
                  {seg}: {segmentCounts[seg]}
                </span>
              ))}
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Search customers..." value={search} onChange={handleSearch} />
            </div>
          </div>

          <div className="customer-grid">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust) => (
                <div key={cust._id} className="customer-card" onClick={() => handleCustomerClick(cust)}>
                  <h3>{cust.name}</h3>
                  <p><strong>Email:</strong> {cust.email}</p>
                  <p><strong>Phone:</strong> {cust.phone || cust.mobile || "N/A"}</p>
                  <p><strong>Total Spend:</strong> ${cust.totalSpend || 0}</p>
                  <p><strong>Visits:</strong> {cust.visitCount || 0}</p>
                  <p><strong>Last Purchase:</strong> {cust.lastPurchase ? new Date(cust.lastPurchase).toLocaleDateString() : "N/A"}</p>
                  {cust.segmentTags?.length > 0 && (
                    <p><strong>Segments:</strong> {cust.segmentTags.join(", ")}</p>
                  )}
                  <button className="ai-summary-button" onClick={(e) => { e.stopPropagation(); generateSummary(cust); }}>
                    {loadingSummaries[cust._id] ? "Loading..." : "Generate Summary"}
                  </button>
                </div>
              ))
            ) : (
              <p>No customers found.</p>
            )}
          </div>
        </div>
      </div>

      {/* === Customer Activity Modal === */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h3>Activity Timeline for {selectedCustomer?.name}</h3>
            {activityLogs.length > 0 ? (
              <ul className="activity-list">
                {activityLogs.map((log) => (
                  <li key={log._id}>
                    <strong>{log.status}</strong> - {log.message} <br />
                    <small>{new Date(log.createdAt).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No activity found for this customer.</p>
            )}
          </div>
        </div>
      )}

      {/* === AI Summary Modal === */}
      {showSummaryModal && (
        <div className="modal-overlay" onClick={handleCloseSummaryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseSummaryModal}>×</button>
            <h3>AI Summary for {selectedCustomer?.name}</h3>
            <p className="ai-summary">{summaryContent}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Customer;
