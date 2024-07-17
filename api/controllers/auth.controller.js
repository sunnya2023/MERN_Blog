import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utills/error.js";
import jwt from "jsonwebtoken";

export const singup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    // return res.status(400).json({ message: "All fields are required" });
    return next(errorHandler(400, "정보를 입력해주세요"));
  }
  if (username.length < 2 || username.length > 20) {
    return next(
      errorHandler(400, "이름은 최소 2글자 이상 20자 내외로 입력해주세요")
    );
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(errorHandler(401, "이미 사용중인 이메일입니다."));
  }

  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
  if (!pwRegex.test(password)) {
    return next(
      errorHandler(
        400,
        "비밀번호는 영문/숫자/특수문자 포함 8자이상 입력해주세요"
      )
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "이메일 또는 비밀번호를 확인해주세요."));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "등록된 이메일이 아닙니다"));
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "비밀번호가 일치하지 않습니다"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // 비밀번호 제외하기
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV !== "development",
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePictuer: googlePhotoURL,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV !== "development",
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
