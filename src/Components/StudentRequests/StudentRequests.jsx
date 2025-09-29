import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [files, setFiles] = useState([]); // attachments for new ticket
  const [comment, setComment] = useState({});
  const [commentFiles, setCommentFiles] = useState({}); // attachments for each comment

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    const res = await axiosInstance.get("/api/requests/my");
    setRequests(res.data);
  };

  // ------------------- NEW TICKET -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    files.forEach((file) => formData.append("attachments", file));

    await axiosInstance.post("/api/requests", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setForm({ title: "", description: "" });
    setFiles([]);
    fetchMyRequests();
  };

  // ------------------- ADD COMMENT -------------------
  const handleComment = async (id) => {
    if (!comment[id] && !(commentFiles[id] && commentFiles[id].length)) return;

    const formData = new FormData();
    formData.append("text", comment[id] || "");
    (commentFiles[id] || []).forEach((file) => formData.append("attachments", file));

    await axiosInstance.post(`/api/requests/${id}/comment`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setComment({ ...comment, [id]: "" });
    setCommentFiles({ ...commentFiles, [id]: [] });
    fetchMyRequests();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>

      {/* New Ticket Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Raise Ticket
        </button>
      </form>

      {/* My Tickets */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold">{req.title}</h3>
            <p>{req.description}</p>
            <p className="text-sm text-gray-600">Status: {req.status}</p>

            {/* Attachments */}
            {req.attachments?.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold text-sm">Attachments:</h4>
                {req.attachments.map((att, i) => (
                  <div key={i}>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      {att.name}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Comments Thread */}
            <div className="mt-3 bg-gray-100 p-2 rounded">
              <h4 className="font-semibold">Conversation</h4>
              {req.comments?.map((c, i) => (
                <div key={i} className="mb-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-600">
                      {c.user?.fullName || "User"} ({c.user?.role || "student"}):
                    </span>{" "}
                    {c.text}
                  </p>
                  {c.attachments?.length > 0 && (
                    <div className="ml-4">
                      {c.attachments.map((att, j) => (
                        <div key={j}>
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            {att.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Reply with attachments */}
              <div className="flex flex-col mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Reply..."
                  value={comment[req._id] || ""}
                  onChange={(e) => setComment({ ...comment, [req._id]: e.target.value })}
                  className="flex-1 border p-1 rounded text-sm"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e) => setCommentFiles({ ...commentFiles, [req._id]: [...e.target.files] })}
                  className="border p-1 rounded text-sm"
                />
                <button
                  onClick={() => handleComment(req._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
