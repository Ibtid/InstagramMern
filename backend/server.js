import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dbModel from './dbModel.js';

//app config

const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: '1173995',
  key: '8e77a5bb93f8d1161b5e',
  secret: 'cada68e29a520ec8bb37',
  cluster: 'ap2',
  useTLS: true,
});
//middlewares

app.use(express.json({ limit: '50mb' }));
app.use(cors());

//DB config
const connection_url =
  'mongodb+srv://IBTID:IBTID31@cluster0.t1jez.mongodb.net/instaDB?retryWrites=true&w=majority';

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Database Connected');
  const changeStream = mongoose.connection.collection('posts').watch();

  changeStream.on('change', (change) => {
    console.log('Change Triggered...');
    console.log(change);
    console.log('End of Change');

    if (change.operationType === 'insert') {
      console.log('Trigerring Pusher ***IMG UPLOAD***');

      const postDetails = change.fullDocument;
      pusher.trigger('posts', 'inserted', {
        user: postDetails.user,
        caption: postDetails.caption,
        //image:postDetails.image
      });
    } else {
      console.log('Unknown Triger From Pusher');
    }
  });
});
//api routes

app.get('/', (req, res) => res.status(200).send('hello world'));

app.post('/upload', (req, res) => {
  const body = req.body;
  dbModel.create(body, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('New Post', data);
      res.status(201).send(data);
    }
  });
});

app.get('/sync', (req, res) => {
  dbModel.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      console.log('Fetched');
      res.status(200).send(data);
    }
  });
});

//listen
app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});
