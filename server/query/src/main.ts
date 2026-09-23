import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express();
app.use(bodyParser.json());
app.use(cors());

type Status = 'pending';

interface Comments {
  id: string;
  content: string;
  status: Status;
}

const posts: Record<string, {id: string, title: string, comments: Comments[]}> = {};

app.get('/posts', (req, res) => {
  res.send(Object.values(posts));
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = {id, title, comments: []}
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => comment.id === id);

    if (comment) { 
      comment.status = status;
      comment.content = content;
    }
  }

  res.send({});
})

app.listen(4002, () => {
  console.log('Listening on 4002')
})
