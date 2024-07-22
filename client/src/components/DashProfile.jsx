import "../style/component_style/dsahboardProfile.scss";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  delereFailure,
  deleteStart,
  deleteSuccess,
  logoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  //이미지 변경
  const [imgFile, setImgFile] = useState(null);
  const [imgFileURL, setImgFileURL] = useState(null);
  const [imgFileUploading, setImgFileUploading] = useState(false);
  const imgRef = useRef();
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  //이미지 변경
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setUploadError(null);
    setUpdateError(null);
    setSuccessMsg(null);
    if (file && file.size < MAX_FILE_SIZE) {
      setImgFile(file);
      setImgFileURL(URL.createObjectURL(file));
    } else {
      setUploadError(
        "이미지 파일 크기는 최대 2MB까지 허용됩니다. 파일을 다시 선택해주세요."
      );
    }
  };
  // console.log(imgFile, imgFileURL);

  // 이미지 업로드
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  // console.log(uploadProgress, uploadError);
  const uploadImg = async () => {
    // setUploadError(null);
    setImgFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imgFile.name;
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
        setImgFileUploading(false);
        // setImgFileURL(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImgFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imgFile) {
      uploadImg();
    }
  }, [imgFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setSuccessMsg(null);
    if (Object.keys(formData).length === 0) {
      return;
    }
    if (imgFileUploading) {
      setImgFileUploading("이미지가 업로드 중입니다.");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setSuccessMsg("프로필이 업데이트 되었습니다.");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateError(data.message);
    }
  };
  console.log(formData);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(delereFailure(data.message));
      } else {
        dispatch(deleteSuccess(data));
      }
    } catch (error) {
      dispatch(delereFailure(error.message));
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(logoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(imgFileUploading);
  return (
    <div className="dashProfile">
      <h1>프로필</h1>
      <form onSubmit={handleSubmit}>
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
            src={imgFileURL || currentUser.profilePicture}
            alt={currentUser.username}
          />
        </div>
        {uploadError && <div className="error">{uploadError}</div>}
        <input
          type="text"
          name="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input type="email" defaultValue={currentUser.email} disabled />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="edit-btn"
          disabled={loading || imgFileUploading}
        >
          {loading ? "로딩중..." : "수정하기"}
        </button>
        {currentUser.isAdmin && (
          <Link to="/create-post" className="create-btn">
            게시글 작성하기
          </Link>
        )}
      </form>
      <div className="deleteAccount">
        <span onClick={() => setShowModal(true)}>탈퇴하기</span>
        <span onClick={handleLogout}>로그아웃</span>
      </div>
      {successMsg && <div className="successMsg">{successMsg}</div>}
      {updateError && <div className="error">{updateError}</div>}
      {error && <div className="error">{error}</div>}
      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <div
              className="close"
              onClick={() => {
                setShowModal(false);
              }}
            >
              <IoClose />
            </div>
            <div className="modal-content">
              <p>계정을 삭제하시겠습니까?</p>
              <div className="select-btn">
                <button className="confirm" onClick={handleDeleteUser}>
                  예
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  아니오
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
