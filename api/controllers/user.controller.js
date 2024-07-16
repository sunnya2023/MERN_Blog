import { errorHandler } from "../utills/error.js";
export const profile = async (req, res, next) => {
  try {
    let { username, email, password, profileImg } = req.body;

    if (!profileImg) {
      return next(errorHandler(400, "파일이 없습니다."));
    }
    //upload img on cloudinary

    // const cloudinary_res = await cloudinary.uploader.upload(profileImg);
    // console.log("cloudinary res:", cloudinary_res);
    // console.log(cloudinary_res);
    // const newUser = new User({
    //   profilePicture: cloudinary_res.secure_url,
    // });
    // await newUser.save();
    // res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
};
