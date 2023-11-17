import React from "react";
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from "../../queryFn/useQuery";
import { Link } from "react-router-dom";
import "./AlbumsList.scss";

export const AlbumsList = () => {
  const location = useLocation();

  const { data: albums } = useQuery({
    queryKey: [`/albums${location.search}`, location],
    queryFn: fetchData,
    enabled: !!location,
  });

  return (
    <section className="albums">
      <Link className="albums__btn" to="/">Back to User List</Link>

      <h2 className="albums__title">Albums List:</h2>

      <ul>
        {albums && albums.map(album => (
          <li key={album.id} className="albums__item">
            {album.title}
          </li>
        ))}
      </ul>
    </section>
  )
};
