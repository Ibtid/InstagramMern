import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import axios from './axios';
import Pusher from 'pusher-js';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        //user has logged out...
        setUser(null);
      }
    });
    return () => {
      //perform cleanup
      unsubcribe();
    };
  }, [user, username]);

  const fetchPosts = async () =>
    await axios.get('/sync').then((response) => {
      console.log('POSTS:', response);
      setPosts(response.data);
    });

  useEffect(() => {
    const pusher = new Pusher('8e77a5bb93f8d1161b5e', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('posts');
    channel.bind('inserted', (data) => {
      console.log('data received', data);
      fetchPosts();
    });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className='app'>
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='Instagram'
              />
            </center>
            <Input
              placeholder='username'
              text='text'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Input
              placeholder='email'
              text='text'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='Instagram'
              />
            </center>
            <Input
              placeholder='email'
              text='text'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='Instagram'
        />
        {user ? (
          <Button
            onClick={() => {
              auth.signOut();
            }}>
            Logout
          </Button>
        ) : (
          <div className='app__loginContainer'>
            <Button
              onClick={() => {
                setOpenSignIn(true);
              }}>
              Sign In
            </Button>
            <Button
              onClick={() => {
                setOpen(true);
              }}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
      <div className='app__posts'>
        {posts.map((post) => (
          <Post
            key={post._id}
            postId={post._id}
            user={user}
            username={post.user}
            caption={post.caption}
            imageUrl={post.image}
            comments={post.comments}
          />
        ))}
      </div>

      <div className='app__uploadFooter'>
        {user?.displayName ? (
          <div>
            <ImageUpload username={user.displayName} />
          </div>
        ) : (
          <h3>Sorry you need to login to upload</h3>
        )}
      </div>
    </div>
  );
}

export default App;
