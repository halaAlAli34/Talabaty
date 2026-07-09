import axios from "axios";



const axiosInstance = axios.create({

  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",


  headers: {

    "Content-Type": "application/json",

  },


});







// ==========================
// REQUEST INTERCEPTOR
// ==========================

axiosInstance.interceptors.request.use(

  (config)=>{


    // Future login integration
    // Get token from localStorage

    const token =
      localStorage.getItem("token");



    if(token){

      config.headers.Authorization =
        `Bearer ${token}`;

    }



    return config;


  },


  (error)=>{


    return Promise.reject(error);


  }

);









// ==========================
// RESPONSE INTERCEPTOR
// ==========================

axiosInstance.interceptors.response.use(


  (response)=>{


    return response;


  },



  (error)=>{


    if(error.response){


      console.error(
        "API ERROR:",
        error.response.data
      );


    }else{


      console.error(
        "NETWORK ERROR:",
        error.message
      );


    }



    return Promise.reject(error);


  }


);







export default axiosInstance;