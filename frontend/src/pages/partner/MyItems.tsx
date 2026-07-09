import { useEffect, useMemo, useState } from "react";
import {
  FiPlus,
  FiUpload,
  FiEdit2,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";

import type {
  Product,
  ProductFormData,
} from "../../types";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../api/productApi";

const initialForm: ProductFormData = {
  title: "",
  description: "",
  price: 0,
  imageUrl: "",
};

const MyItems = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormData>(initialForm);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  // ============================
  // Load Products
  // ============================

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ============================
  // Handle Form Change
  // ============================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? Number(value)
          : value,
    }));
  };

  // ============================
  // Reset Form
  // ============================

  const resetForm = () => {
    setEditingId(null);

    setForm(initialForm);

    setError("");
  };

  // ============================
  // Save Product
  // ============================

  const saveProduct = async () => {
    if (!form.title.trim()) {
      setError("Product title is required.");
      return;
    }

    if (form.price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateProduct(
          editingId,
          form
        );
      } else {
        await createProduct(form);
      }

      resetForm();

      await loadProducts();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // Delete Product
  // ============================

  const removeProduct = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmed) return;

    try {
      await deleteProduct(id);

      await loadProducts();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Delete failed."
      );
    }
  };

  // ============================
  // Edit Product
  // ============================

  const editProduct = (
    product: Product
  ) => {
    setEditingId(product._id);

    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl:
        product.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================
  // Search
  // ============================

  const filteredProducts =
    useMemo(() => {
      return products.filter((p) =>
        p.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }, [products, search]);
      return (
    <div className="myitems-page">

      {/* Header */}
      <div className="myitems-header">
        <div>
          <h2>My Items</h2>
          <p>Manage your restaurant products</p>
        </div>

        <button
          className="add-btn"
          onClick={resetForm}
        >
          <FiPlus />
          Add Item
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Items</p>
        </div>

        <div className="stat-card">
          <h3>
            {
              products.filter(
                (p) => p.isActive
              ).length
            }
          </h3>
          <p>Active</p>
        </div>

        <div className="stat-card">
          <h3>
            {
              products.filter(
                (p) =>
                  p.paymentStatus ===
                  "Pending"
              ).length
            }
          </h3>
          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h3>
            {
              products.filter(
                (p) => !p.isActive
              ).length
            }
          </h3>
          <p>Inactive</p>
        </div>

      </div>

      {/* Upload Form */}
      <div className="upload-card">

        <h3>
          {editingId
            ? "Update Product"
            : "Upload New Product"}
        </h3>

        <div className="upload-form">

          <div className="image-upload">
            <FiUpload />

            <input
              id="imageUrl"
              name="imageUrl"
              type="text"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid">

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Product Name"
              value={form.title}
              onChange={handleChange}
            />

            <input
              id="price"
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />

          </div>

          <textarea
            id="description"
            name="description"
            placeholder="Description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />

          <button
            className="save-btn"
            disabled={saving}
            onClick={saveProduct}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Publish Product"}
          </button>

        </div>

      </div>

      {/* Search */}
      <div className="search-bar">
        <FiSearch />

        <input
          id="search"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Products */}

      <div className="products-grid">

        {loading ? (

          <p>Loading products...</p>

        ) : filteredProducts.length === 0 ? (

          <p>No products found.</p>

        ) : (

          filteredProducts.map(
            (product) => (

              <div
                key={product._id}
                className="product-card"
              >

                <img
                  src={
                    product.imageUrl ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={product.title}
                />

                <div className="product-info">

                  <h4>
                    {product.title}
                  </h4>

                  <p>
                    {product.description}
                  </p>

                  <div className="product-footer">

                    <span className="price">
                      $
                      {product.price.toFixed(
                        2
                      )}
                    </span>

                    <span className="status">
                      {product.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  <div className="actions">

                    <button
                      className="edit"
                      onClick={() =>
                        editProduct(
                          product
                        )
                      }
                    >
                      <FiEdit2 />
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() =>
                        removeProduct(
                          product._id
                        )
                      }
                    >
                      <FiTrash2 />
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
};

export default MyItems;