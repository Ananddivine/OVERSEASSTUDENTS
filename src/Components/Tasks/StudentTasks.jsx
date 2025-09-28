import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// Helper to get profile image
const getUserImage = (profile) => profile?.avatar || "/default-avatar.png";

const StudentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [profile, setProfile] = useState(null);

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: new Date(), endDate: new Date(), key: "selection" });
  const [filters, setFilters] = useState({ date: "", status: "", assigned: "", connect: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const navigate = useNavigate();

  // Fetch student profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/students/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data.student);
        
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch tasks assigned to student
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axiosInstance.get("/api/tasks/my-tasks-by-email", {
          params: { email: localStorage.getItem("userEmail") },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTasks(res.data.tasks);
        console.log('fetched task:', res.data.tasks)
        setFilteredTasks(res.data.tasks);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // Handle filters
  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const deadlineMatch = !filters.date || new Date(task.deadline).toDateString().includes(filters.date);
      const statusMatch = !filters.status || task.status === filters.status;
      const assignedMatch = !filters.assigned || task.assignedUser.toLowerCase().includes(filters.assigned.toLowerCase());
      const connectMatch = !filters.connect || (task.company && task.company.toLowerCase().includes(filters.connect.toLowerCase()));
      return deadlineMatch && statusMatch && assignedMatch && connectMatch;
    });
    setFilteredTasks(filtered);
  }, [filters, tasks]);

const handleRowClick = (task) => {
  // Use MongoDB _id, not taskId
  navigate(`/ShowTask/${task._id}`);
};

  const toggleDateFilter = () => setShowDateFilter((prev) => !prev);
  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange({ startDate, endDate, key: "selection" });

    const filtered = tasks.filter((task) => {
      if (!task.deadline) return false;
      const deadline = new Date(task.deadline);
      return deadline >= startDate && deadline <= endDate;
    });

    setFilteredTasks(filtered);
    setShowDateFilter(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  return (
   <div className=" text-center w-full items-center mx-3" >
      <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>

  
      {/* Table */}
      <div className="bg-white shadow-md rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
               <th className="py-2 px-4 border-r">FROM / TO</th>
                <th className="py-2 px-4 border-r">TITLE</th>
                 <th className="py-2 px-4 border-r">STATUS</th>
              <th className="py-2 px-4 border-r">DATE</th>                              
              <th className="py-2 px-4 border-r">ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((task, idx) => (
                <tr
                  key={task._id}
                  className={`border-b hover:bg-gray-100 cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  onClick={() => handleRowClick(task)}
                >
                  <td className="py-2 px-4 border-r flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <img src={profile?.profileImage} className="w-8 h-8 rounded-full" />
                      <p className="text-sm">{profile?.givenName} {profile?.surname}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={profile?.profileImage} className="w-8 h-8 rounded-full" />
                      <p className="text-sm">Admin</p>
                    </div>
                  </td>
                   <td className="py-2 px-4 border-r font-semibold">{task.title}</td>                 
                  
                  <td className="py-2 px-4 border-r">
                    <span
                      className={`px-2 py-1 rounded text-white font-semibold ${
                        task.status === "DONE"
                          ? "bg-green-500"
                          : task.status === "PROCESSING"
                          ? "bg-yellow-500"
                          : task.status === "FAILED"
                          ? "bg-red-500"
                          : task.status === "BLOCKED"
                          ? "bg-black"
                          : "bg-blue-500"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                 <td className="py-2 px-4 border-r">{new Date(task.createdAt).toDateString()}</td>
                  
                  <td className="py-2 px-4 text-red-500">Deadline: {new Date(task.createdAt).toDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex space-x-2 mt-4">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-900 text-white rounded disabled:opacity-50">
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => setCurrentPage(num)} className={`px-3 py-1 rounded ${currentPage === num ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
            {num}
          </button>
        ))}
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages} className="px-3 py-1 bg-gray-900 text-white rounded disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentTasks;
