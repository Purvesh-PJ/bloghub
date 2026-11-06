import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import { Button, Card, TextArea, Avatar, EmptyState } from '../../../components/ui';
import { ConfirmDialog } from '../../../components/shared';

export function PostCommentsSection({
  comments = [],
  isAuthenticated,
  comment,
  setComment,
  onCommentSubmit,
  isCommentPending,
  replyTo,
  setReplyTo,
  replyText,
  setReplyText,
  onReplySubmit,
  isReplyPending,
  canDeleteComment,
  pendingCommentDelete,
  setPendingCommentDelete,
  onDeleteCommentConfirm,
  isDeleteCommentPending,
}) {
  return (
    <>
      <section id="comments" className="flex flex-col gap-6 pt-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {comments.length} {comments.length === 1 ? 'response' : 'responses'}
        </h2>

        {isAuthenticated ? (
          <form onSubmit={onCommentSubmit} className="flex flex-col gap-3 items-end w-full">
            <div className="w-full">
              <TextArea
                placeholder="What did you make of it?"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                aria-label="Write a response"
              />
            </div>
            <Button
              type="submit"
              isLoading={isCommentPending}
              disabled={!comment.trim()}
            >
              Respond
            </Button>
          </form>
        ) : (
          <Card tone="low" radius="lg" padding="lg">
            <p className="text-sm text-muted-foreground m-0">
              <Link to="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>{' '}
              to join the conversation.
            </p>
          </Card>
        )}

        {comments.length === 0 ? (
          <EmptyState icon={MessageCircle} title="No responses yet" tone="low">
            Be the first to say something.
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-6">
            {comments.map((entry) => (
              <div key={entry._id} className="flex gap-3">
                <Avatar name={entry.user?.username} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">
                      {entry.user?.username || 'Anonymous'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(() => {
                        const d = entry.date ? new Date(entry.date) : null;
                        return d && !isNaN(d.getTime())
                          ? formatDistanceToNow(d, { addSuffix: true })
                          : 'recently';
                      })()}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                    {entry.message}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    {isAuthenticated && (
                      <button
                        type="button"
                        onClick={() => setReplyTo(replyTo === entry._id ? null : entry._id)}
                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        {replyTo === entry._id ? 'Cancel' : 'Reply'}
                      </button>
                    )}

                    {canDeleteComment(entry) && (
                      <button
                        type="button"
                        onClick={() => setPendingCommentDelete(entry)}
                        aria-label={`Delete the response from ${entry.user?.username || 'this reader'}`}
                        className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Reply Composer */}
                  {replyTo === entry._id && (
                    <form
                      onSubmit={(e) => onReplySubmit(e, entry._id)}
                      className="flex flex-col gap-2 items-end mt-3 w-full"
                    >
                      <div className="w-full">
                        <TextArea
                          placeholder={`Reply to ${entry.user?.username || 'this'}`}
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          rows={2}
                          aria-label="Write a reply"
                          autoFocus
                        />
                      </div>
                      <Button
                        type="submit"
                        size="sm"
                        disabled={!replyText.trim()}
                        isLoading={isReplyPending}
                      >
                        Reply
                      </Button>
                    </form>
                  )}

                  {/* Nested Replies */}
                  {entry.replies?.length > 0 && (
                    <div className="flex flex-col gap-4 mt-4 pl-4 border-l-2 border-border/60">
                      {entry.replies.map((reply) => (
                        <div key={reply._id} className="flex gap-3">
                          <Avatar name={reply.user?.username} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-foreground">
                                {reply.user?.username || 'Anonymous'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {(() => {
                                  const d = reply.date ? new Date(reply.date) : null;
                                  return d && !isNaN(d.getTime())
                                    ? formatDistanceToNow(d, { addSuffix: true })
                                    : 'recently';
                                })()}
                              </span>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mt-1 whitespace-pre-wrap leading-relaxed">
                              {reply.message}
                            </p>

                            {canDeleteComment(reply) && (
                              <div className="flex items-center gap-4 mt-2">
                                <button
                                  type="button"
                                  onClick={() => setPendingCommentDelete(reply)}
                                  aria-label={`Delete the reply from ${reply.user?.username || 'this reader'}`}
                                  className="text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Comment Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(pendingCommentDelete)}
        onClose={() => setPendingCommentDelete(null)}
        title="Remove this response?"
        description={
          pendingCommentDelete?.replies?.length
            ? 'Its replies will be removed with it. This cannot be undone.'
            : 'This cannot be undone.'
        }
        confirmText="Remove"
        onConfirm={onDeleteCommentConfirm}
        isLoading={isDeleteCommentPending}
      />
    </>
  );
}
