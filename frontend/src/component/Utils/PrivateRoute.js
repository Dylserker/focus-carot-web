import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && currentUser.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;