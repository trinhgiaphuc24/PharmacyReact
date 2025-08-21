import { createContext, useContext, useEffect, useReducer } from "react";
import { Navigate } from "react-router-dom";
import api, { endpoints } from "../utils/axiosConfig";

// Auth Reducer
const authReducer = (current, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...current, isLoading: action.payload };
            
        case "login":
            // Lưu token vào localStorage khi login
            if (action.payload?.token) {
                localStorage.setItem('token', action.payload.token);
            }
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
            return { ...current, user: action.payload, isLoading: false };
            
        case "logout":
            // Xóa token khỏi localStorage khi logout
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            // Also remove compatibility tokens
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            return { ...current, user: null, isLoading: false };
            
        case "update_user":
            // Cập nhật thông tin user
            const updatedUser = { ...current.user, ...action.payload };
            if (updatedUser.token) {
                localStorage.setItem('token', updatedUser.token);
            }
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return { ...current, user: updatedUser };
            
        default:
            return current;
    }
};

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isLoading: true
    });

    // Load user từ localStorage khi app khởi động
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token') || localStorage.getItem('accessToken');
                
                if (storedUser && storedToken) {
                    const userData = JSON.parse(storedUser);
                    dispatch({
                        type: "login",
                        payload: { ...userData, token: storedToken }
                    });
                } else {
                    dispatch({ type: "SET_LOADING", payload: false });
                }
            } catch (error) {
                console.error('Error loading user from storage:', error);
                // Clear corrupted data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('accessToken');
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        initAuth();
    }, []);

    // Login function
    const login = (userData) => {
        dispatch({
            type: 'login',
            payload: userData
        });
    };

    // Logout function
    const logout = () => {
        dispatch({
            type: 'logout'
        });
    };

    // Update user function
    const updateUser = (userData) => {
        dispatch({
            type: 'update_user',
            payload: userData
        });
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return state.user && state.user.token;
    };

    // Check if user is staff
    const isStaff = () => {
        return state.user && (
            state.user.role === 'staff' || 
            state.user.userRole === 'staff' || 
            state.user.is_staff === true
        );
    };

    // Check if user is admin
    const isAdmin = () => {
        return state.user && (
            state.user.role === 'admin' || 
            state.user.userRole === 'admin'
        );
    };

    // Check if user is customer
    const isCustomer = () => {
        return state.user && (
            state.user.role === 'customer' || 
            state.user.userRole === 'customer' || 
            (!state.user.role && !state.user.userRole)
        );
    };

    // Get access token
    const getAccessToken = () => {
        return state.user?.token || 
               state.user?.access_token || 
               localStorage.getItem('token') || 
               localStorage.getItem('accessToken');
    };

    // OAuth2 login function for React web app
    const defaultUserLogin = async (credentials) => {
        try {
            const loginData = new URLSearchParams({
                client_id: "d0oHvHunyv1BzSkb5XHHMXd94A2n1hZU7bp8hUsJ",
                client_secret: "Xz5P8TuRWqhCE5xsTM6nZwlzDpEe0o0rv6LjkiZrdrBTIk9yvX3ExiiC1ch5uefnT3mFwMREoBVSRMPpitda72jzEfh61CbwqhX05v5cQJcay4fxewCBvZ0916v6ylSh",
                grant_type: "password",
                username: credentials.username,
                password: credentials.password,
            });
            
            // Step 1: Get access token using axios
            const tokenResponse = await api.post(endpoints.login, loginData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            
            const accessToken = tokenResponse.data.access_token;
            if (!accessToken) {
                throw new Error('Không nhận được access token');
            }

            // Step 2: Get user data using axios with Bearer token
            const userResponse = await api.get(endpoints['current-user'], {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            
            const userData = userResponse.data;
            
            // Add token to userData for web app
            const userWithToken = {
                ...userData,
                token: accessToken,
                access_token: accessToken
            };
            
            // Store tokens for web app persistence
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('token', accessToken);
            
            login(userWithToken);
            return userWithToken;
            
        } catch (error) {
            console.error('OAuth2 Login error:', error);
            
            // Handle axios error response
            if (error.response) {
                if (error.response.status === 400 || error.response.status === 401) {
                    throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
                } else {
                    throw new Error('Lỗi server. Vui lòng thử lại sau.');
                }
            }
            throw error;
        }
    };

    const defaultUserRegister = async (userData) => {
        try {
            // Use FormData for Django compatibility
            const formData = new FormData();
            Object.keys(userData).forEach(key => {
                if (userData[key]) {
                    formData.append(key, userData[key]);
                }
            });

            const response = await api.post(endpoints.register, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            return response.data;
            
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                const errorMessage = errorData.detail || 
                                   errorData.message || 
                                   Object.values(errorData).flat().join(', ') ||
                                   'Đăng ký thất bại';
                throw new Error(errorMessage);
            }
            throw error;
        }
    };

    // Get current user from server using axios
    const getCurrentUser = async () => {
        try {
            const token = getAccessToken() || localStorage.getItem('accessToken');
            if (!token) return null;

            const response = await api.get(endpoints['current-user'], {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                }
            });
            
            const userData = response.data;
            const userWithToken = { ...userData, token, access_token: token };
            updateUser(userWithToken);
            return userWithToken;
            
        } catch (error) {
            console.error('Get current user error:', error);
            // Token might be invalid, logout
            logout();
            return null;
        }
    };

    const contextValue = {
        // State
        user: state.user,
        isLoading: state.isLoading,
        
        // Auth functions
        login,
        logout,
        updateUser,
        
        // Check functions
        isAuthenticated,
        isStaff,
        isAdmin,
        isCustomer,
        getAccessToken,
        
        // API functions
        defaultUserLogin,
        defaultUserRegister,
        getCurrentUser
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Protected Route HOCs
const ProtectedStaffRoute = ({ children }) => {
    const { isAuthenticated, isStaff } = useAuth();
    
    if (!isAuthenticated() || !isStaff()) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export { AuthProvider, useAuth, ProtectedStaffRoute };
