import React, { useState, useEffect } from 'react';
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase';
import axios from './axios';

const Post = ({ postId, user, username, caption, imageUrl, comments }) => {
  //const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (postId) {
    }
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    axios.patch(`/${postId}/comment`, {
      text: comment,
      username: user.displayName,
    });
    setComment('');
  };
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          src='https://scontent.fdac27-1.fna.fbcdn.net/v/t1.0-1/p240x240/155389079_1533555050310057_7199460868652150532_n.jpg?_nc_cat=100&ccb=1-3&_nc_sid=7206a8&_nc_ohc=Pmp1C3-2n18AX8xE-Xr&_nc_ht=scontent.fdac27-1.fna&tp=6&oh=20cce5e800c0e1e480d501b50b8e42d6&oe=60732069'
          alt='Ibtid'
        />
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='' />
      {/*image */}

      <h4 className='post__text'>
        <strong>{username}: </strong>
        {caption}
      </h4>
      {/*username + caption */}

      <div className='post__comments'>
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}: </strong>
            {comment.text}
          </p>
        ))}
      </div>

      <form className='post__commentBox'>
        <input
          className='post__input'
          type='text'
          placeholder='Add a comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className='post__button'
          type='submit'
          onClick={postComment}>
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
