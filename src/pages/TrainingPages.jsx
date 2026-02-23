// Training Pages Management - Admin panel માં training pages create, edit, delete કરવા માટે
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_CONFIG from "../config/api";

const TrainingPages = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  // Fetch all training pages
  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.API_BASE_URL}/training-pages`);
      setPages(response.data);
    } catch (error) {
      console.error("Error fetching training pages:", error);
      alert("Failed to load training pages");
    } finally {
      setLoading(false);
    }
  };

  // Delete training page
  const handleDelete = async (id, pageName) => {
    if (!window.confirm(`Are you sure you want to delete "${pageName}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_CONFIG.API_BASE_URL}/training-pages/${id}`);
      alert("Training page deleted successfully");
      fetchPages();
    } catch (error) {
      console.error("Error deleting training page:", error);
      alert("Failed to delete training page");
    }
  };

  // Toggle active status
  const handleToggleActive = async (id) => {
    try {
      await axios.patch(`${API_CONFIG.API_BASE_URL}/training-pages/${id}/toggle-active`);
      fetchPages();
    } catch (error) {
      console.error("Error toggling active status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading Training Pages...</div>;
  }

  return (
    <div className="traning-heading">
      <div
        className="page-header traning-title"
      >
        <h1 className="page-title">Training Pages</h1>
        <button
          onClick={() => navigate("/training-pages/new")}
          className="btn btn-primary add-traning"
        >
          + Add New Training Page
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="card">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px", color: "#666" }}
          >
            <p>No training pages found. Create your first training page!</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body" style={{ padding: "0" }}>
            <table className="training-table">
              <thead>
                <tr>
                  <th>Page Name</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr
                    key={page._id}
                  >
                    <td style={{ padding: "15px", color: "#000" }}>
                      <strong>{page.pageName}</strong>
                    </td>
                    <td style={{ padding: "15px", color: "#666" }}>
                      {page.slug}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <button
                        onClick={() => handleToggleActive(page._id)}
                        className="active-toggle"
                        style={{
                          backgroundColor: page.isActive
                            ? "#28a745"
                            : "#dc3545",
                        }}
                      >
                        {page.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#666",
                        fontSize: "14px",
                      }}
                    >
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                      <div
                      className="traning-button"
                      >
                        <button
                          onClick={() =>
                            navigate(`/training-pages/edit/${page._id}`)
                          }
                          className="traning-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(page._id, page.pageName)}
                          className="traning-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingPages;
