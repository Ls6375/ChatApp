import { create } from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUserLoading: false,
	isMessageLoading: false,

	getUsers: async () => {
		try {
			const res = await axiosInstance.get('/messages/users')
			set({ users: res.data })
		} catch (error) {
			console.error(error.message);
			toast(error.response.data.message);
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true });
		try {
			const res = await axiosInstance.get(`/messages/${userId}`);
			console.log(res.data);
			set({ messages: res.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isMessagesLoading: false });
		}
	},

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get()
		try {
			const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
			set({ messages: [...messages, res.data] })
		} catch (error) {
			console.error(error.message);
			toast.error(error.response.data.message)
		}
	},

	subscribeToMessages: () => {
		const { selectedUser } = get();
		console.log('selectedUser', selectedUser);

		if (!selectedUser) return;
		console.log('subscribing to messages');

		const socket = useAuthStore.getState().socket;

		socket.on('newMessage', (message) => {
			if (message.senderId !== selectedUser._id) return;	
			console.log('received new message', message);
			set({ messages: [...get().messages, message] })
		})
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		socket.off('newMessage')
	},

	// Optimize the data selection
	setSelectedUser: (selectedUser) => {
		console.log('setting selected user', selectedUser);
		set({ selectedUser })
		console.log('setting selected user', get());
	},

	resetState: () => {
		set({
			messages: [],
			users: [],
			selectedUser: null,
			isUserLoading: false,
			isMessageLoading: false,
		});
	}
}))