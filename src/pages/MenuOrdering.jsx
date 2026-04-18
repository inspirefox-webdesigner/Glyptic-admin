import { useState, useEffect } from "react";
import axios from "axios";
import API_CONFIG from "../config/api";
import Toast from "../components/Toast";
import "./ProductOrdering.css";

const MenuOrdering = () => {
  const [activeTab, setActiveTab] = useState("category");
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [brandOrder, setBrandOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [allCatsRes, allBrandsRes, catOrderRes, brandOrderRes] = await Promise.all([
        axios.get(`${API_CONFIG.API_BASE_URL}/products/categories`),
        axios.get(`${API_CONFIG.API_BASE_URL}/products/brands`),
        axios.get(`${API_CONFIG.API_SECOUNDBASE_URL}/menu-order/category`),
        axios.get(`${API_CONFIG.API_SECOUNDBASE_URL}/menu-order/brand`),
      ]);

      const allCats = allCatsRes.data || [];
      const allBrands = allBrandsRes.data || [];
      const savedCatOrder = catOrderRes.data || [];
      const savedBrandOrder = brandOrderRes.data || [];

      // Merge: saved order first, then any new items not yet in saved order
      const mergedCats = [
        ...savedCatOrder.filter((c) => allCats.includes(c)),
        ...allCats.filter((c) => !savedCatOrder.includes(c)),
      ];
      const mergedBrands = [
        ...savedBrandOrder.filter((b) => allBrands.includes(b)),
        ...allBrands.filter((b) => !savedBrandOrder.includes(b)),
      ];

      setCategoryOrder(mergedCats);
      setBrandOrder(mergedBrands);
    } catch (error) {
      console.error("Error fetching menu order:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveItem = (list, setList, index, direction) => {
    const newList = [...list];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setList(newList);
  };

  const saveOrder = async (type) => {
    setLoading(true);
    const order = type === "category" ? categoryOrder : brandOrder;
    try {
      await axios.put(`${API_CONFIG.API_BASE_URL}/menu-order/${type}`, { order });
      setToast({ show: true, message: `${type === "category" ? "Category" : "Brand"} menu order saved!`, type: "success" });
    } catch (error) {
      setToast({ show: true, message: "Error saving order", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const renderList = (list, setList, type) => (
    <div className="products-list">
      <p className="help-text">
        Use the arrows to set the order in which {type === "category" ? "categories" : "brands"} appear in the frontend menu.
      </p>
      {list.length === 0 ? (
        <div className="no-products">No {type === "category" ? "categories" : "brands"} found.</div>
      ) : (
        <>
          <div className="product-items">
            {list.map((item, index) => (
              <div key={item} className="product-order-item">
                <div className="product-info">
                  <span className="position-number">{index + 1}</span>
                  <span className="product-title">{item}</span>
                </div>
                <div className="product-actions">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => moveItem(list, setList, index, "up")}
                    disabled={index === 0}
                  >↑</button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => moveItem(list, setList, index, "down")}
                    disabled={index === list.length - 1}
                  >↓</button>
                </div>
              </div>
            ))}
          </div>
          <div className="save-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => saveOrder(type)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Order"}
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
        <h1 className="page-title">Products Menu Order</h1>
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
            renderList(categoryOrder, setCategoryOrder, "category")}

          {!loading && activeTab === "brand" &&
            renderList(brandOrder, setBrandOrder, "brand")}
        </div>
      </div>
    </div>
  );
};

export default MenuOrdering;
