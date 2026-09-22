import axios from 'axios'

export const postsApi = axios.create({
  baseURL: import.meta.env.VITE_POSTS_SERVICE_URL ?? 'http://localhost:4000',
})

export const commentsApi = axios.create({
  baseURL: import.meta.env.VITE_COMMENTS_SERVICE_URL ?? 'http://localhost:4001',
})

export interface Post {
  id: string
  title: string
}

export interface Comment {
  id: string
  content: string
}

export async function fetchPosts() {
  const { data } = await postsApi.get<Record<string, Post>>('/post')
  return Object.values(data)
}

export async function createPost(title: string) {
  const { data } = await postsApi.post<Post>('/post', { title })
  return data
}

export async function fetchComments(postId: string) {
  const { data } = await commentsApi.get<Comment[]>(`/posts/${postId}/comments`)
  return data
}

export async function createComment(postId: string, content: string) {
  const { data } = await commentsApi.post<Comment[]>(`/posts/${postId}/comments`, { content })
  return data
}
