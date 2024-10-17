import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isLoggin : localStorage.getItem('adminToken') ? true : false,
};


const adminAuthSlice = createSlice({
    name:'adminAuth',
    initialState,
    reducers : {
        loginSuccess : (state, action ) => {   
            localStorage.setItem('adminToken', action.payload.token);
            state.isLoggin = true;
        },
        logout : (state) => {
            localStorage.removeItem("adminToken");
            state.isLoggin = false;
            
            
        },
    },
});


export const {loginSuccess, logout} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;

