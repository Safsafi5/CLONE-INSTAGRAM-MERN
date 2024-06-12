import express from "express"
import { activate, registerUser ,refreshToken, login, forgotPassword, resetPassword, logOut, getMe} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
import { protecRoute } from "../middleware/protecRoute.middleware.js";

const routerAuth = express.Router();

routerAuth.post("/register", registerUser);
routerAuth.post("/activated", activate);
routerAuth.post("/refreshToken", refreshToken);
routerAuth.post("/login", login);
routerAuth.post("/forgotPassword", forgotPassword);
routerAuth.post("/resetPassword",protecRoute, resetPassword);
routerAuth.post("/logout", logOut);
routerAuth.get("/getMe",protecRoute, getMe);


export default routerAuth