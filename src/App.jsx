import { useEffect, useState } from "react";
import "./App.css";
import AddPost from "./components/AddPost.jsx";
import EditPost from "./components/EditPost.jsx";
import Posts from "./components/Posts";
// import initialPosts from "./data/db.js";
import axios from "axios";
export default function App() {
  const [posts, setPosts] = useState([]);
  // const [posts, setPosts] = useState(initialPosts);
  const [post, setPost] = useState(null); // post I am editing
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/posts");

        if (response && response.data) {
          setPosts(response.data);
          setError(null);
        }
      } catch (err) {
        if (err.response) {
          setError(`${err.response.status}: ${err.response.statusText}`);
        } else {
          setError(err.message);
        }
      }
    };
    fetchData();
  }, []);

  const handleAddPost = async (newPost) => {
    const id = posts.length ? Number(posts[posts.length - 1].id) + 1 : 1;

    try {
      const finalPost = {
        id: id.toString(),
        ...newPost,
      };
      const response = await axios.post(
        "http://localhost:8000/posts",
        finalPost
      );
      setPosts([...posts, response.data]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm("Are you sure you want to delete the post?")) {
      try {
        await axios.delete(`http://localhost:8000/posts/${postId}`);
        const newPosts = posts.filter((post) => post.id !== postId);
        setPosts(newPosts);
      } catch (err) {
        setError(err.message);
      }
    } else {
      console.log("You chose not to delete the post!");
    }
  };

  //   const handleEditPost = (updatedPost) => {
  //     const updatedPosts = posts.map((post) =>
  //       post.id === updatedPost.id ? updatedPost : post
  //     );
  //     setPosts(updatedPosts);
  //   };
  const handleEditPost = async (updatedPost) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/posts/${updatedPost.id}`,
        updatedPost
      );

      const updatedPosts = posts.map((post) =>
        post.id === response.data.id ? response.data : post
      );

      setPosts(updatedPosts);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div>
        <h1>API Request with Axios</h1>
        <hr />
        <div>
          <Posts
            posts={posts}
            onDeletePost={handleDeletePost}
            onEditClick={setPost}
          />
          <hr />
          {!post ? (
            <AddPost onAddPost={handleAddPost} />
          ) : (
            <EditPost post={post} onEditPost={handleEditPost} />
          )}
        </div>
        <hr />
        <div>{error && <div className="error">{error}</div>}</div>
      </div>
    </div>
  );
}
