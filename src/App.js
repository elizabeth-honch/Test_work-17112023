import React from 'react';
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserList } from './components/UserList/UserList.jsx';
import { PostList } from './components/PostList/PostList.jsx';
import { AlbumsList } from './components/AlbumsList/AlbumsList.jsx';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/albums" element={<AlbumsList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
