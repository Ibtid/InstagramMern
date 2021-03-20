import React, { useState } from 'react';
import { Button, Input } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import axios from './axios.js';

import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await convertBase64(file);
      setImage(base64);
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleUpload = () => {
    axios.post('/upload', {
      caption: caption,
      user: username,
      image: image,
    });
    setCaption('');
  };

  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={progress} max='100' />
      <input
        type='text'
        placeholder='Enter a caption'
        onChange={(event) => {
          setCaption(event.target.value);
        }}
        value={caption}
      />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
