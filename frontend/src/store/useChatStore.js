import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set, get) =>({
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
			console.error(error.message);
			toast(error.response.data.message);
		}
	},

	getMessages: async (userId)=>{
		set({ isMessagesLoading: true });
    try {
			console.log('requesting messages');
      const res = await axiosInstance.get(`/messages/${userId}`);
			console.log('requested messages');
			
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
	},

	sendMessage: async (messageData)=>{
		const {selectedUser, messages} = get()
		try {
			const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
			set({messages: [...messages, res.data] })
		} catch (error) {
			console.error(error.message);
			toast.error(error.response.data.message)
		}
	},

	// Optimize the data selection
	setSelectedUser: (selectedUser) => set({selectedUser})
}))