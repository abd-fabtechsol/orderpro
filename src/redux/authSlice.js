import { createSlice } from "@reduxjs/toolkit"

const initialState = {
	token: null,
	refreshToken: null,
	role: null,
	isLoggedIn: false,
	user: null,
	notification:null
}

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, { payload }) => {
			state.token = payload.token
			state.refreshToken = payload.refreshToken
			state.user=payload.userData
			state.notification=payload.userData?.notifications || null
			state.isLoggedIn = true
		},
		setAuthData: (state, { payload }) => {
			// Store auth data without setting isLoggedIn to true
			// Used when user needs to complete profile first
			state.token = payload.token
			state.refreshToken = payload.refreshToken
			state.user = payload.userData
			state.notification = payload.userData?.notifications || null
			// isLoggedIn remains false
		},
		logout: state => {
			state.token = null
			state.refreshToken = null
			state.role = null
			state.isLoggedIn = false
			state.user = null
		},

		setUser: (state, { payload }) => {
			state.user = payload
			// Set isLoggedIn to true when user data is updated (profile completed)
			state.isLoggedIn = true
		},
		setNotification:(state,{payload})=>{
			console.log("sasdasdasd",payload)
			state.notification=payload
		},
		clearToken: state => {
			state.token = null
		}
	}
})

export const { login, logout, setAuthData, setUser, setNotification, clearToken } = authSlice.actions

export default authSlice.reducer
