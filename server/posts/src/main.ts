import express from 'express'
import { randomBytes } from 'node:crypto'
import bodyParser from 'body-parser'

interface Posts {
  title: string;
}

const app = express();
app.use(bodyParser.json());

const posts: Record<string, Posts & { id: string }> = {};

app.get('/post', (req, res) => {
  res.send(posts);
});

app.post('/post', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title
  };

  res.status(201).send(posts[id]);
});

app.post('/post/:id', () => {
  
});

app.listen(4000, () => {
  console.log('Listening on port 4000.');
});