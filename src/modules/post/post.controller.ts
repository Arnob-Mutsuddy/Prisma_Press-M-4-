import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import { postService } from "./post.service";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendRensponse";


const createPost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postService.createPost(payload,id as string);
    
    sendResponse(res, {
        statuscode:httpStatus.OK,
        success:true,
        message:"post create successfully",
        data:result
    })
});

const getAllPosts = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

});


const getPostById = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

});


const updatePost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

});

const deletePost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

});

const getPostsStats = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

});

const getMyPosts = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

});

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsStats,
    getMyPosts
}