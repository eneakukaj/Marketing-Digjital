import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me", {
          withCredentials: true,
        });
        console.log("Response nga /me:", res.data);
        setUser(res.data);
      } catch (err) {
        console.log("Error ne fetchUser:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

const login = (userData, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (err) {}
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  
  const hasRole = (roleName) => {
    return user?.userroles?.some(
      (ur) => ur.role?.normalized_name === roleName
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
