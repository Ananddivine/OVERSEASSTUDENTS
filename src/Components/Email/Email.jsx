import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../axiosInstance/axiosInstance";

const Email = () => {
  const location = useLocation();
  const { student } = location.state || {};

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [previousEmails, setPreviousEmails] = useState([]);

  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const fetchEmails = async () => {
    if (student && student._id) {
      try {
        const res = await axiosInstance.get(`/emails/${student._id}`);
        setPreviousEmails(res.data);
      } catch (err) {
        console.error("Error fetching emails:", err);
      }
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [student]);

  const handleSend = async () => {
    try {
      await axiosInstance.post("/emails", {
        studentId: student._id,
        subject: message.split("\n")[0],
        body: message,
        attachments: attachments.map((file) => file.name),
      });
      alert("Email sent successfully!");
      setMessage("");
      setAttachments([]);
      fetchEmails(); // refresh email list
    } catch (err) {
      console.error("Error sending email:", err);
      alert("Failed to send email.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row p-6 gap-4 bg-gray-100 min-h-screen">
      {/* Left sidebar */}
      <div className="w-full md:w-1/3 bg-white rounded shadow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Previous Emails</h2>
        {previousEmails.length > 0 ? (
          previousEmails.map((email) => (
            <div key={email._id} className="mb-2">
              <div
                onClick={() =>
                  selectedEmail?._id === email._id
                    ? setSelectedEmail(null)
                    : setSelectedEmail(email)
                }
                className={`border-b p-2 rounded cursor-pointer hover:bg-gray-50 ${
                  selectedEmail?._id === email._id ? "bg-gray-100" : ""
                }`}
              >
                <h3 className="font-bold text-gray-800">{email.subject}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(email.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-1 truncate">
                  {email.body}
                </p>
              </div>

              {selectedEmail?._id === email._id && (
                <div className="p-2 bg-gray-50 border rounded mt-1">
                  <p className="text-gray-700">{email.body}</p>
                  <button
                    onClick={() =>
                      setMessage(`Re: ${email.subject}\n\n${email.body}`)
                    }
                    className="bg-blue-600 text-white px-3 py-1 mt-2 rounded hover:bg-blue-700"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No previous emails found.</p>
        )}
      </div>

      {/* Compose area */}
      <div className="w-full md:w-2/3 bg-white rounded shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
        {student ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              <p>
                <strong>To:</strong> {student.studentName} ({student.college})
              </p>
              <p>
                <strong>Country:</strong> {student.country}
              </p>
            </div>

            <textarea
              rows="5"
              placeholder="Write your email message..."
              className="w-full border border-gray-300 p-3 rounded focus:ring focus:ring-blue-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Attachments:
              </label>
              <input
                type="file"
                multiple
                onChange={handleAttachmentChange}
                className="block w-full border border-gray-300 p-2 rounded"
              />
              {attachments.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                  {attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow mt-2"
            >
              Send Email
            </button>
          </div>
        ) : (
          <p className="text-red-600">No student data found.</p>
        )}
      </div>
    </div>
  );
};

export default Email;
