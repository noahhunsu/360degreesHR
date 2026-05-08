

import  express from "express";
import helmet from  "helmet";
import morgan from  "morgan";

import cors from  "cors";
import "dotenv/config"
import authRouter from "./src/modules/auth/auth.routes.js";

const app = express();

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.get("/", (req , res ) => {
    res.send("Welcome to 360 degrees");
})
app.use("/api/v1/auth" ,authRouter )


export default app;

