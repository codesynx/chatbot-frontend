import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			set({ 
				user: response.data.user, 
				isAuthenticated: true, 
				isCheckingAuth: false 
			});
			localStorage.setItem('userLoggedIn', 'true');
		} catch (error) {
			set({ 
				user: null, 
				isAuthenticated: false, 
				isCheckingAuth: false 
			});
			localStorage.removeItem('userLoggedIn');
		}
	},

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });

		console.log("Отправляемые данные:", { email, password, name }); // 👈 Проверь в консоли

		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({ 
				user: response.data.user, 
				isAuthenticated: true, 
				isLoading: false 
			});
			localStorage.setItem('userLoggedIn', 'true');
		} catch (error) {
			console.error("Ошибка при регистрации:", error.response?.data || error); // 👈 Лог ошибки
			set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
				isCheckingAuth: false
			});
			localStorage.setItem('userLoggedIn', 'true');
			return true;
		} catch (error) {
			set({ 
				error: error.response?.data?.message || "Error logging in", 
				isLoading: false,
				isAuthenticated: false,
				isCheckingAuth: false
			});
			localStorage.removeItem('userLoggedIn');
			return false;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ 
				user: null, 
				isAuthenticated: false, 
				error: null, 
				isLoading: false,
				isCheckingAuth: false
			});
			localStorage.removeItem('userLoggedIn');
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({ 
				user: response.data.user, 
				isAuthenticated: true, 
				isLoading: false,
				isCheckingAuth: false
			});
			localStorage.setItem('userLoggedIn', 'true');
			return response.data;
		} catch (error) {
			set({ 
				error: error.response.data.message || "Error verifying email", 
				isLoading: false,
				isCheckingAuth: false
			});
			localStorage.removeItem('userLoggedIn');
			throw error;
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			console.log("Отправляем email:", email);
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));
