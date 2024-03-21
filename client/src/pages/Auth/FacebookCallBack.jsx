import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '@/stores/Store';
import { BACKEND } from '@/support/Constants';

const FacebookCallback = () => {
    const { login } = useContext(StoreContext)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');

        if (code) {
            fetch(`${BACKEND}/auth/facebook?code=${code}`, {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.accessToken) {
                        login(data);
                        navigate('/');
                    } else {
                        /* navigate('/login'); */
                    }
                })
                .catch(error => {
                    console.error('Error during authentication:', error);
                    navigate('/error');
                });
        } else {
            console.error('No authorization code found');
            navigate('/error');
        }
    }, [location, navigate, login]);

    return (
        <div>
            <p>Processing Facebook authentication...</p>
        </div>
    );
};

export default FacebookCallback;
