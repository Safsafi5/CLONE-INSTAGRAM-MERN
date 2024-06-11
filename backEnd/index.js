import express from "express";
import "dotenv/config";
import uploadRouter from "./routers/upload.routes.js";
import connectMongoDb from "./db/connectMongoDb.js";
import cookieParser from "cookie-parser";
import routerAuth from "./routers/auth.routes.js";
import cors from "cors";
import routerUser from "./routers/user.routes.js";
import postRoutes from "./routers/post.routes.js";



const port = 3000
const app = express();
app.use(cors());
app.use(express.json()); //to parse to bbody
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use("/api/auth", routerAuth)
app.use("/api/foto", uploadRouter)
app.use("/api/users", routerUser)
app.use("/api/post", postRoutes)

app.get('/tidak', (req, res) => {
    res.send('Hello World!');
  });
  
app.listen(port, () => {
    console.log("sudah berhasil")
    connectMongoDb()
})