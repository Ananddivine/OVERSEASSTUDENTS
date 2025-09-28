import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../axiosInstance/axiosInstance";
import defaultImage from '../../assets/defaultImage.png'

// Helper to get user image
const getUserImage = (user) => user?.profileImage || defaultImage;

// Confirmation modal
const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-md w-96">
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const ShowTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newReplies, setNewReplies] = useState({});
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [deleteCommentModal, setDeleteCommentModal] = useState({ open: false, commentId: null });

  const token = localStorage.getItem("token");
  const uniqToken = localStorage.getItem("uniqToken");

  // Fetch task
  const fetchTask = async () => {
    try {
      const res = await axiosInstance.get(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(res.data.task);
      setComments(res.data.task.comments || []);
      setStatus(res.data.task.status || "TODO");
      setAssignedUser(res.data.task.assignedUser || "");
    } catch (err) {
      console.error("Error fetching task:", err);
      toast.error("Failed to fetch task!");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  // Update task status
  const handleUpdateTask = async () => {
    try {
      const res = await axiosInstance.put(
        `/api/tasks/${taskId}`,
        { status, assignedUser },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-uniq-token": uniqToken,
          },
        }
      );
      setTask(res.data.task);
      toast.success("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task!");
    }
  };

  // Add a new comment (student/admin)
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/api/tasks/comments/${taskId}`,
        { text: newComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-uniq-token": uniqToken,
          },
        }
      );
      setComments(res.data.comments);
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment!");
    }
  };

  // Add admin reply to a comment
  const handleAddAdminReply = async (commentId) => {
    const replyText = newReplies[commentId];
    if (!replyText?.trim()) return;

    try {
      const res = await axiosInstance.post(
        `/api/tasks/admincomments/${taskId}/${commentId}`,
        { text: replyText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-uniq-token": uniqToken,
          },
        }
      );
      setComments(res.data.comments);
      setNewReplies({ ...newReplies, [commentId]: "" });
      toast.success("Reply added!");
    } catch (err) {
      console.error("Error adding reply:", err);
      toast.error("Failed to add reply!");
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axiosInstance.delete(
        `/api/tasks/${taskId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}`, "x-uniq-token": uniqToken } }
      );
      setComments(res.data.comments);
      toast.success("Comment deleted!");
      setDeleteCommentModal({ open: false, commentId: null });
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment!");
    }
  };

  // Delete the task
  const handleDeleteTask = async () => {
    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}`, "x-uniq-token": uniqToken },
      });
      toast.success("Task deleted successfully!");
      setDeleteTaskModal(false);
      navigate("/Task");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task!");
    }
  };

  if (!task) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Modals */}
      {deleteTaskModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this task?"
          onConfirm={handleDeleteTask}
          onCancel={() => setDeleteTaskModal(false)}
        />
      )}
      {deleteCommentModal.open && (
        <ConfirmationModal
          message="Are you sure you want to delete this comment?"
          onConfirm={() => handleDeleteComment(deleteCommentModal.commentId)}
          onCancel={() => setDeleteCommentModal({ open: false, commentId: null })}
        />
      )}

      {/* Task info */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">{task.title}</h2>
        
      </div>

      <div className="bg-white shadow-md rounded p-4 mb-4">
        <p className="mb-2"><strong>Description:</strong> {task.description}</p>
        <p className="mb-2">
          <strong>Deadline:</strong>{" "}
          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="font-semibold">Status:</label>
            <select
              className="ml-2 px-2 py-1 border rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="TODO">TODO</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="FAILED">FAILED</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <button
            onClick={handleUpdateTask}
            className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Task
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Comments</h3>

        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 p-3 rounded">
              <div className="flex items-start gap-3">
                <img
                  src={getUserImage(comment.user)}
                  alt={comment.user?.givenName || "User"}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="">
                    <p className="text-sm font-semibold">{comment.user?.givenName || "Student"}</p>
                  <p>{comment.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  </div>

                  {/* Show replies */}
                  {comment.replies?.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-300 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="flex items-start gap-2 rounded-sm bg-gray-200 border-gray-400 px-3 py-3">
                          <img
                            src={getUserImage(reply.user) || defaultImage }
                            alt={reply.user?.givenName || "ADMIN"}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-semibold">{reply.user?.givenName || "ADMIN"}</p>
                            <p>{reply.text}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(reply.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}                  
                </div>               
              </div>
            </div>
          ))}
        </div>

        {/* Add main comment */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowTask;
