import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "../Dashboard/Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQurery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get("/api/admin/user-details", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              page: currentPage,
              limit: itemsPerPage,
            },
          });

          if (response.data.success) {
            setUserDetails(response.data.users);
            setTotalPages(response.data.totalPages);
          } else {
            console.log("failed to user Details");
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchUserDetails();
    } else {
      console.log("errro");
      navigate("/admin/login");
    }
  }, [currentPage, navigate]);

  const handleEditUser = (userid) => {
    navigate(`/admin/edit-user/${userid}`);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.delete(`/api/admin/delete-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserDetails(userDetails.filter((user) => user._id !== userId));
        console.log("user delete successfully");
      } else {
        console.log("User not deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateUser = () => {
    navigate("/admin/create-user");
  };

  const filterdUser = userDetails.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div>
        <Navbar />
        <div>
          <div className="center-wrapper">
            <div className="user-list-container">
              <div className="user-list-header">
                <button onClick={handleCreateUser} className="create-user-btn">
                  Create User
                </button>
                <input
                  type="text"
                  placeholder="Search user..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQurery(e.target.value)}
                />
              </div>
              <p className="user-list">User List</p>
              <table className="user-list-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th className="profile-image-column">Profile Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterdUser.map((user, i) => (
                    <tr key={user._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img src={user.profilePicture} alt={user.username} />
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="button-group">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditUser(user._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`page-number-button ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
