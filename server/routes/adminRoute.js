import express from 'express';
import adminAuth from '../utils/adminAuth.js'


import {adminSignin, getUserDetails, getUserEdit, updateUser, deleteUser, createuser} from '../controllers/adminControlleres.js';
const router = express.Router()

router.post('/signin', adminSignin);
router.get('/user-details',adminAuth,getUserDetails );
router.get('/edit-user/:userId',adminAuth, getUserEdit);
router.put('/edit-user/:userId', adminAuth,updateUser);
router.delete('/delete-user/:userId', adminAuth,deleteUser);
router.post('/create-user', adminAuth,createuser)


export default router