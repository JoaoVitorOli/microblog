import { useState } from 'react'
import type { Comment, Post } from '../lib/api'
import { Button, Card, Textarea } from './ui'

interface Props {
  post: Post
  expanded: boolean
  comments: Comment[]
  loadingComments: boolean
  onToggle: () => void
  onAddComment: (content: string) => Promise<void>
}

export function PostCard({ post, expanded, comments, loadingComments, onToggle, onAddComment }: Props) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
          {expanded ? 'Ocultar' : 'Comentários'}
        </Button>
      </div>

      {expanded && (
        <div className="mt-5 space-y-4 border-t border-zinc-800 pt-4">
          {loadingComments && <p className="text-sm text-zinc-500">Carregando comentários...</p>}

          {!loadingComments && comments.length === 0 && (
            <p className="text-sm text-zinc-500">Nenhum comentário ainda.</p>
          )}

          {!loadingComments && comments.length > 0 && (
            <ul className="space-y-2">
              {comments.map((comment) => (
                <li key={comment.id} className="rounded-lg bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
                  {comment.content}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-start gap-2">
            <Textarea
              rows={2}
              placeholder="Escreva um comentário..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleSubmit} disabled={submitting || !content.trim()}>
              Enviar
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
