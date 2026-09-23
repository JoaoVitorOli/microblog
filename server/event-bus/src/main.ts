import express from 'express';
import bodyParser from 'body-parser'
import axios from 'axios'

const app = express();
app.use(bodyParser.json());

type Status = 'pending' | 'rejected';

interface Comments {
  id: string;
  content: string;
  status: Status;
}

interface Event {
  type: string,
  data: {
    id: string,
    title: string,
    comments: Comments[];
  }
}

const events: Event[] = [];

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://localhost:4000/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4001/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4002/events", event).catch((err) => {
    console.log(err.message);
  });
  axios.post("http://localhost:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
})

app.listen(4005, () => {
  console.log('Listening on 4005')
});