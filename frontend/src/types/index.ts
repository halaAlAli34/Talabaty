export interface Product {

  _id:string;

  partnerId:string;

  title:string;

  description:string;

  price:number;

  imageUrl:string;

  paymentStatus:
    "Pending" |
    "Paid" |
    "Unpaid";


  isActive:boolean;


  createdAt?:string;

  updatedAt?:string;

}



export interface ProductFormData {


  title:string;

  description:string;

  price:number;

  imageUrl:string;


}



export interface ApiResponse<T>{

  success:boolean;

  message:string;

  data:T;

}