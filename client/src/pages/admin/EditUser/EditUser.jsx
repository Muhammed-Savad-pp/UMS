import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./EditUser.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../../../firebase";

export default function EditUser() {
  const { userId } = useParams();
  const [profileImage, setProfileImage] = useState(undefined);
  const [imagePer, setImagePer] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    userName: '',
    email: '',
    profilePicture: ''
  });

  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (profileImage) {
      handleFileUpload(profileImage);
    }
  }, [profileImage]);

  const handleFileUpload = async (profileImage) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + profileImage.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, profileImage);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePer(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURl) =>
            setUserData({ ...userData, profilePicture: downloadURl })
        );
      }
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('adminToken');

      try {
        const response = await axios.get(`/api/admin/edit-user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          navigate('/admin/dashboard');
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.id]: e.target.value
    });
  };

  const validate = () => {
    const errors = {};
    if (!userData.userName.trim()) {
      errors.userName = 'Name is required';
    }
    if (!userData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Email address is invalid';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      
    

    setLoading(true);

    const token = localStorage.getItem('adminToken');
    try {
      const response = await axios.put(`/api/admin/edit-user/${userId}`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.data.success) {
        navigate('/admin/dashboard');
      } else {
        console.log('Error updating user.');
      }
    } catch (error) {
      console.log(error);
    }
  }
  };

  const handleGoBack = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div> {/* Added class for background */}
      <Navbar />
      <div  className="background">
      <div className="edit-user-container">
        <h2>Edit User Information</h2>
        <form onSubmit={handleSubmit} className="edit-user-form">
          <div className="image-container">
            <input type="file" ref={inputRef} onChange={(e) => setProfileImage(e.target.files[0])} hidden />
            <img
              className="profile-image"
              src={userData.profilePicture}
              alt="User Profile"
              onClick={() => inputRef.current.click()}
            />
          </div>

          <div className="form-group">
            <label className="text-black" htmlFor="name">Name:</label>
            <input defaultValue={userData.userName} type="text" id="userName" name="userName" placeholder="Enter your name" onChange={handleInputChange} />
          </div>
          {errors.userName && <p className='error'>{errors.userName}</p>}

          <div className="form-group">
            <label className="text-black" htmlFor="email">Email:</label>
            <input defaultValue={userData.email} type="email" id="email" name="email" placeholder="Enter your email" onChange={handleInputChange} />
          </div>
          {errors.email && <p className='error'>{errors.email}</p>}
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
        <div className="go-back-container">
        <button onClick={handleGoBack} className="go-back-btn text-white">Go Back</button>
      </div>
      </div>
     
      </div>
    </div>
  );
}
