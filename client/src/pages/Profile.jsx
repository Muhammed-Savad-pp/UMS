
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserFailure,
   updateUserSuccess, signInFailure,
  deleteUserFailure, deleteUserStart,
  deleteUserSuccess,signOut } from '../redux/user/userSlice';


export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);

  const [image, setImage] = useState(undefined); 
  const [imagePer, setImagePer ] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  
  
  const dispatch = useDispatch();
  
  const fileRef = useRef(null);

  useEffect(() => {
    if(image){
      handleFileUpload(image)
    }
  }, [image])

  const handleFileUpload = async(image) => {
   const storage = getStorage(app);
   const fileName = new Date().getTime() + image.name;
   const storageRef = ref(storage, fileName);
   const uploadTask = uploadBytesResumable(storageRef, image);
   uploadTask.on(
    'state_changed',
     (snapshot) => {
      const progress = (snapshot.bytesTransferred / 
        snapshot.totalBytes ) * 100;
        setImagePer(Math.round(progress));
        
     } ,
    
    (error) => {
      setImageError(true)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL) => 
        setFormData({...formData, profilePicture:downloadURL})
      );
    }
  );
    
  };
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubimt = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/update/${currentUser._id }`, {
        method:'POST',
        headers:{
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      
      if(data.success === false){
        dispatch(signInFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  } 

  const handleDeleteAcc = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/delete/${currentUser._id}`, {
        method:"DELETE",
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
      
    }
  }
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center 
      my-7'>Profile</h1>

      <form onSubmit={handleSubimt} className='flex flex-col gap-4' action="">
        <input type="file" ref={fileRef} hidden accept='image/*'
        onChange={(e) => setImage(e.target.files[0])} />
        <img className='h-24 w-24 self-center cursor-pointer
         rounded-full object-cover mt-5'
         src={formData.profilePicture || currentUser.profilePicture}
          onClick={() => fileRef.current.click()}
          alt="" 
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-600'>Error uploading image</span> ) : 
            imagePer > 0 && imagePer < 100 ? (
              <span className='text-slate-500'>{`Uploading: ${imagePer} %`}</span>
            ) : imagePer === 100 ? (
              <span className='text-green-700'> Image uploaded successfully</span>
            ) : (
              ""
            )
          }
        </p>

          <input defaultValue={currentUser.username}  onChange={handleChange}  type="text" id='username' placeholder='Username'
            className='bg-slate-100 rounded-lg p-3'/>

  
          <input defaultValue={currentUser.email} onChange={handleChange} type="email" id='email' placeholder='Email'
            className='bg-slate-100 rounded-lg p-3'  />

          <input type="password" id='password' onChange={handleChange} placeholder='Password'
            className='bg-slate-100 rounded-lg p-3'  />

          <button className='bg-slate-700 text-white p-3 rounded-lg 
          uppercase hover:opacity-95 disabled:opacity-80'>{
            loading ? "Loading..." : "Update" 
          }</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteAcc} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out </span>
      </div>
      <p className='text-red-700 mt-5'>{error && "Something went wrong"}</p>
      <p className='text-green-700 mt-5'>{updateSuccess && "User is updated Successfully"}</p>

    </div>
  )
}
