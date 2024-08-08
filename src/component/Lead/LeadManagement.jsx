import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LeadManagement.css";

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    product: "A",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchLeads(token, searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000); // Hide message or error after 3 seconds

      return () => clearTimeout(timer); // Clean up the timer if the component unmounts
    }
  }, [message, error]);

  const fetchLeads = async (token, query = "") => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: query,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/lead/",
        config
      );
      setLeads(response.data.leads);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch leads");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/lead/${currentLeadId}`,
          formData,
          config
        );
        setIsEditing(false);
        setCurrentLeadId(null);
        setMessage("Lead updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/lead/", formData, config);
        setMessage("Lead added successfully");
      }
      fetchLeads(token, searchQuery);
      setFormData({
        name: "",
        number: "",
        email: "",
        product: "A",
      });
    } catch (error) {
      console.error(error);
      setError("Failed to save lead");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(`http://localhost:5000/api/lead/${id}`, config);
      fetchLeads(token, searchQuery);
      setMessage("Lead deleted successfully");
    } catch (error) {
      console.error(error);
      setError("Failed to delete lead");
    }
  };

  const handleEdit = (lead) => {
    setFormData({
      name: lead.name,
      number: lead.number,
      email: lead.email,
      product: lead.product,
    });
    setIsEditing(true);
    setCurrentLeadId(lead._id);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token from local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="lead-management-container">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
      <form className="lead-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? "Edit Lead" : "Create Lead"}</h2>
        <div className="form-row">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Number"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
          <button type="submit">
            {isEditing ? "Update Lead" : "Create Lead"}
          </button>
        </div>
      </form>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by name"
        className="search-bar"
      />
      <table className="lead-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Email</th>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td>{lead.name}</td>
              <td>{lead.number}</td>
              <td>{lead.email}</td>
              <td>{lead.product}</td>
              <td>
                <button onClick={() => handleEdit(lead)}>Edit</button>
                <button onClick={() => handleDelete(lead._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadManagement;
