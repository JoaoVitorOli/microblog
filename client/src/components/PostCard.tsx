import { useState } from 'react'
import type { Comment, Post } from '../lib/api'
import { Badge, Button, Card, Textarea } from './ui'

interface Props {
  post: Post
  expanded: boolean
  rejectedNoticeIds: Set<string>
  onToggle: () => void
  onAddComment: (content: string) => Promise<void>
}

function statusTone(status: Comment['status']) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  return 'neutral'
}

export function PostCard({ post, expanded, rejectedNoticeIds, onToggle, onAddComment }: Props) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const visibleComments = post.comments.filter(
    (c) => c.status !== 'rejected' || rejectedNoticeIds.has(c.id),
  )

  async function handleSubmit() {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await onAddComment(content.trim())
      setContent('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">#{post.id}</p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-100">{post.title}</h3>
        </div>
        <Button variant="ghost" onClick={onToggle}>
          {expanded ? 'Hide' : `Comments (${visibleComments.length})`}
        </Button>
      </div>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-zinc-800 pt-4">
          {visibleComments.length === 0 && (
            <p className="text-sm text-zinc-500">No comments yet.</p>
          )}

          {visibleComments.length > 0 && (
            <ul className="space-y-2">
              {visibleComments.map((comment) => (
                <li
                  key={comment.id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950 px-3 py-2 text-sm"
                >
                  <span className={comment.status === 'rejected' ? 'italic text-zinc-500' : 'text-zinc-300'}>
                    {comment.status === 'rejected' ? 'Your comment has been rejected' : comment.content}
                  </span>
                  <Badge tone={statusTone(comment.status)}>{comment.status}</Badge>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-start gap-2">
            <Textarea
              rows={2}
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={submitting || !content.trim()}>
              Send
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
