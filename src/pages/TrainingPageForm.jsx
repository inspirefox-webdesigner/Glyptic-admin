// Training Page Form - Training page create/edit કરવા માટે form with 3 boxes
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_CONFIG from "../config/api";

const TrainingPageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
   // Box images state - 3 boxes mate 3 image files
  const [boxImages, setBoxImages] = useState([null, null, null]);
  const [boxImagePreviews, setBoxImagePreviews] = useState(["", "", ""]);
  const [formData, setFormData] = useState({
    pageName: "",
    slug: "",
    boxes: [
      {
        number: 1,
        title: "",
        mainHeading: "",
        mainText: "",
        subHeadings: [{ heading: "", points: [""] }],
        enrollButtonText: "ENROLL NOW",
      },
      {
        number: 2,
        title: "",
        mainHeading: "",
        mainText: "",
        subHeadings: [{ heading: "", points: [""] }],
        enrollButtonText: "ENROLL NOW",
      },
      {
        number: 3,
        title: "",
        mainHeading: "",
        mainText: "",
        subHeadings: [{ heading: "", points: [""] }],
        enrollButtonText: "ENROLL NOW",
      },
    ],
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPage();
    }
  }, [id]);

    // Remove box image
  const handleBoxImageRemove = (boxIndex) => {
    const newImages = [...boxImages];
    newImages[boxIndex] = null;
    setBoxImages(newImages);

    const newPreviews = [...boxImagePreviews];
    newPreviews[boxIndex] = "";
    setBoxImagePreviews(newPreviews);

    // existing saved image pan clear karvo
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].image = "";
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Fetch page data for editing
  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.API_BASE_URL}/training-pages/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching page:", error);
      alert("Failed to load page data");
      navigate("/training-pages");
    } finally {
      setLoading(false);
    }
  };

  // Generate slug from page name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Handle page name change
  const handlePageNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      pageName: name,
      slug: generateSlug(name),
    });
  };

  // Handle box field change
  const handleBoxChange = (boxIndex, field, value) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex][field] = value;
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Add sub-heading to box
  const addSubHeading = (boxIndex) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].subHeadings.push({ heading: "", points: [""] });
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Remove sub-heading from box
  const removeSubHeading = (boxIndex, subHeadingIndex) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].subHeadings.splice(subHeadingIndex, 1);
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Handle sub-heading change
  const handleSubHeadingChange = (boxIndex, subHeadingIndex, field, value) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].subHeadings[subHeadingIndex][field] = value;
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Add point to sub-heading
  const addPoint = (boxIndex, subHeadingIndex) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].subHeadings[subHeadingIndex].points.push("");
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Remove point from sub-heading
  const removePoint = (boxIndex, subHeadingIndex, pointIndex) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].subHeadings[subHeadingIndex].points.splice(
      pointIndex,
      1,
    );
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Handle point change
  const handlePointChange = (boxIndex, subHeadingIndex, pointIndex, value) => {
    const updatedBoxes = [...formData.boxes];
    updatedBoxes[boxIndex].subHeadings[subHeadingIndex].points[pointIndex] =
      value;
    setFormData({ ...formData, boxes: updatedBoxes });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.pageName.trim()) {
      alert("Please enter page name");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Please enter slug");
      return;
    }

    // Validate boxes
    for (let i = 0; i < formData.boxes.length; i++) {
      const box = formData.boxes[i];
      if (!box.title.trim() || !box.mainHeading.trim()) {
        alert(`Please fill all required fields for Box ${i + 1}`);
        return;
      }
    }

    try {
      setLoading(true);
 // Use FormData to support image uploads
      const data = new FormData();
      data.append("pageName", formData.pageName);
      data.append("slug", formData.slug);
      data.append("boxes", JSON.stringify(formData.boxes));
      boxImages.forEach((img, i) => {
        if (img) data.append(`box${i}image`, img);
      });



      if (isEditMode) {
        await axios.put(`${API_CONFIG.API_BASE_URL}/training-pages/${id}`, formData);
        alert("Training page updated successfully");
      } else {
        await axios.post(`${API_CONFIG.API_BASE_URL}/training-pages`, formData);
        alert("Training page created successfully");
      }
      navigate("/training-pages");
    } catch (error) {
      console.error("Error saving page:", error);
      alert(error.response?.data?.message || "Failed to save training page");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="traning-heading">
      <div className="page-header" style={{ marginBottom: "20px" }}>
        <h1 className="page-title">
          {isEditMode ? "Edit Training Page" : "Add New Training Page"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Page Name and Slug */}
        <div className="card" style={{ marginBottom: "20px" }}>
          <div className="traningform-header">
            <h5 style={{ margin: 0, color: "#000" }}>Page Information</h5>
          </div>
          <div className="card-body" style={{ padding: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label className="traningform-label">Page Name *</label>
              <input
                className="traningform-input"
                type="text"
                value={formData.pageName}
                onChange={handlePageNameChange}
                placeholder="Enter page name (e.g., Fire Safety Training)"
                required
              />
            </div>
            <div>
              <label className="traningform-label">Slug (URL) *</label>
              <input
                className="traningform-input"
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="fire-safety-training"
                required
              />
              <small style={{ color: "#666", fontSize: "12px" }}>
                This will be used in the URL: training-page.html?page=
                {formData.slug}
              </small>
            </div>
          </div>
        </div>

        {/* 3 Boxes */}
        {formData.boxes.map((box, boxIndex) => (
          <div key={boxIndex} className="card" style={{ marginBottom: "20px" }}>
            <div className="traningform-header">
              <h5 style={{ margin: 0, color: "#000" }}>Box {box.number}</h5>
            </div>
            <div className="card-body" style={{ padding: "20px" }}>
               <div style={{ marginBottom: "15px" }}>
                <label className="traningform-label">Box Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="traningform-input"
                  onChange={(e) =>
                    handleBoxImageChange(boxIndex, e.target.files[0])
                  }
                />
                {boxImagePreviews[boxIndex] && (
                   <div style={{ position: "relative", display: "inline-block", marginTop: "8px", width: "100%" }}>
                  <img
                    src={boxImagePreviews[boxIndex]}
                    alt={`Box ${box.number} preview`}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      border: "1px solid #ced4da",
                    }}
                  />
                  <button
                      type="button"
                      onClick={() => handleBoxImageRemove(boxIndex)}
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "3px 10px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              {/* Box Title */}
              <div style={{ marginBottom: "15px" }}>
                <label className="traningform-label">Box Title *</label>
                <input
                  className="traningform-input"
                  type="text"
                  value={box.title}
                  onChange={(e) =>
                    handleBoxChange(boxIndex, "title", e.target.value)
                  }
                  placeholder="e.g., Basic Fire Alarm"
                  required
                />
              </div>

              {/* Main Heading */}
              <div style={{ marginBottom: "15px" }}>
                <label className="traningform-label">Main Heading *</label>
                <input
                  type="text"
                  value={box.mainHeading}
                  onChange={(e) =>
                    handleBoxChange(boxIndex, "mainHeading", e.target.value)
                  }
                  placeholder="e.g., Foundation Level"
                  required
                  className="traningform-input"
                />
              </div>

              {/* Main Text */}
              <div style={{ marginBottom: "15px" }}>
                <label className="traningform-label">Main Text</label>
                <textarea
                  value={box.mainText}
                  onChange={(e) =>
                    handleBoxChange(boxIndex, "mainText", e.target.value)
                  }
                  placeholder="Enter main description text"
                  rows={3}
                  className="traningform-input"
                />
              </div>

              {/* Sub-headings */}
              <div style={{ marginBottom: "15px" }}>
                <div className="traningsubheader-box">
                  <label className="traningform-label">Sub-headings</label>
                  <button
                    className="traningsubheading-btn"
                    type="button"
                    onClick={() => addSubHeading(boxIndex)}
                  >
                    + Add Sub-heading
                  </button>
                </div>

                {box.subHeadings.map((subHeading, subIndex) => (
                  <div className="traningform-subindex" key={subIndex}>
                    <div className="traningform-subindex2">
                      <strong style={{ color: "#000" }}>
                        Sub-heading {subIndex + 1}
                      </strong>
                      {box.subHeadings.length > 1 && (
                        <button
                          className="traningsubremove-btn"
                          type="button"
                          onClick={() => removeSubHeading(boxIndex, subIndex)}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={subHeading.heading}
                      onChange={(e) =>
                        handleSubHeadingChange(
                          boxIndex,
                          subIndex,
                          "heading",
                          e.target.value,
                        )
                      }
                      placeholder="Sub-heading title"
                      className="traningform-input"
                    />

                    {/* Points */}
                    <div>
                      <div className="traningsub-points">
                        <label className="traningform-label">Points</label>
                        <button
                          className="traningpoint-btn"
                          type="button"
                          onClick={() => addPoint(boxIndex, subIndex)}
                        >
                          + Add Point
                        </button>
                      </div>

                      {subHeading.points.map((point, pointIndex) => (
                        <div
                          key={pointIndex}
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginBottom: "5px",
                          }}
                        >
                          <input
                            type="text"
                            value={point}
                            onChange={(e) =>
                              handlePointChange(
                                boxIndex,
                                subIndex,
                                pointIndex,
                                e.target.value,
                              )
                            }
                            placeholder={`Point ${pointIndex + 1}`}
                            className="traningform-input"
                          />
                          {subHeading.points.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                removePoint(boxIndex, subIndex, pointIndex)
                              }
                              style={{
                                padding: "6px 10px",
                                backgroundColor: "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "3px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enroll Button Text */}
              <div>
                <label className="traningform-label">Enroll Button Text</label>
                <input
                  type="text"
                  value={box.enrollButtonText}
                  onChange={(e) =>
                    handleBoxChange(
                      boxIndex,
                      "enrollButtonText",
                      e.target.value,
                    )
                  }
                  placeholder="ENROLL NOW"
                  className="traningform-input"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Submit Buttons */}
        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <button
            className="taningformcancel-btn"
            type="button"
            onClick={() => navigate("/training-pages")}
          >
            Cancel
          </button>
          <button
            className="traningformsubmit-btn"
            type="submit"
            disabled={loading}
            style={{
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading ? "#ccc" : "#43a409 ",
            }}
          >
            {loading ? "Saving..." : isEditMode ? "Update Page" : "Create Page"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingPageForm;
