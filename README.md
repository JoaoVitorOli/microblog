# Microblog (WIP)

A study project built while following Stephen Grider's **Microservices with Node JS and React** course. This is the first project of the course: a small microblog where you can publish posts and comment on them, used to introduce the basics of a microservice architecture.

> This README is a work in progress and will be completed as the project evolves.

## Project structure

### `client`

React single page application that consumes the services. It lists the published posts, lets you create a new one, and lets you read and write comments on each post.

### `server`

Holds the independent services, each one running on its own port with its own in-memory data:

- **posts** — creates and lists posts.
- **comments** — creates and lists the comments of a given post.
- **event-bus** — receives events from the services and broadcasts them to the others.

## Technologies

**Client**

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

**Server**

- Node.js
- Express
- TypeScript
- CORS
- Axios
- Nodemon

## Running locally

Install the dependencies inside each folder (`client`, `server/posts`, `server/comments`, `server/event-bus`) and start them with:

```bash
npm run dev
```
