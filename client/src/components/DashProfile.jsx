import { useEffect, useRef, useState } from "react";
import "../style/component_style/dsahboardProfile.scss";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  //이미지 변경
  const [imgFile, setImgFile] = useState(null);
  const [imgFileURL, setImgFileURL] = useState(null);
  const imgRef = useRef();
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  //이미지 변경
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < MAX_FILE_SIZE) {
      setImgFile(file);
      setImgFileURL(URL.createObjectURL(file));
      setUploadError(null);
    } else {
      setUploadError(
        "이미지 파일 크기는 최대 2MB까지 허용됩니다. 파일을 다시 선택해주세요."
      );
    }
  };
  console.log(imgFile, imgFileURL);

  // 이미지 업로드
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  // console.log(uploadProgress, uploadError);

  const uploadImg = async () => {
    // setUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imgFile.name; //유니크한 파일명으로 변경
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imgFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
        // console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error.message);
        setUploadError("이미지는 2MB이하만 등록해주세요.");
        setUploadProgress(null);
        setImgFile(null);
        setImgFileURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileURL(downloadURL);
        });
      }
    );
  };

  useEffect(() => {
    if (imgFile) {
      uploadImg();
    }
  }, [imgFile]);

  return (
    <div className="dashProfile">
      <h1>프로필</h1>
      <form onSubmit={uploadImg}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          className="hide"
          ref={imgRef}
        />
        <div className="profile-img" onClick={() => imgRef.current.click()}>
          {uploadProgress && (
            <CircularProgressbar
              value={uploadProgress || 0}
              text={`${uploadProgress}%`}
              strokeWidth={5}
              style={{
                root: {
                  width: "100%",
                  height: "100%",
                  positon: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${uploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            className={uploadProgress && uploadProgress < 100 ? "opacity" : ""}
            src={imgFileURL || currentUser.profilePictuer}
            alt={currentUser.username}
          />
        </div>
        {uploadError && <div className="error">{uploadError}</div>}
        <input type="text" defaultValue={currentUser.username} />
        <input type="email" defaultValue={currentUser.email} />
        <input type="password" placeholder="비밀번호" />
        <button type="submit" className="edit-btn">
          수정하기
        </button>
      </form>
      <div className="deleteAccount">
        <span>탈퇴하기</span>
      </div>
    </div>
  );
}
