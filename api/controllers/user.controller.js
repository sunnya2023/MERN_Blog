import User from "../models/user.model.js";
import { errorHandler } from "../utills/error.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res, next) => {
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  const nameRegex = /^[a-zA-Zㄱ-힣0-9]+$/;

  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "사용자 정보가 유효하지 않습니다."));
  }
  if (req.body.password) {
    if (!pwRegex.test(req.body.password)) {
      return next(
        errorHandler(
          400,
          "비밀번호는 영문/숫자/특수문자 포함 8자이상 입력해주세요"
        )
      );
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 2 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "이름은 최소 2글자 이상 20자 내외로 입력해주세요")
      );
    }
    if (!nameRegex.test(req.body.username)) {
      return next(errorHandler(400, "이름은 공백없이 문자, 숫자만 가능합니다"));
    }
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          // email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true } // 업데이트된 문서 반환
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
};
