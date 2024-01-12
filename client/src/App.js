import React from 'react';
import { Container } from '@material-ui/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PostDetails from './components/PostDetails/PostDetails';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import CreatorOrTag from './components/CreatorOrTag/CreatorOrTag';
import PostsLanding from './components/PostLanding/postsLanding';

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <Container maxWidth="xl">
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/posts" exact element={<PostsLanding/>} />
          <Route path="/posts/search" exact element={<PostsLanding/>} />
          <Route path="/posts/:id" exact element={<PostDetails/>} />
          <Route path={'/creators/:name'} element={<CreatorOrTag/>} />
          <Route path={'/tags/:name'} element={<CreatorOrTag/>} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/posts" />}/>
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
