import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateComponent = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const auth = localStorage.getItem('user');

    useEffect(() => {
        if (!auth) {
            setShowMessage(true);
            setTimeout(() => {
                setRedirect(true);
            }, 1000); // 2 seconds delay before redirect
        }
    }, [auth]);

    if (!auth && redirect) {
        return <Navigate to="/" />;
    }

    return (
        <>
            {showMessage && (
                <div style={{ color: 'red', textAlign: 'center', margin: '20px 0' }}>
                    You need to log in to access this page.
                </div>
            )}
            {auth ? <Outlet /> : null}
        </>
    );
};

export default PrivateComponent;
