import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";

import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middleware/errorHandler";


// Load environment variables
dotenv.config();


// Validate environment variables
const requiredEnv = [
    "MONGO_URI",
    "PORT",
    "CLIENT_URL"
];


requiredEnv.forEach((variable) => {

    if (!process.env[variable]) {

        console.error(
            `❌ Missing environment variable: ${variable}`
        );

        process.exit(1);

    }

});


console.log(
    "✅ Environment configuration validated"
);



const app = express();


const PORT =
    Number(process.env.PORT) || 5000;





// =========================
// MIDDLEWARES
// =========================


// CORS

app.use(
    cors({

        origin:
            process.env.CLIENT_URL,

        credentials: true

    })
);




// JSON BODY

app.use(
    express.json()
);






// =========================
// ROUTES
// =========================


app.use(
    "/api/products",
    productRoutes
);






// =========================
// ERROR HANDLER
// MUST BE LAST
// =========================

app.use(
    errorHandler
);








// =========================
// START SERVER
// =========================

const startServer = async (): Promise<void> => {


    await connectDB();




    const server =
        http.createServer(app);




    server.listen(
        PORT,
        () => {

            console.log(
                `🚀 Server running on port ${PORT}`
            );

        }
    );






    // Server errors

    server.on(
        "error",
        (error: any) => {


            if (error.code === "EADDRINUSE") {


                console.error(
                    `❌ Port ${PORT} is already in use`
                );


                process.exit(1);

            }



            console.error(
                "❌ Server error:",
                error
            );


        }
    );








    // Graceful shutdown

    const shutdown =
        async (): Promise<void> => {


            console.log(
                "\n🛑 Shutting down server..."
            );



            try {


                await mongoose.connection.close();



                server.close(
                    () => {


                        console.log(
                            "✅ Server closed successfully"
                        );


                        process.exit(0);


                    }
                );



            } catch (error) {


                console.error(
                    "❌ Shutdown error:",
                    error
                );


                process.exit(1);

            }


        };







    process.on(
        "SIGINT",
        shutdown
    );


    process.on(
        "SIGTERM",
        shutdown
    );


};






// Start application

startServer();