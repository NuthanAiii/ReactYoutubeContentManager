import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'login',
    initialState:{
        isLogedin:false,
        userDetails:null
    },
    reducers:{
        login:(state,action)=>{
            state.isLogedin = true;
            state.userDetails = action.payload;
        },
        logOut:(state)=>{
            state.isLogedin = false;
            state.userDetails = null;
        }

    }

})

export const { login, logOut} = authSlice.actions;
export default authSlice.reducer;