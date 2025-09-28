import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";

export default function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [comment, setComment] = useState({});

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    const res = await axiosInstance.get("/api/requests/my");
    setRequests(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosInstance.post("/api/requests", form);
    setForm({ title: "", description: "" });
    fetchMyRequests();
  };

  const handleComment = async (id) => {
    if (!comment[id]) return;
    await axiosInstance.post(`/api/requests/${id}/comment`, { text: comment[id] });
    setComment({ ...comment, [id]: "" });
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

            {/* Comments Thread */}
            <div className="mt-3 bg-gray-100 p-2 rounded">
              <h4 className="font-semibold">Conversation</h4>
              {req.comments?.map((c, i) => (
                <p key={i} className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">
                    {c.user?.name || "User"} ({c.user?.role || "student"}):
                  </span>{" "}
                  {c.text}
                </p>
              ))}
              <div className="flex mt-2">
                <input
                  type="text"
                  placeholder="Reply..."
                  value={comment[req._id] || ""}
                  onChange={(e) => setComment({ ...comment, [req._id]: e.target.value })}
                  className="flex-1 border p-1 rounded text-sm"
                />
                <button
                  onClick={() => handleComment(req._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded ml-2 text-sm"
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
