import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Segment.css";
import axios from "axios";
import Navbar from "../components/Navbar";

const Segment = () => {
  const [rules, setRules] = useState([{ field: "", operator: "", value: "" }]);
  const [segmentName, setSegmentName] = useState("");
  const [segments, setSegments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [hoveredTile, setHoveredTile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSegments();
    fetchCustomers();
  }, []);

  const fetchSegments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/segments");
      setSegments(res.data);
    } catch (err) {
      console.error("Failed to fetch segments:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  const addRule = () => {
    setRules([...rules, { field: "", operator: "", value: "" }]);
  };

  const removeRule = (index) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    setRules(updatedRules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/segments/${editingId}`, {
          name: segmentName,
          rules,
        });
        alert("Segment updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/segments", {
          name: segmentName,
          rules,
        });
        alert("Segment saved successfully!");
      }
      setSegmentName("");
      setRules([{ field: "", operator: "", value: "" }]);
      setEditingId(null);
      fetchSegments();
    } catch (err) {
      console.error("Failed to save segment:", err);
      alert("Failed to save segment.");
    }
  };

  const handleEdit = (seg) => {
    setSegmentName(seg.name);
    setRules(seg.rules);
    setEditingId(seg._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this segment?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/segments/${id}`);
      fetchSegments();
    } catch (err) {
      console.error("Failed to delete segment:", err);
      alert("Failed to delete segment.");
    }
  };

  // Apply button handler
  const handleApply = async (seg) => {
  try {
    const res = await axios.post(`http://localhost:5000/api/segments/${seg._id}/apply`);
    setApplyMessage(`✅ Segment "${seg.name}" applied to ${res.data.matchedCount} customer(s)!`);
    fetchCustomers(); // refresh customer list
    setTimeout(() => setApplyMessage(""), 2500);
  } catch (err) {
    console.error("Failed to apply segment:", err);
    setApplyMessage(" Failed to apply segment.");
    setTimeout(() => setApplyMessage(""), 2500);
  }
};


  // Filter segments by search query
  const filteredSegments = segments.filter((seg) =>
    seg.name.toLowerCase().includes(search.toLowerCase())
  );

  // Customer count for each segment
  const getCustomerCount = (segmentName) => {
    return customers.filter(
      (cust) =>
        cust.segmentTags &&
        cust.segmentTags.includes(segmentName)
    ).length;
  };

  return (
    <>
      <Navbar />
      <div className="segment-container">
        <div className="segment-left">
          <h2>{editingId ? "Edit Audience Segment" : "Create Audience Segment"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <input
                type="text"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="Segment Name"
                className="segment-name-input"
                required
              />
            </div>
            <div className="rules-section">
              {rules.map((rule, index) => (
                <div key={index} className="rule-row">
                  <select
                    value={rule.field}
                    onChange={(e) => handleRuleChange(index, "field", e.target.value)}
                  >
                    <option value="">Select Field</option>
                    <option value="spend">Spend</option>
                    <option value="visits">Visits</option>
                    <option value="lastActive">Last Active (days)</option>
                  </select>
                  <select
                    value={rule.operator}
                    onChange={(e) => handleRuleChange(index, "operator", e.target.value)}
                  >
                    <option value="">Operator</option>
                    <option value=">">Greater Than</option>
                    <option value="<">Less Than</option>
                    <option value="=">Equal To</option>
                  </select>
                  <input
                    type="number"
                    value={rule.value}
                    onChange={(e) => handleRuleChange(index, "value", e.target.value)}
                    placeholder="Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="remove-btn"
                    disabled={rules.length === 1}
                    title={rules.length === 1 ? "At least one rule required" : "Remove rule"}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
            <div className="button-row">
              <button type="button" className="add-btn" onClick={addRule}>
                ➕ Add Rule
              </button>
              <button type="submit" className="submit-btn">
                {editingId ? "💾 Update Segment" : "🎯 Save & Preview"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingId(null);
                    setSegmentName("");
                    setRules([{ field: "", operator: "", value: "" }]);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="segment-right">
          <h3>Segment Summary</h3>
          <div className="summary-name">
            <strong>Name:</strong>{" "}
            {segmentName || <span className="summary-placeholder">[No name]</span>}
          </div>
          <ul>
            {rules.map((rule, index) => (
              <li key={index}>
                {rule.field && rule.operator && rule.value ? (
                  `${rule.field} ${rule.operator} ${rule.value}`
                ) : (
                  <span className="summary-placeholder">[Incomplete rule]</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="segment-history-container">
        <div className="segment-history-header">
          <h2>Segment History</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search segments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchSegments}>🔄 Refresh</button>
          </div>
        </div>
        {applyMessage && (
          <div className="apply-message">{applyMessage}</div>
        )}
        <div className="segment-tiles">
          {filteredSegments.length === 0 ? (
            <div className="no-segments">No segments found.</div>
          ) : (
            filteredSegments.map((seg) => (
              <div
                key={seg._id}
                className="segment-tile"
                onMouseEnter={() => setHoveredTile(seg._id)}
                onMouseLeave={() => setHoveredTile(null)}
              >
                <div className="segment-tile-title">
                  {seg.name}
                  <span className="segment-customer-count">
                    {getCustomerCount(seg.name)} customer
                    {getCustomerCount(seg.name) === 1 ? "" : "s"}
                  </span>
                </div>
                <ul>
                  {seg.rules.map((r, idx) => (
                    <li key={idx}>
                      {r.field} {r.operator} {r.value}
                    </li>
                  ))}
                </ul>
                <div className="segment-tile-actions">
                  <button
                    className="edit-btn"
                    title="Edit"
                    onClick={() => handleEdit(seg)}
                  >
                    ✏️
                  </button>
                  <button
                    className="delete-btn"
                    title="Delete"
                    onClick={() => handleDelete(seg._id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="apply-btn"
                    title="Apply"
                    onClick={() => handleApply(seg)}
                  >
                    🚀 Apply
                  </button>
                </div>
                {hoveredTile === seg._id && (
                  <div className="segment-tile-hover">
                    <div>
                      <strong>Created:</strong>{" "}
                      {seg.createdAt
                        ? new Date(seg.createdAt).toLocaleString()
                        : "N/A"}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Segment;
