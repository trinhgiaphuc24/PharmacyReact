import { createContext, useContext, useEffect, useReducer } from "react";
import { Navigate } from "react-router-dom";
import api, { endpoints } from "../utils/axiosConfig";

// Auth Reducer
const authReducer = (current, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...current, isLoading: action.payload };
            
        case "login":
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
                localStorage.setItem('token', action.payload.token);
            }
            return { ...current, user: action.payload, isLoading: false };
            
        case "logout":
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { ...current, user: null, isLoading: false };
            
        case "update_user":
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

    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedToken = localStorage.getItem('token');
                
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
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        initAuth();
    }, []);

    const login = (userData) => {
        dispatch({
            type: 'login',
            payload: userData
        });
    };

    const logout = () => {
        dispatch({
            type: 'logout'
        });
    };

    const updateUser = (userData) => {
        dispatch({
            type: 'update_user',
            payload: userData
        });
    };

    const isAuthenticated = () => {
        return state.user && state.user.token;
    };

    const isStaff = () => {
        return state.user && (
            state.user.userRole === 'staff'
        );
    };

    const isCustomer = () => {
        return state.user && (
            state.user.userRole === 'customer'
        );
    };

    const getAccessToken = () => {
        return state.user?.token || localStorage.getItem('token');

    };

    const defaultUserLogin = async (credentials) => {
        try {
            const loginData = new URLSearchParams({
                client_id: "d0oHvHunyv1BzSkb5XHHMXd94A2n1hZU7bp8hUsJ",
                client_secret: "Xz5P8TuRWqhCE5xsTM6nZwlzDpEe0o0rv6LjkiZrdrBTIk9yvX3ExiiC1ch5uefnT3mFwMREoBVSRMPpitda72jzEfh61CbwqhX05v5cQJcay4fxewCBvZ0916v6ylSh",
                grant_type: "password",
                username: credentials.username,
                password: credentials.password,
            });
            
            const tokenResponse = await api.post(endpoints.login, loginData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            
            const accessToken = tokenResponse.data.access_token;

            const userResponse = await api.get(endpoints['current-user'], {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            
            const userData = userResponse.data;
            
            const userWithToken = {
                ...userData,
                token: accessToken,
            };
            
            localStorage.setItem('token', accessToken);
            
            login(userWithToken);
            return userWithToken;
            
        } catch (error) {
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

    const getCurrentUser = async () => {
        try {
            const token = getAccessToken() ;
            if (!token) return null;

            const response = await api.get(endpoints['current-user'], {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                }
            });
            
            const userData = response.data;
            const userWithToken = { ...userData, token};
            updateUser(userWithToken);
            return userWithToken;
            
        } catch (error) {
            logout();
            return null;
        }
    };

    const contextValue = {
        user: state.user,
        isLoading: state.isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isStaff,
        isCustomer,
        getAccessToken,
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
    return context;
}

const ProtectedStaffRoute = ({ children }) => {
    const { isAuthenticated, isStaff } = useAuth();
    
    if (!isAuthenticated() || !isStaff()) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export { AuthProvider, useAuth, ProtectedStaffRoute };
