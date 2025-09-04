import { createContext, useContext, useReducer, useEffect } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";
import api, { endpoints } from "../utils/axiosConfig";


const authReducer = (current, action) => {
    switch (action.type) {
        case "login":
            if (action.payload) {
                localStorage.setItem('user', JSON.stringify(action.payload));
                localStorage.setItem('token', action.payload.token);
            }
            return { ...current, user: action.payload };
            
        case "logout":
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { ...current, user: null };
            
        default:
            return current;
    }
};

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, {
        user: null
    });

    // Load user from localStorage on initial mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (storedUser && storedToken) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData && userData.token) {
                    dispatch({
                        type: 'login',
                        payload: userData
                    });
                }
            } catch (error) {
                // If parsing fails, clear localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
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
            type: 'login', // Reuse login để update user + localStorage
            payload: { ...state.user, ...userData }
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

    const contextValue = {
        user: state.user,
        login,
        logout,
        updateUser,
        isAuthenticated,
        isStaff,
        isCustomer,
        getAccessToken,
        defaultUserLogin,
        defaultUserRegister
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
    const { isAuthenticated, isStaff, user } = useAuth();
    
    const token = localStorage.getItem('token');
    if (token && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner message="Đang kiểm tra quyền truy cập..." />
            </div>
        );
    }
    
    if (!isAuthenticated() || !isStaff()) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export { AuthProvider, useAuth, ProtectedStaffRoute };
