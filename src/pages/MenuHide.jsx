import { useState, useEffect } from "react";
import axios from "axios";
import API_CONFIG from "../config/api";
import Toast from "../components/Toast";
import "./ProductOrdering.css";

const MenuHide = () => {
  const [activeTab, setActiveTab] = useState("category");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [hiddenCategories, setHiddenCategories] = useState([]);
  const [hiddenBrands, setHiddenBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [catsRes, brandsRes, hideCatRes, hideBrandRes] = await Promise.all([
        axios.get(`${API_CONFIG.API_BASE_URL}/products/categories`),
        axios.get(`${API_CONFIG.API_BASE_URL}/products/brands`),
        axios.get(`${API_CONFIG.API_BASE_URL}/menu-hide/category`),
        axios.get(`${API_CONFIG.API_BASE_URL}/menu-hide/brand`),
      ]);
      setCategories(catsRes.data || []);
      setBrands(brandsRes.data || []);
      setHiddenCategories(hideCatRes.data || []);
      setHiddenBrands(hideBrandRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHide = (item, type) => {
    if (type === "category") {
      setHiddenCategories((prev) =>
        prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
      );
    } else {
      setHiddenBrands((prev) =>
        prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
      );
    }
  };

  const saveHidden = async (type) => {
    setLoading(true);
    const hidden = type === "category" ? hiddenCategories : hiddenBrands;
    try {
      await axios.put(`${API_CONFIG.API_BASE_URL}/menu-hide/${type}`, { hidden });
      setToast({
        show: true,
        message: `${type === "category" ? "Category" : "Brand"} visibility saved!`,
        type: "success",
      });
    } catch (error) {
      setToast({ show: true, message: "Error saving visibility", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderList = (list, hiddenList, type) => (
    <div className="products-list">
      <p className="help-text">
        Select {type === "category" ? "categories" : "brands"} to hide from the frontend menu. Hidden items won't appear in the navigation.
      </p>
      {list.length === 0 ? (
        <div className="no-products">No {type === "category" ? "categories" : "brands"} found.</div>
      ) : (
        <>
          <div className="product-items">
            {list.map((item) => {
              const isHidden = hiddenList.includes(item);
              return (
                <div key={item} className="product-order-item">
                  <div className="product-info">
                    <span
                      className="product-title"
                      style={{ textDecoration: isHidden ? "line-through" : "none", color: isHidden ? "#a0aec0" : "#000" }}
                    >
                      {item}
                    </span>
                    {isHidden && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          background: "#fed7d7",
                          color: "#c53030",
                          padding: "2px 8px",
                          borderRadius: "12px",
                        }}
                      >
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="product-actions">
                    <button
                      type="button"
                      className={`btn btn-sm ${isHidden ? "btn-success" : "btn-danger"}`}
                      onClick={() => toggleHide(item, type)}
                    >
                      {isHidden ? "Unhide" : "Hide"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="save-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => saveHidden(type)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="page-header">
        <h1 className="page-title">Products Menu Hide</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "0" }}>
            <button
              type="button"
              onClick={() => setActiveTab("category")}
              style={{
                padding: "0.6rem 1.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: activeTab === "category" ? "700" : "400",
                color: activeTab === "category" ? "#667eea" : "#718096",
                borderBottom: activeTab === "category" ? "3px solid #667eea" : "3px solid transparent",
                marginBottom: "-2px",
                fontSize: "1rem",
              }}
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("brand")}
              style={{
                padding: "0.6rem 1.5rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: activeTab === "brand" ? "700" : "400",
                color: activeTab === "brand" ? "#667eea" : "#718096",
                borderBottom: activeTab === "brand" ? "3px solid #667eea" : "3px solid transparent",
                marginBottom: "-2px",
                fontSize: "1rem",
              }}
            >
              Brands
            </button>
          </div>

          {loading && <div className="loading">Loading...</div>}

          {!loading && activeTab === "category" &&
            renderList(categories, hiddenCategories, "category")}

          {!loading && activeTab === "brand" &&
            renderList(brands, hiddenBrands, "brand")}
        </div>
      </div>
    </div>
  );
};

export default MenuHide;
