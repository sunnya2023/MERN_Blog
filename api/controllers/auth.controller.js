import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utills/error.js";

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
    next(errorHandler(400, "정보를 입력해주세요"));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    next(errorHandler(401, "이미 사용중인 이메일입니다."));
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
