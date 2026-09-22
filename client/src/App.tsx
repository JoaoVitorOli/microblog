import { useEffect, useState } from 'react'
import { Button, Card, Input } from './components/ui'
import { PostCard } from './components/PostCard'
import {
  createComment,
  createPost,
  fetchComments,
  fetchPosts,
  type Comment,
  type Post,
} from './lib/api'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>({})
  const [loadingComments, setLoadingComments] = useState(false)

  async function loadPosts() {
    setLoadingPosts(true)
    try {
      const data = await fetchPosts()
      setPosts(data)
    } catch {
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleCreatePost() {
    if (!title.trim()) return
    setCreating(true)
    try {
      await createPost(title.trim())
      setTitle('')
      await loadPosts()
    } finally {
      setCreating(false)
    }
  }

  async function handleToggle(postId: string) {
    if (expandedId === postId) {
      setExpandedId(null)
      return
    }
    setExpandedId(postId)
    if (!commentsByPost[postId]) {
      setLoadingComments(true)
      try {
        const data = await fetchComments(postId)
        setCommentsByPost((prev) => ({ ...prev, [postId]: data }))
      } finally {
        setLoadingComments(false)
      }
    }
  }

  async function handleAddComment(postId: string, content: string) {
    const data = await createComment(postId, content)
    setCommentsByPost((prev) => ({ ...prev, [postId]: data }))
  }

  return (
    <div className="min-h-screen bg-[#0b0c10]">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-zinc-100">Microblog</h1>
        </header>

        <Card className="mb-8 p-5">
          <h2 className="mb-3 text-sm font-medium text-zinc-300">New post</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
            />
            <Button onClick={handleCreatePost} disabled={creating || !title.trim()}>
              Publish
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {loadingPosts && <p className="text-sm text-zinc-500">Loading posts...</p>}

          {!loadingPosts && posts.length === 0 && (
            <p className="text-sm text-zinc-500">No posts published yet.</p>
          )}

          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              expanded={expandedId === post.id}
              comments={commentsByPost[post.id] ?? []}
              loadingComments={expandedId === post.id && loadingComments}
              onToggle={() => handleToggle(post.id)}
              onAddComment={(content) => handleAddComment(post.id, content)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
