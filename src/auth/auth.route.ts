import { Router } from "express";
import { userController } from "../modules/user/user.controller";
import { authController } from "./auth.controller";


const router = Router();

router.post("/login", authController.loginUser);

export const authRoutes = router;