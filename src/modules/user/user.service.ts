import e, { Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

import config from "../../config";
import { RegisterUserPayload } from "./user.interface";


const registerUserIntoDB  = async (payload: RegisterUserPayload) => {
    const { name, email, password, profilePhoto } = payload;

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new Error("User already exists");
    }

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: bcrypt.hashSync(password, Number(config.bcrypt_salt_rounds))
        },
    });
    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto
        },
    });
    
    const user = await prisma.user.findUnique({
        where: { 
            id: createdUser.id,
            email: createdUser.email
         },
        omit: { password: true },
        include: { profile: true },
    });
    return user;
}

const getMyProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
        include: { profile: true },
    });
    return user;
}

const updateMyProfile = async (userId: string, payload: any) => {
    const { name, email, password, profilePhoto, bio } = payload;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            email,
            password: password ? bcrypt.hashSync(password, Number(config.bcrypt_salt_rounds)) : undefined,
            profile: {
                update: {
                    profilePhoto,
                    bio
                }
            }
        },
        omit: { password: true },
        include: { profile: true },
    });
    return updatedUser;

}

export const userService = {
    registerUserIntoDB
    , getMyProfile
    , updateMyProfile
};