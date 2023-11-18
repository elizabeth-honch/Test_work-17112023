import React, { useState, useEffect, useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import { fetchData } from "../../queryFn/useQuery";
import { Link, useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import "./UserList.scss";

export const UserList = () => {
  const [fitleredUsers, setFilteredUsers] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  let queryParamObj = useRef({});

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useQuery({
    queryKey: ['/users'],
    queryFn: fetchData,
  });

  useEffect(() => {
    if (!isLoadingUsers && !isErrorUsers && users) {
      setFilteredUsers(users);
    }
  }, [isLoadingUsers, isErrorUsers, users]);

  useEffect(() => {
    const searchParamsUrl = Object.fromEntries([...searchParams]);
    if (users) {
      handleSearch(searchParamsUrl?.search || '');
      handleSort(searchParamsUrl?.sort || '');
    }
  }, [searchParams, users]);

  const sortData = (data, type) => {
    if (type && type !== 'default') {
      queryParamObj.current = {...queryParamObj.current, "sort": type};
    } else {
      const {sort, ...rest} = queryParamObj.current;
      queryParamObj.current = rest;
    }
    navigate({search: `?${createSearchParams(queryParamObj.current)}`});
    if (type === 'asc') {
      return [...data].sort((prevUser, nextUser) => {
        return prevUser.username.localeCompare(nextUser.username);
      });
    } else if (type === 'desc') {
      return [...data].sort((prevUser, nextUser) => {
        return nextUser.username.localeCompare(prevUser.username);
      });
    } else {
      return data;
    }
  };

  const searchData = (data, search) => {
    if (search) {
      queryParamObj.current = {...queryParamObj.current, "search": search};
    } else {
      const {search, ...rest} = queryParamObj.current;
      queryParamObj.current = rest;
    }
    navigate({search: `?${createSearchParams(queryParamObj.current)}`});
    return search && search.length > 0
      ? data.filter(user => {
        const lowerUsername = user.username.toLowerCase();
        return lowerUsername.includes(search);
      })
      : data;
  };

  const handleSearch = (event) => {
    const value = typeof event === 'string' ? event : event.target.value;
    setSearchValue(value);
    setFilteredUsers(() => {
      const sortedUsers = sortData(users, queryParamObj.current?.sort || 'default');
      return searchData(sortedUsers, value.toLowerCase());
    });
  };

  const handleSort = (event) => {
    const value = typeof event === 'string' ? event : event.target.value;
    setSortValue(value);
    setFilteredUsers(prevFilteredUsers => {
      const usersData = prevFilteredUsers ? prevFilteredUsers : users;
      if (value === 'default') {
        return searchData(users, queryParamObj.current?.search || '');
      } else {
        return sortData(usersData, value);
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
        value={searchValue}
      />

      <div className="users__sortBlock">
        <span>Sort By:</span>
        <select onChange={handleSort} value={sortValue}>
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
