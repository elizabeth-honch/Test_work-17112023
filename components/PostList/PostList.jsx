import React from "react";
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from "../../queryFn/useQuery";
import { Link } from "react-router-dom";
import "./PostList.scss";

export const PostList = () => {
  const location = useLocation();

  const { data: posts } = useQuery({
    queryKey: [`/posts${location.search}`, location],
    queryFn: fetchData,
    enabled: !!location,
  });

  return (
    <section className="posts">
      <Link className="posts__btn" to="/">Back to User List</Link>

      <h2 className="posts__title">Posts List:</h2>

      <ul>
        {posts && posts.map(post => (
          <li key={post.id} className="posts__item">
            <p className="posts__text">{post.title}</p>
            <p className="posts__desc">{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
};
