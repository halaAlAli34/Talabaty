import axios from "axios";


// ==========================
// AXIOS INSTANCE
// ==========================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


console.log(
  "🚀 Axios Base URL:",
  API_URL
);



const axiosInstance = axios.create({

  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,

});





// ==========================
// REQUEST INTERCEPTOR
// ==========================

axiosInstance.interceptors.request.use(

  (config) => {


    const token =
      localStorage.getItem("token");



    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }



    console.log(
      "➡️ Request:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );



    return config;

  },


  (error) => {

    return Promise.reject(error);

  }

);







// ==========================
// RESPONSE INTERCEPTOR
// ==========================

axiosInstance.interceptors.response.use(


  (response) => {


    console.log(
      "✅ Response:",
      response.status,
      response.config.url
    );


    return response;


  },



  (error) => {


    if (error.response) {


      console.error(
        "❌ API ERROR:",
        error.response.status,
        error.response.data
      );


    } else {


      console.error(
        "❌ NETWORK ERROR:",
        error.message
      );


      console.error(
        "Check backend:",
        API_URL
      );

    }



    return Promise.reject(error);


  }

);






export default axiosInstance;