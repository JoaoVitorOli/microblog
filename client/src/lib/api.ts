import axios from 'axios'

export const postsApi = axios.create({
  baseURL: import.meta.env.VITE_POSTS_SERVICE_URL ?? 'http://localhost:4000',
})

export const commentsApi = axios.create({
  baseURL: import.meta.env.VITE_COMMENTS_SERVICE_URL ?? 'http://localhost:4001',
})

export const queryApi = axios.create({
  baseURL: import.meta.env.VITE_QUERY_SERVICE_URL ?? 'http://localhost:4002',
})

export type CommentStatus = 'pending' | 'approved' | 'rejected'

export interface Comment {
  id: string
  content: string
  status: CommentStatus
}

export interface Post {
  id: string
  title: string
  comments: Comment[]
}

export async function fetchPosts() {
  const { data } = await queryApi.get<Post[]>('/posts')
  return data
}

export async function createPost(title: string) {
  const { data } = await postsApi.post<{ id: string; title: string }>('/posts', { title })
  return data
}

export async function createComment(postId: string, content: string) {
  const { data } = await commentsApi.post<Comment[]>(`/posts/${postId}/comments`, { content })
  return data[data.length - 1]
}
