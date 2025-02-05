import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast';
import axios from 'axios';
import io from 'socket.io-client'
import { useChatStore } from './useChatStore';

const SERVER = import.meta.env.VITE_SERVER;

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/check');
			set({ authUser: res.data })
			get().connectSocket();
		} catch (error) {
			console.log('Error in checkAuth: ', error.message);
			set({ authUser: null })
		} finally {
			set({ isCheckingAuth: false })
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const res = await axiosInstance.post('/auth/signup', data);
			set({ authUser: res.data })
			toast.success('Account created successfully')

			get().connectSocket();
		} catch (error) {
			toast.error(error.message)
			set({ isSigningUp: false })
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post('/auth/login', data);
			set({ authUser: res.data })
			toast.success('Logged in successfully')

			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isLoggingIn: false });
		}
	},


	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout');
			set({ authUser: null })
			toast.success('Logged out successfully')
			useChatStore.getState().resetState();
			get().disconnectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
			const res = await axiosInstance.put('/auth/update-profile', data);
			set({ authUser: res.data.updatedUser })
			toast.success('Profile updated successfully')
		} catch (error) {
			console.log(error.message);
			toast.error(error.response.data.message);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},

	connectSocket: async () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;

		const socket = io(SERVER, {
			query:{
				userId: authUser._id
			}
		});
		socket.connect();

		set({ socket: socket})

		socket.on('getOnlineUser', (userIds) => {
      set({ onlineUsers: userIds })
    })
	},

	disconnectSocket: async (socket) => {
		if (get().socket?.connected) get().socket.disconnect();
	}
}))