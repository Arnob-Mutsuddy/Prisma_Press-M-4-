import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";


import { postService } from "./post.service";
import { catchAsync } from "../../util/catchAsync";
import { sendResponse } from "../../util/sendRensponse";


const createPost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    //post id will create automatically by prisma
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
    const result = await postService.getAllPosts();
    sendResponse(res, {
        statuscode:httpStatus.OK,
        success:true,
        message:"post retrieve successfully",
        data:result
    })  
});


const getPostById = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

    const postId = req.params.postId as string;
    if (!postId){
        throw new Error("post id is required");
    }
    const result = await postService.getPostById(postId);
    sendResponse(res, {
        statuscode:httpStatus.OK,
        success:true,
        message:"post retrieve successfully",
        data:result
    })      

});

const updatePost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post Id Required In Params")
    }

    const payload = req.body;

    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin)

    sendResponse(res, {
        statuscode:httpStatus.OK,
        success:true,
        message:"post updated successfully",
        data:result
    })
});

const deletePost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
        throw new Error("Post Id Required In Params")
    }

    await postService.deletePost(postId as string, authorId as string, isAdmin)

    sendResponse(res, {
        statuscode:httpStatus.OK,
        success:true,
        message:"post deleted successfully",
        data:null
    })
})

const getPostsStats = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const result = await postService.getPostsStats();

    sendResponse(res, {
       statuscode:httpStatus.OK,
        success:true,
        message: "Post stats retrieved successfully",
        data: result
    })
})

const getMyPosts = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const userId = req.user?.id as string;
    const result = await postService.getMyPosts(userId);


    sendResponse(res, {
        statuscode:httpStatus.OK,
        success:true,
        message:"post retrieve successfully",
        data:result
    })  

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