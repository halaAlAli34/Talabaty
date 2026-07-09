import axiosInstance from "./axiosInstance";

import type {
  Product,
  ProductFormData,
  ApiResponse
} from "../types";




// TEMPORARY PARTNER ID
// Will be replaced with logged-in partner ID later

const TEMP_PARTNER_ID =
  "6870d5c7d67a4dcb3b0f1234";







// ==========================
// GET PRODUCTS
// ==========================

export const getProducts = async (): Promise<Product[]> => {


  const response =
    await axiosInstance.get<ApiResponse<Product[]>>(
      "/products"
    );


  return response.data.data;

};









// ==========================
// CREATE PRODUCT
// ==========================

export const createProduct = async (

  product: ProductFormData

): Promise<Product> => {


  const response =
    await axiosInstance.post<ApiResponse<Product>>(

      "/products",

      {

        ...product,

        partnerId:
          TEMP_PARTNER_ID,


        paymentStatus:
          "Pending",


        isActive:
          true

      }

    );


  return response.data.data;

};









// ==========================
// DELETE PRODUCT
// ==========================

export const deleteProduct = async (

  id:string

): Promise<void> => {


  await axiosInstance.delete(

    `/products/${id}`

  );


};









// ==========================
// UPDATE PRODUCT
// ==========================

export const updateProduct = async (

  id:string,

  product:ProductFormData

): Promise<Product> => {



  const response =
    await axiosInstance.put<ApiResponse<Product>>(

      `/products/${id}`,

      {


        ...product


      }

    );



  return response.data.data;


};