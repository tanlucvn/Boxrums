import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '@/stores/Store';
import { BACKEND, Strings } from '@/support/Constants';
import AnimationWrapper from '@/common/page-animation';

const DiscordCallbackComponent = () => {
    const { login, lang } = useContext(StoreContext)
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');

        if (code) {
            fetch(`${BACKEND}/auth/discord?code=${code}`, {
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    if (data.accessToken) {
                        login(data);
                        navigate('/');
                    } else {
                        navigate('/login');
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
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center">
                <div className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                        {Strings.loginDiscord[lang]}
                    </h1>

                    <p>{Strings.redirecting[lang]}</p>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default DiscordCallbackComponent;
