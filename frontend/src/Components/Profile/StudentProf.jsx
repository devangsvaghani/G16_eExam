import React, { useState, useEffect } from "react";
import "./StudentProf.css";
import user from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import config from "../../config.js";
import { useAuth } from "../../context/auth.jsx";
import axios from "axios";

function StudentProf({ onClose, toast, username, setStudents }) {
    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        middlename: "",
        email: "",
        mobileno: "",
        dob: "",
        gender: "",
        batch: "",
        branch: "",
        graduation: "",
    });
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // New state to check if user is an admin
    const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!Cookies.get("role")) {
            navigate("/");
        }

        if(!username){
            toast.error("Profile not found");
            navigate(-1);
        }

        if (Cookies.get("role") === "Admin") {
            setIsAdmin(true);
        }

        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            };

            const result = await axios.get(
                (config.BACKEND_API || "http://localhost:8000") +
                    `/get-student/${username}`,
                { headers }
            );

            console.log(result);

            setUserData(result.data.user);
        } catch (e) {
            console.log(e);

            toast.error(e?.response?.data?.message || "Internal server error");
        }
    };

    const handleresetpass = () => {
        navigate("/reset-password");
    };

    // Update form data on input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
        console.log(userData);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();

        const contactRegex = /^\d{10}$/;

        if (!contactRegex.test(userData.mobileno)) {
            toast.error("Contact number must be 10 digits");
            return;
        }
        if (!userData.graduation) {
            toast.error("Please select your graduation type (UG or PG)");
            return;
        }

        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            };

            const result = await axios.put(
                (config.BACKEND_API || "http://localhost:8000") +
                    `/update-student/${username}`,
                userData,
                { headers }
            );

            console.log(result);

            if (result.status !== 200) {
                toast.error(result?.data?.message || "Internal server error");
                return;
            }

            toast.success(result.data.message);
            onClose();

            if (setStudents) {
                setStudents((prevItems) => {
                    const index = prevItems.findIndex(
                        (item) => item.username === username
                    );
                    if (index !== -1) {
                        const updatedItems = [...prevItems];
                        updatedItems[index] = {
                            ...updatedItems[index],
                            ...userData,
                        }; // Update element
                        return updatedItems;
                    }
                    return prevItems;
                });
            }
        } catch (e) {
            console.log(e);

            toast.error(e?.response?.data?.message || "Internal server error");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="studentpdiv">
            <div id="profilecontainer">
                <div id="profile-card">
                    <div id="content">
                        <h2>Profile Settings</h2>
                        <form id="profile-form">
                            <div id="form-group">
                                <label>Student ID</label>
                                <input type="text" value={username} readOnly />
                            </div>
                            <div id="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="Enter first number"
                                    value={userData.firstname}
                                    onChange={handleChange}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div id="form-group">
                                <label>Middle Name</label>
                                <input
                                    type="text"
                                    name="middlename"
                                    placeholder="Enter Middle Name"
                                    value={userData.middlename}
                                    onChange={handleChange}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div id="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Enter Last Name"
                                    value={userData.lastname}
                                    onChange={handleChange}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div id="form-group">
                                <label>Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Enter email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div id="form-group">
                                <label>Mobile No</label>
                                <input
                                    type="Number"
                                    name="mobileno"
                                    placeholder="Enter Mobile no"
                                    value={userData.mobileno}
                                    onChange={handleChange}
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div id="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    placeholder="Date of Birth"
                                    value={userData.dob}
                                    onChange={(e) =>
                                        setUserData({
                                            ...userData,
                                            dob: e.target.value,
                                        })
                                    }
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div className="select-branch">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    className="select-branch-select"
                                    name="gender"
                                    value={userData.gender}
                                    onChange={handleChange}
                                    required
                                    aria-label="Select gender"
                                    readOnly={!isAdmin}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female" selected>
                                        Female
                                    </option>
                                </select>
                            </div>
                            <div className="select-branch">
                                <label htmlFor="batch">Batch</label>
                                <input
                                    type="number"
                                    name="batch"
                                    value={userData.batch}
                                    onChange={handleChange}
                                    placeholder="Enter batch"
                                    required
                                    readOnly={!isAdmin}
                                />
                            </div>
                            <div className="select-branch">
                                <label htmlFor="branch">Branch:</label>
                                <select
                                    className="select-branch-select"
                                    name="branch"
                                    value={userData.branch}
                                    onChange={handleChange}
                                    required
                                    aria-label="Select branch"
                                    readOnly={!isAdmin}
                                >
                                    <option value="">Select branch</option>
                                    <option value="ICT">
                                        Information and Communication Technology
                                    </option>
                                    <option value="CS">Computer Science</option>
                                    <option value="MnC">
                                        Mathematics and Computation
                                    </option>
                                    <option value="EVD">
                                        Electronics and VLSI Design
                                    </option>
                                </select>
                            </div>
                            <div className="select-branch">
                                <label htmlFor="graduation">graduation</label>
                                <select
                                    className="select-branch-select"
                                    name="graduation"
                                    value={userData.graduation}
                                    onChange={handleChange}
                                    required
                                    aria-label="Select graduation"
                                    readOnly={!isAdmin}
                                >
                                    <option value="">Select graduation</option>
                                    <option value="UG">UG</option>
                                    <option value="PG" selected>
                                        PG
                                    </option>
                                </select>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar with Profile Image, Info, Reset Password Button, and Edit Profile (only for Admins) */}
                    <div id="sbar">
                        <div>
                            <img src={user} alt="Profile" id="profile-pic" />
                            <h3 id="profile-name">
                                {`${userData.firstname} ${userData.lastname}`}
                            </h3>
                            <p id="profile-email">{userData.email}</p>
                        </div>
                        <div className="profilebtns">
                            { !isAdmin && 
                            <button
                                type="button"
                                id="reset-button"
                                onClick={handleresetpass}
                            >
                                Reset Password
                            </button>
                            }
                            {isAdmin && ( // Only render the "Edit Profile" button if the user is an admin
                                <button
                                    type="button"
                                    id="save-button"
                                    onClick={handleSaveProfile}
                                >
                                    Save Changes
                                </button>
                            )}
                            <button
                                type="button"
                                id="reset-button"
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProf;
