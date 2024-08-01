import { useState } from "react";
import "../style/page_style/createPost.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [value, setValue] = useState("");
  const [file, setFile] = useState();
  console.log(file);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState();

  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setMenuOpen(false);
  };

  const handleUploadImg = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        setUploadError("이미지를 선택해 주세요");
        return;
      }
      setUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setUploadProgress(progress.toFixed(0));
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          setUploadError("이미지 업로드 실패");
          setUploadProgress(0);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadProgress(0);
            setUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setUploadError("이미지 업로드 실패");
      setUploadProgress(0);
      console.log(error);
    }
  };
  // console.log(uploadProgress);
  // console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };

  return (
    <div className="create-post">
      <h1>게시글 작성하기</h1>
      <form onSubmit={handleSubmit}>
        <div className="titleBox">
          <input
            type="text"
            placeholder="제목"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <div className="dropdown">
            <div className="select" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="selected">
                {formData.category || "카테고리 선택"}
              </span>

              <img src="/drop-down.svg" />
            </div>
            <ul
              className={menuOpen ? "menu" : "menu hide"}
              // onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* <li onClick={() => handleCategorySelect("Javascript")}>
                Javascript
              </li>
              <li onClick={() => handleCategorySelect("React.js")}>React.js</li>
              <li onClick={() => handleCategorySelect("Next.js")}>Next.js</li>
              <li onClick={() => handleCategorySelect("Node.js")}>Node.js</li> */}
              {["Javascript", "React.js", "Next.js", "Node.js"].map(
                (category) => (
                  <li
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
        <div className="fileBox">
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type="submit"
            className="imgUploadBtn"
            onClick={handleUploadImg}
            disabled={uploadProgress > 0 && uploadProgress < 100}
          >
            {uploadProgress > 0 && uploadProgress < 100 ? (
              <CircularProgressbar
                value={uploadProgress || 0}
                text={`${uploadProgress}%`}
                strokeWidth={2}
                styles={{
                  root: {
                    width: "3rem",
                    height: "2rem%",
                  },
                  path: {
                    stroke: `rgba(62,152,199, ${uploadProgress / 100})`,
                  },
                }}
              />
            ) : (
              "이미지 업로드"
            )}
          </button>
        </div>
        {uploadError && <div className="error"> {uploadError}</div>}
        {formData.image && (
          <img src={formData.image} alt="포스트 이미지" className="post-img" />
        )}
        <ReactQuill
          theme="snow"
          placeholder="게시글을 작성해주세요"
          onChange={(value) => setFormData({ ...formData, content: value })}
          className="quill"
          required
        />
        <button type="submit" className="create-btn">
          업로드
        </button>
        {publishError && <div className="error">{publishError}</div>}
      </form>
    </div>
  );
}
