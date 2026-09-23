import { useEffect, useState } from 'react'
import { Button, Card, Input } from './components/ui'
import { PostCard } from './components/PostCard'
import { createComment, createPost, fetchPosts, type Post } from './lib/api'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [title, setTitle] = useState('')
  const [creating, setCreating] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [pendingCommentIds, setPendingCommentIds] = useState<string[]>([])
  const [rejectedNoticeIds, setRejectedNoticeIds] = useState<Set<string>>(new Set())

  async function loadPosts() {
    setLoadingPosts(true)
    try {
      const data = await fetchPosts()
      setPosts(data || [])
    } catch {
      setPosts([])
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(() => {
    if (pendingCommentIds.length === 0) return

    const interval = setInterval(async () => {
      const data = await fetchPosts()
      const freshComments = data.flatMap((post) => post.comments)

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          const updated = data.find((p) => p.id === post.id)
          if (!updated) return post
          return {
            ...post,
            comments: post.comments.map((comment) => {
              const fresh = updated.comments.find((c) => c.id === comment.id)
              return fresh ?? comment
            }),
          }
        }),
      )

      const stillPending: string[] = []
      const newlyRejected: string[] = []

      for (const id of pendingCommentIds) {
        const fresh = freshComments.find((c) => c.id === id)
        if (!fresh || fresh.status === 'pending') {
          stillPending.push(id)
        } else if (fresh.status === 'rejected') {
          newlyRejected.push(id)
        }
      }

      if (newlyRejected.length > 0) {
        setRejectedNoticeIds((prev) => new Set([...prev, ...newlyRejected]))
      }

      setPendingCommentIds(stillPending)
    }, 1000)

    return () => clearInterval(interval)
  }, [pendingCommentIds])

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

  async function handleAddComment(postId: string, content: string) {
    const comment = await createComment(postId, content)

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post,
      ),
    )

    setPendingCommentIds((prev) => [...prev, comment.id])
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

          {posts && posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              expanded={expandedId === post.id}
              rejectedNoticeIds={rejectedNoticeIds}
              onToggle={() => setExpandedId((prev) => (prev === post.id ? null : post.id))}
              onAddComment={(content) => handleAddComment(post.id, content)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
