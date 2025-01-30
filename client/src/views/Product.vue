<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Product Management</h1>
  
      <!-- Fetch Products Button -->
      <div class="text-center mb-4">
        <button class="btn btn-primary" @click="fetchProducts">Fetch Products</button>
      </div>
  
      <!-- Product List -->
      <div v-if="products.length" class="row">
        <div v-for="product in products" :key="product._id" class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ product.description }}</p>
              <p class="card-text"><strong>Price:</strong> ${{ product.price }}</p>
              <div class="d-flex justify-content-between">
                <button
                  class="btn btn-warning btn-sm"
                  @click="openEditModal(product)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteProduct(product._id)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <p>No products found. Click "Fetch Products" to load data.</p>
      </div>
  
      <!-- Create Product Form -->
      <div class="card mt-4">
        <div class="card-header">Create New Product</div>
        <div class="card-body">
          <form @submit.prevent="createProduct">
            <div class="mb-3">
              <label for="productName" class="form-label">Product Name</label>
              <input
                type="text"
                class="form-control w-100"
                id="productName"
                v-model="newProduct.name"
                placeholder="Enter product name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="productDescription" class="form-label">Product Description</label>
              <input
                class="form-control w-100"
                id="productDescription"
                v-model="newProduct.description"
                placeholder="Enter product description"
                rows="3"
                required
              ></input>
            </div>
            <div class="mb-3">
              <label for="productPrice" class="form-label">Product Price</label>
              <input
                type="number"
                class="form-control w-100"
                id="productPrice"
                v-model="newProduct.price"
                placeholder="Enter product price"
                required
              />
            </div>
            <button type="submit" class="btn btn-success">Create Product</button>
          </form>
        </div>
      </div>
  
      <!-- Custom Edit Product Modal -->
      <div v-if="isEditModalOpen" class="custom-modal">
        <div class="modal-overlay" @click="closeEditModal"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProduct">
              <div class="mb-3">
                <label for="editName" class="form-label">Product Name</label>
                <input
                  type="text"
                  class="form-control w-100"
                  id="editName"
                  v-model="editProductData.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="editDescription" class="form-label">Product Description</label>
                <textarea
                  class="form-control w-100"
                  id="editDescription"
                  v-model="editProductData.description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="editPrice" class="form-label">Product Price</label>
                <input
                  type="number"
                  class="form-control w-100"
                  id="editPrice"
                  v-model="editProductData.price"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from "../api"; // Assumes `api` is configured for Axios
  import Cookies from "js-cookie"; // Import js-cookie for handling cookies
  
  export default {
    data() {
      return {
        products: [],
        newProduct: {
          name: "",
          description: "",
          price: "",
        },
        editProductData: {
          id: "",
          name: "",
          description: "",
          price: "",
        },
        authToken: "", // Store the token here
        isEditModalOpen: false, // Control modal visibility
      };
    },
    created() {
      this.authToken = Cookies.get("authToken");
      if (!this.authToken) {
        console.error("Authorization token not found in cookies");
      }
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await api.get("/api/products", {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          });
          this.products = response.data.products;
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      },
      async createProduct() {
        try {
          const response = await api.post("/api/products", this.newProduct, {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          });
          alert(response.data.message);
          this.fetchProducts();
          this.newProduct = { name: "", description: "", price: "" };
        } catch (error) {
          console.error("Error creating product:", error);
        }
      },
      openEditModal(product) {
        this.editProductData = {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
        };
        this.isEditModalOpen = true; // Open modal
      },
      closeEditModal() {
        this.isEditModalOpen = false; // Close modal
      },
      async updateProduct() {
        try {
          console.log("Edit Product Data:", this.editProductData); // Debug log
          const { id, name, description, price } = this.editProductData;
          const response = await api.put(
            `/api/products/${id}`,
            { name, description, price },
            {
              headers: {
                Authorization: `Bearer ${this.authToken}`,
              },
            }
          );
          alert(response.data.message);
          this.fetchProducts();
          this.closeEditModal();
        } catch (error) {
          console.error("Error updating product:", error.response.data);
        }
      },
  
      async deleteProduct(id) {
        try {
          console.log("Deleting Product ID:", id); // Debug log
          const response = await api.delete(`/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${this.authToken}`,
            },
          });
          alert(response.data.message);
          this.fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error.response.data);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  .custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
  }
  
  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  </style>
  