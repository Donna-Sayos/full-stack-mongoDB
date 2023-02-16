import { useState, useEffect } from "react";
import Axios from "axios";

export default function useFetchPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await Axios.get("/api/v1/posts/");
      setPosts(
        data.posts.sort(
          (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
        )
      );
    };

    fetchPosts();
  }, []);

  return [posts, setPosts];
}
