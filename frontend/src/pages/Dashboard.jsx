import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [tasks, setTasks] = useState({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      setError('No token found');
      setLoading(false);
      return;
    }

    try {

      const projectRes = await axios.get(
        `${apiUrl}/api/projects?search=${search}&sort=${sort}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(projectRes.data);

      const tasksData = {};
      for (const project of projectRes.data) {
        const taskRes = await axios.get(`${apiUrl}/api/tasks/${project._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        tasksData[project._id] = taskRes.data;
      }
      setTasks(tasksData);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      return toast.error("Please fill in both title and description");
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await axios.post(`${apiUrl}/api/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([...projects, res.data]);
      toast.success(`Project "${newProject.title}" added successfully`);
      setNewProject({ title: '', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add Project");
    }
  };

  // Add this at the top of your component or file
  const openDeleteToasts = new Set();

  const handleDeleteProject = (projectId, projectTitle) => {
    // Prevent multiple toasts for the same project
    if (openDeleteToasts.has(projectId)) return;

    openDeleteToasts.add(projectId);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const toastId = toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-medium">
            Delete project "<span className="text-red-600">{projectTitle}</span>"?
          </p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                toast.dismiss(toastId);
                openDeleteToasts.delete(projectId);
              }}
              className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${apiUrl}/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setProjects((prev) => prev.filter((p) => p._id !== projectId));
                  const updatedTasks = { ...tasks };
                  delete updatedTasks[projectId];
                  setTasks(updatedTasks);
                  toast.dismiss(toastId);
                  toast.success('Project deleted successfully');
                } catch (err) {
                  toast.dismiss(toastId);
                  toast.error(err.response?.data?.message || 'Failed to delete project');
                } finally {
                  openDeleteToasts.delete(projectId);
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: 'top-center',
        limit: 1,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
        onClose: () => openDeleteToasts.delete(projectId),
      }
    );
  };


  const handleGoToTaskManagement = (projectId) => {
    navigate(`/task-management/${projectId}`);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1">
        <div className="mt-2 sm:mt-4 px-2 sm:px-6">

          {/* Search & Filter Section */}
          <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col gap-2">

              {/* Row 1: Search */}
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border px-3 py-1.5 text-sm rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {/* Row 2: Sort + Apply */}
              <div className="flex gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border px-3 py-1.5 text-sm rounded-md flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>

                <button
                  onClick={fetchProjects}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-sm rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-6">
            {/* Projects List Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Your Projects
                </h3>
                <p className="text-sm text-gray-500">
                  Manage and organize your work
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-105"
              >
                <Plus size={20} />
              </button>
            </div>
            
            {projects.length > 0 ? (
              <div className="space-y-2 overflow-x-hidden">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition hover:shadow-md"
                  >
                    {/* Top Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      {/* Title + Description */}
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold truncate">
                          {project.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {project.description}
                        </p>
                      </div>

                      {/* Buttons (Desktop inline) */}
                      <div className="hidden sm:flex gap-2">
                        <button
                          onClick={() => handleGoToTaskManagement(project._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 text-sm rounded-md"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project._id, project.title)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 text-sm rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Mobile Buttons (Bottom Row) */}
                    <div className="flex gap-2 mt-3 sm:hidden">
                      <button
                        onClick={() => handleGoToTaskManagement(project._id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 text-sm rounded-md"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDeleteProject(project._id, project.title)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 text-sm rounded-md"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            ) : (
              <p className="text-gray-500">No projects found. Create your first project!</p>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-4 sm:p-6 mx-6 rounded-lg shadow-lg">

            <h3 className="text-lg font-semibold mb-4">Create Project</h3>

            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="border w-full px-3 py-2 mb-3 rounded-md text-sm"
            />

            <input
              type="text"
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="border w-full px-3 py-2 mb-4 rounded-md text-sm"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 text-sm bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleAddProject();
                  setShowModal(false);
                }}
                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;