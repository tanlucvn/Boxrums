import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import AnimationWrapper from '@/common/page-animation';

export default function VerifyEmail() {
    const { lang } = useContext(StoreContext);
    document.title = `Boxrum | ${Strings.verifyEmail[lang]}`;

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const userVerifications = async () => {
        if (loading) return;

        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post(`${BACKEND}/auth/verify-email`, { token: token }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setLoading(false);
            const data = response.data;

            if (data.message === 'Invalid token') {
                setErrors({ general: "Invalid Token" });
            } else if (data.userId) {
                setSuccess(true);
            } else {
                throw new Error(data.error?.message || 'Error');
            }
        } catch (err) {
            setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
        }
    };

    useEffect(() => {
        userVerifications();
    }, []);

    const renderSuccessContent = () => (
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <p className='text-purple text-2xl font-bold mb-2'>{Strings.verifiedSuccess[lang]}</p>
            <p className='mb-2'>{Strings.verifySuccessLine1[lang]}</p>

            <button onClick={() => navigate('/login')} className="btn-dark mt-14">
                {Strings.login[lang]}
            </button>
        </div>
    );

    const renderErrorContent = () => (
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <p className='text-red text-2xl font-bold'>{Strings.invalidToken[lang]}</p>
            <p className='text-red mb-2'>{Strings.dontTryThisAnymore[lang]}</p>
            <p className='mb-2'>{Strings.verifyErrLine1[lang]}</p>
            <p>{Strings.verifyErrLine2[lang]}</p>
        </div>
    );

    return (
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center">
                <div className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                        {Strings.verifyEmail[lang]}
                    </h1>

                    {success ? renderSuccessContent() : renderErrorContent()}

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>{Strings.or[lang]}</p>
                        <hr className="w-1/2 border-black" />
                    </div>
                    <button onClick={() => navigate('/')} className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                        {Strings.goToHomePage[lang]}
                    </button>

                    <p className="mt-6 text-dark-grey text-xl text-center">
                        {Strings.dontHaveAnAccount[lang]}
                        <Link to="/register" className="underline text-black text-xl ml-1">{Strings.joinUsNow[lang]}</Link>
                    </p>
                </div>
            </section>
        </AnimationWrapper>
    );
}
