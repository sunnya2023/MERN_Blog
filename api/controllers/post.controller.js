import Post from "../models/Post.model.js";
import { errorHandler } from "../utills/error.js";

export const create = async (req, res, next) => {
  console.log(req.body);
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "작성 권한이 없습니다."));
    }
    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "입력 필드를 모두 작성해주세요"));
    }
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Zㄱ-힣0-9-]/g, "");

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    next(error);
  }
};
