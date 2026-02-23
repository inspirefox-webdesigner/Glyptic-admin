import { useState, useEffect } from "react";
import axios from "axios";
import API_CONFIG from "../config/api";

const TrainingPageData = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.API_BASE_URL}/training-enrollments`);
      setEnrollments(response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      alert("Failed to load enrollment data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }

    try {
      await axios.delete(`${API_CONFIG.API_BASE_URL}/training-enrollments/${id}`);
      alert("Enrollment deleted successfully");
      fetchEnrollments();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      alert("Failed to delete enrollment");
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div>
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <h1 className="page-title">Training Page Enrollments</h1>
      </div>

      {enrollments.length === 0 ? (
        <div className="card" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "16px" }}>No enrollments yet</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="enroll-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Page Name</th>
                  <th>Box Title</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr key={enrollment._id}>
                    <td>
                      {new Date(enrollment.submittedAt).toLocaleDateString()}
                    </td>
                    <td>{enrollment.pageName}</td>
                    <td>{enrollment.boxTitle}</td>
                    <td>{enrollment.name}</td>
                    <td>{enrollment.email}</td>
                    <td>{enrollment.phone}</td>
                    <td>{enrollment.address || "N/A"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(enrollment._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
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

export default TrainingPageData;
