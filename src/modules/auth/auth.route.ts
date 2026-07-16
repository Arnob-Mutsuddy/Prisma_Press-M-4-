import { Router } from "express";
import { userController } from "../user/user.controller";
import { authController } from "./auth.controller";


const router = Router();

router.post("/login", authController.loginUser);

router.post("/refresh-token", authController.refreshToken);


export const authRoutes = router;