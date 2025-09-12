import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";

// Helper to get user image
const getUserImage = (user) => user?.profileImage || "/default-avatar.png";

const ShowTask = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const token = localStorage.getItem("token");

  // Fetch task details
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
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  // Update task status or assigned user
  const handleUpdateTask = async () => {
    try {
      const res = await axiosInstance.put(
        `/api/tasks/${taskId}`,
        { status, assignedUser },
        { headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` 
  }, }
      );
      setTask(res.data.task);
      alert("Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Add new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
    const res = await axiosInstance.post(
  `/api/tasks/comments/${taskId}`,
  { text: newComment },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
);

      setComments(res.data.comments);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axiosInstance.delete(
        `/api/tasks/${taskId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (!task) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-4">{task.title}</h2>

      <div className="bg-white shadow-md rounded p-4 mb-4">
        <p className="mb-2"><strong>Description:</strong> {task.description}</p>
        <p className="mb-2"><strong>Deadline:</strong> {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : "-"}</p>

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

      {/* Comments Section */}
      <div className="bg-white shadow-md rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Comments</h3>

        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}

        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-3 bg-gray-50 p-3 rounded">
              <img
                src={getUserImage(comment.user)}
                alt={comment.user?.givenName || "User"}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold">{comment.user?.givenName || "User"}</p>
                <p>{comment.text}</p>
                <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Add Comment */}
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
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowTask;
