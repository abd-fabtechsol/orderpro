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
		logout: state => {
			state.token = null
			state.refreshToken = null
			state.role = null
			state.isLoggedIn = false
			state.user = null
		},

		setUser: (state, { payload }) => {
			state.user = payload
		},
		setNotification:(state,{payload})=>{
			console.log("sasdasdasd",payload)
			state.notification=payload
		}
	}
})

export const { login, logout,setUser ,setNotification} = authSlice.actions

export default authSlice.reducer
