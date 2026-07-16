import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { LoginUserPayload } from "./auth.interface";
import jwt from "jsonwebtoken";
import { jwtUtils } from "../../util/jwtUtils";
import config from "../../config";


const loginUser = async (payload: LoginUserPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }

    });
    
    if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account is blocked, please contact support");
        }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect");
    }


//jwt token generation
const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
}

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as jwt.SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as jwt.SignOptions
    );
//jwt end

    return { user, accessToken, refreshToken };
}


const refreshToken = async (refreshToken: string) => {
    const { success, data, error } = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);

    if (!success) {
        throw new Error(error);
    }
    const { id, name, email, role } = data as jwt.JwtPayload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { id },
      
    });
    if (user.activeStatus === "BLOCKED") {
        throw new Error("Your account is blocked, please contact support");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const newAccessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as jwt.SignOptions
    );

    return { accessToken: newAccessToken };
}




export const authService = {
    loginUser,
    refreshToken
};