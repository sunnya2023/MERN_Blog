import { useState } from "react";
import "../style/page_style/createPost.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="create-post">
      <h1>게시글 작성하기</h1>
      <form>
        <div className="titleBox">
          <input type="text" placeholder="제목" />

          <div className="dropdown">
            <div className="select" onClick={() => setMenuOpen(!menuOpen)}>
              <span className="selected">카테고리 선택</span>

              <img src="/drop-down.svg" />
            </div>
            <ul
              className={menuOpen ? "menu" : "menu hide"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <li>Javascript</li>
              <li>React.js</li>
              <li>Next.js</li>
              <li>Node.js</li>
            </ul>
          </div>
        </div>
        <div className="fileBox">
          {/* <label htmlFor="file">파일 선택</label> */}
          <input id="file" type="file" />
          <button className="imgUploadBtn">이미지 업로드</button>
        </div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          className="quill"
          required
        />
        <button type="submit" className="create-btn">
          업로드
        </button>
      </form>
    </div>
  );
}
