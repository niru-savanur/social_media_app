import "./post.css";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [clickUp, setClickUp] = useState(false);
  const desc = useRef();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const deleteHandler = () => {
    try{
      console.log(currentUser._id);
      axios.put("/posts/delete/" + post._id,  {userId: currentUser._id });
      window.location.reload();
    }catch(err){
      console.log(err);
    }
  }

  const handleClick = () => {
    setClickUp(!clickUp);
  };

  const testHandler = () => {
   console.log(desc.current.value);
   try{
    axios.put("/posts/" + post._id,  {userId: currentUser._id , desc: desc.current.value});
    setClickUp(false);
    window.location.reload();
  }catch(err){
    console.log(err);
  }
  }

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
          <img
              className="likeIcon"
              src={`${PF}delete.png`}
              title="delete post"
              onClick={deleteHandler}
              alt=""
            />
             <img
              className="likeIcon "
              src={`${PF}edit.png`}
              title="edit caption"
              onClick={handleClick}
              alt=""
            />
          </div>
        </div>
        {clickUp? <div className="updateText">
        <input
            placeholder="update desc..."
            className="upInput"
            ref={desc}
          />
         <img
              className="likeIcon"
              src={`${PF}apply.png`}
              title="apply changes"
              onClick={testHandler}
              alt=""
            />
        </div> : null}
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
