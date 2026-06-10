import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { fetchLeaveComments } from '../api';
import {
  addCommentAtom,
  teamMembersQueryAtom,
} from '../store/atoms';
import type { LeaveComment, LeaveRequest } from '../types';
import { LoadingState } from './LoadingState';

interface CommentsPanelProps {
  leaveRequest: LeaveRequest;
}

export function CommentsPanel({ leaveRequest }: CommentsPanelProps) {
  const members = useAtomValue(teamMembersQueryAtom);
  const [, addComment] = useAtom(addCommentAtom);
  const [comments, setComments] = useState<LeaveComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const memberList = members.state === 'hasData' ? members.data : [];
  const currentUser = memberList.length > 0 ? memberList[0] : null;

  useEffect(() => {
    async function loadComments() {
      setLoading(true);
      try {
        const data = await fetchLeaveComments(leaveRequest.id);
        setComments(data);
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [leaveRequest.id]);

  async function handleAddComment() {
    if (!newComment.trim() || !currentUser) return;

    setSubmitting(true);
    try {
      const comment = await addComment({
        leaveRequestId: leaveRequest.id,
        authorId: currentUser.id,
        commentText: newComment,
      });
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingState variant="form" />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comments ({comments.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {currentUser && (
          <Stack spacing={2} sx={{ mb: 3 }}>
            <TextField
              multiline
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
              disabled={submitting}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
            >
              Add Comment
            </Button>
          </Stack>
        )}

        <Divider sx={{ mb: 2 }} />

        {comments.length === 0 ? (
          <Typography color="textSecondary">No comments yet</Typography>
        ) : (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {comment.authorName.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {comment.authorName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.commentText}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
