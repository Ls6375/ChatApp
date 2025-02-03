import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set) =>({
	messages: [],
	users: [],
	selectedUser: null, 
	isUserLoading: false,
	isMessageLoading: false,

	getUsers: async ()=>{
		try {
			const res = await axiosInstance.get('/messages/users')
			set({ users: res.data })
		} catch (error) {
			
		}
	},

	getMessages: async ()=>{

	},

	// Optimize the data selection
	setSelectedUser: (selectedUser) => set({selectedUser})
}))