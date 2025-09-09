import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('client'); // 'client' or 'service_provider'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // פיקטיבי - נתונים לדוגמה
  const demoUsers = {
    client: {
      email: 'client@demo.com',
      password: '123456',
      name: 'לקוח דמו',
      type: 'client'
    },
    serviceProvider: {
      email: 'provider@demo.com', 
      password: '123456',
      name: 'ספק שירות דמו',
      type: 'service_provider',
      profession: 'טכנאי מחשבים',
      rating: 4.8
    }
  };

  useEffect(() => {
    // בדיקה אם יש משתמש שמור ב-localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, selectedUserType) => {
    setIsLoading(true);
    try {
      // סימולציה של בקשה לשרת
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // בשלב הפרוטוטייפ - אפשר כל פרטי התחברות
      if (email && password) {
        const newUser = {
          email: email,
          name: email.split('@')[0], // השתמש בחלק הראשון של האימייל כשם
          type: selectedUserType,
          profession: selectedUserType === 'service_provider' ? 'נותן שירות' : null,
          rating: selectedUserType === 'service_provider' ? 4.8 : null
        };
        
        setUser(newUser);
        setUserType(selectedUserType);
        setIsAuthenticated(true);
        
        // שמירה ב-localStorage
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('userType', selectedUserType);
        
        return { success: true };
      } else {
        return { success: false, error: 'נדרש להזין אימייל וסיסמה' };
      }
    } catch (error) {
      return { success: false, error: 'שגיאה בהתחברות' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData, selectedUserType) => {
    setIsLoading(true);
    try {
      // סימולציה של בקשה לשרת
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser = {
        ...userData,
        type: selectedUserType,
        id: Date.now(), // ID פיקטיבי
        rating: selectedUserType === 'service_provider' ? 4.8 : null
      };
      
      setUser(newUser);
      setUserType(selectedUserType);
      setIsAuthenticated(true);
      
      // שמירה ב-localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userType', selectedUserType);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'שגיאה בהרשמה' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserType('client');
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  const value = {
    user,
    userType,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    demoUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 