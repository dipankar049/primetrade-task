import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", country: "" });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token =
                    localStorage.getItem("token") || sessionStorage.getItem("token");

                const res = await axios.get(`${apiUrl}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setForm(res.data.user);
            } catch (err) {
                toast.error("Failed to load profile");
            }
        };

        fetchProfile();
    }, []);

    const validateForm = () => {
        const { name, email, country } = form;

        if (!name.trim()) {
            toast.error("Name is required");
            return false;
        }

        if (!email.trim()) {
            toast.error("Email is required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return false;
        }

        if (!country.trim()) {
            toast.error("Country is required");
            return false;
        }

        return true;
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token") || sessionStorage.getItem("token");

            toast.info("Updating profile...");

            const res = await axios.put(
                `${apiUrl}/api/auth/update`,
                {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    country: form.country.trim(),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setForm(res.data.user); // sync updated data
            toast.success("Profile updated successfully!");
            setEditMode(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        toast(
            ({ closeToast }) => (
                <div>
                    <p className="font-medium mb-3">Are you sure you want to logout?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => closeToast()}
                            className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                sessionStorage.removeItem("token");
                                closeToast();
                                toast.success("Logged out successfully");
                                navigate("/login", { replace: true });
                            }}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ),
            {
                position: "top-center",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-16 px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 transition-all">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>

                    {!editMode ? (
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditMode(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm transition"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* View Mode */}
                {!editMode ? (
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg font-medium">{form.name}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="text-lg font-medium">{form.email}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Country</p>
                            <p className="text-lg font-medium">{form.country}</p>
                        </div>
                    </div>
                ) : (
                    /* Edit Mode */
                    <div className="space-y-4">
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name"
                        />

                        <input
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email"
                        />

                        <input
                            value={form.country}
                            onChange={(e) =>
                                setForm({ ...form, country: e.target.value })
                            }
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Country"
                        />

                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t flex justify-center sm:justify-end">
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;