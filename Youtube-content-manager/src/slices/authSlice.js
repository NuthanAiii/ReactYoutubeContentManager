import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as apiCallService from '../services/apiCallSerive';

// Async thunk for login
export const loginAsync = createAsyncThunk(
  'login/loginAsync',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      const res = await apiCallService.postData('login', params);
      // normalize token property name
      const token = res?.access_token || res?.acess_token || res?.token || null;
      if (!token) {
        return rejectWithValue('No access token returned');
      }
      return { username, token };
    } catch (err) {
      const message = err?.response?.data?.detail || err.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
    name: 'login',
    initialState:{
        isLogedin:false,
        userDetails:null,
        loading:false,
        error:null,
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

    },
    extraReducers: (builder) => {
      builder
        .addCase(loginAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
          state.loading = false;
          state.isLogedin = true;
          state.userDetails = action.payload;
        })
        .addCase(loginAsync.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        });
    }

})

export const { login, logOut} = authSlice.actions;
export default authSlice.reducer;