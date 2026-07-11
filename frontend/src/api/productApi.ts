import axiosInstance from "./axiosInstance";

import type {
  Product,
  ProductFormData,
  ApiResponse,
} from "../types";

// =====================================
// TEMPORARY DATA
// Will be replaced after Login & Categories
// =====================================

const TEMP_PARTNER_ID = "6870d5c7d67a4dcb3b0f1234";
const TEMP_CATEGORY_ID = "6870d5c7d67a4dcb3b0f5555";

// =====================================
// GET PRODUCTS
// =====================================

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get<ApiResponse<Product[]>>(
    "/products"
  );

  return response.data.data;
};

// =====================================
// CREATE PRODUCT
// =====================================

export const createProduct = async (
  product: ProductFormData
): Promise<Product> => {
  const payload = {
    ...product,
    partnerId: TEMP_PARTNER_ID,
    categoryId: TEMP_CATEGORY_ID,
    paymentStatus: "Pending",
    isActive: true,
  };

  console.log("Sending Product:", payload);

  const response = await axiosInstance.post<ApiResponse<Product>>(
    "/products",
    payload
  );

  return response.data.data;
};

// =====================================
// UPDATE PRODUCT
// =====================================

export const updateProduct = async (
  id: string,
  product: ProductFormData
): Promise<Product> => {
  const payload = {
    ...product,
    categoryId: TEMP_CATEGORY_ID,
  };

  console.log("Updating Product:", payload);

  const response = await axiosInstance.put<ApiResponse<Product>>(
    `/products/${id}`,
    payload
  );

  return response.data.data;
};

// =====================================
// DELETE PRODUCT
// =====================================

export const deleteProduct = async (
  id: string
): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};