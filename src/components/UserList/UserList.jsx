import React, { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchData } from "../../queryFn/useQuery";
import { Link } from "react-router-dom";
import "./UserList.scss";

export const UserList = () => {
  const [fitleredUsers, setFilteredUsers] = useState(null);
  const [queryParam, setQueryParam] = useState(null);
  const [sortParam, setSortParam] = useState('default');

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery({
    queryKey: ['/users'],
    queryFn: fetchData,
    cacheTime: Infinity,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!isLoadingUsers && !isErrorUsers && users) {
      setFilteredUsers(users);
    }
  }, [isLoadingUsers, isErrorUsers, users]);

  const handleSearch = (event) => {
    const value = (event.target.value).toLowerCase();
    setQueryParam(value);
    setFilteredUsers(prevFilteredUsers => {
      if (value) {
        return prevFilteredUsers.filter(user => {
          const lowerUsername = user.username.toLowerCase();
          return lowerUsername.includes(value);
        });
      } else {
        return sortParam === 'default'
          ? users
          : handleSort(sortParam)
      }
    });
  };

  const handleSort = (event) => {
    const value = typeof event === 'string' ? event : event.target.value;
    setSortParam(value);
    setFilteredUsers(prevFilteredUsers => {
      const usersData = prevFilteredUsers ? prevFilteredUsers : users;
      if (value === 'asc') {
        return [...usersData].sort((prevUser, nextUser) => {
          return prevUser.username.localeCompare(nextUser.username);
        });
      } else if (value === 'desc') {
        return [...usersData].sort((prevUser, nextUser) => {
          return nextUser.username.localeCompare(prevUser.username);
        });
      } else {
        return queryParam && queryParam.length > 0
          ? users.filter(user => user.username.toLowerCase().includes(queryParam))
          : users;
      }
    });
  };

  return (
    <section className="users">
      <h2 className="users__title">Users List:</h2>

      <input
        placeholder="Search by Username"
        className="users__search"
        onChange={handleSearch}
      />

      <div className="users__sortBlock">
        <span>Sort By:</span>
        <select onChange={handleSort}>
          <option value="default">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <ul className="users__list">
        {fitleredUsers && fitleredUsers.length > 0
          ? fitleredUsers.map(user => (
            <li key={user.id} className="users__list_item">
              <p className="users__list_name">{user.name}</p>
              <p>Username - <span className="users__list_username">{user.username}</span></p>
              <p>Phone - {user.phone}</p>
              <p>Email - {user.email}</p>
              <p>Website - {user.website}</p>
              <p>Company - {user.company.name}</p>
              <p>City - {user.address.city}</p>
              <p>Address - {`${user.address.street}, ${user.address.suite}`}</p>
              <p>Zipcode - {user.address.zipcode}</p>
              <div className="users__list_action">
                <Link
                  to={`posts?userId=${user.id}`}
                  className="users__list_actionPost"
                >
                  Show Posts
                </Link>

                <Link
                  to={`albums?userId=${user.id}`}
                  className="users__list_actionAlb"
                >
                  Show Albums
                </Link>
              </div>
            </li>
          ))
          : <p>No results.</p>
        }
      </ul>
    </section>
  );
};
