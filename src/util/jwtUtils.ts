import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions): string => 
    {
    const token = jwt.sign(
        payload, 
        secret, 
        { 
            expiresIn 
        } as jwt.SignOptions);

    return token;
};

const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedToken = jwt.verify(token, secret) ;
        // return verifiedToken;
        return {
            success: true,
            data: verifiedToken 
        };
    }
    catch (error: any) {
        // throw new Error(error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

export const jwtUtils = {
    createToken,
    verifyToken
};