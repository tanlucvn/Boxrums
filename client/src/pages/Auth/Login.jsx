import { useContext, useEffect, useState } from "react"
import AnimationWrapper from "@/common/page-animation"
import { LabelInputBox, InputBox } from "@/components/Form/Input"
import { LogEmailNotVerified } from "@/components/ModalPopup"
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import validator from 'validator';

import { BACKEND, Strings } from '@/support/Constants';
import { useForm } from "@/hooks/useForm"
import { StoreContext } from "@/stores/Store"

const Login = ({ type }) => {
    document.title = 'Boxrum | Login'

    const { login, lang } = useContext(StoreContext)
    const navigate = useNavigate();

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nextPage, setNextPage] = useState(0)
    const [notVerified, setNotVerified] = useState({ email: "", state: false })

    const loginUser = async () => {
        if (loading) return;
        if (errors.username) return;

        setErrors({});

        if (validator.isEmpty(values.password)) {
            return setErrors({ password: Strings.emptyPassword[lang] });
        } else if (!validator.isLength(values.password, { min: 6 })) {
            return setErrors({ password: Strings.passwordMinLength[lang] });
        } else if (!validator.isLength(values.password, { max: 50 })) {
            return setErrors({ password: Strings.passwordMaxLength[lang] });
        }

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            setLoading(false);
            const data = await response.json();
            if (data.ban) {
                // localStorage.setItem('ban', data.ban.userId)
                navigate('/banned')
                return
            }
            if (data.accessToken) {
                login(data);
                setSuccess(true);
                setTimeout(() => navigate('/'), 10);
            } else {
                throw new Error(data.error?.message || 'Error');
            }
        } catch (err) {
            if (err.message === 'Email not verified') {
                try {
                    const response = await fetch(`${BACKEND}/auth/resend-verify-email`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(values)
                    });
                    const data = await response.json();

                    setNotVerified({ email: data.email, state: true })
                } catch (err) {
                    setErrors({ general: err.message })
                }
            }
            setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
        }
    };

    const { onChange, onSubmit, values } = useForm(loginUser, {
        username: '',
        password: ''
    })

    if (errors.general === "Failed to fetch") {
        toast.error(Strings.failedToFetch[lang]);
    } else if (errors.general === "User not registered") {
        setNextPage(nextPage => nextPage - 1);
        setErrors({ username: Strings.usernameNotRegistered[lang] })
    } else if (errors.general === "Username or password not valid") {
        setErrors({ password: Strings.loginNotValid[lang] })
    }
    /* else if (errors.general === "Email not verified") {
        setNextPage(nextPage => nextPage - 1);
        setErrors({ username: Strings.emailNotVerified[lang] })
    } */

    const handleSetNextPage = () => {
        if (nextPage === 1) return

        if (validator.isEmpty(values.username)) {
            return setErrors({ username: Strings.emptyUsername[lang] });
        } else if (!validator.isAlphanumeric(values.username)) {
            return setErrors({ username: Strings.usernameNotValid[lang] });
        } else if (!validator.isLength(values.username, { min: 3 })) {
            return setErrors({ username: Strings.usernameMinLength[lang] });
        } else if (!validator.isLength(values.username, { max: 21 })) {
            return setErrors({ username: Strings.usernameMaxLength[lang] });
        }

        setNextPage(prevPage => prevPage + 1);
        setErrors({ username: null });
        return
    }

    const handleSetPrevPage = () => {
        if (nextPage === 0) return
        if (nextPage === 1) {
            setNextPage(nextPage => nextPage - 1);
            return
        }
    }

    const handleDiscordAuth = () => {
        window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=1193082815420575745&redirect_uri=http://localhost:3000/auth/discord&response_type=code&scope=email+identify';
    };

    const handleFacebookAuth = () => {
        window.location.href = 'https://www.facebook.com/v18.0/dialog/oauth?client_id=1044853073435724&redirect_uri=http://localhost:3000/auth/facebook&scope=email';
    };

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                setSuccess(false);
            }, 1000);
        }
    }, [success]);

    const renderPage0Content = () => (
        <>
            <LabelInputBox text={Strings.enterUsername[lang]} errors={errors.username} />
            <InputBox icon="fi-rr-user" className={`${errors.username ? 'error' : ''}`} type="text" name='username' id='username' placeholder={Strings.placeholderUsername[lang]} value={values.username} onChange={onChange} autoFocus={true} />

            <button className="btn-dark center mt-14" onClick={handleSetNextPage}>
                {Strings.next[lang]}
            </button>
        </>
    )

    const renderPage1Content = () => (
        <>
            <LabelInputBox text={Strings.enterPassword[lang]} errors={errors.password} />
            <InputBox icon="fi-rr-lock" className={`${errors.password ? 'error' : ''}`} type="password" name='password' id='password' placeholder={Strings.placeholderPassword[lang]} value={values.password} onChange={onChange} autoFocus={true} />

            <div className="back-section flex text-dark-grey cursor-pointer hover:opacity-80" onClick={handleSetPrevPage}>
                <i className="fi fi-rr-arrow-small-left mr-3" />
                {Strings.authFormBack[lang]}
            </div>
            <button className="btn-dark center mt-14" type='submit'>
                {Strings.login[lang]}
            </button>
        </>
    )

    return (
        <>
            {notVerified.state === true && <LogEmailNotVerified open={true} data={{ username: values.username, email: notVerified.email }} />}
            <AnimationWrapper keyValue={type}>
                <Toaster />
                <section className="h-cover flex items-center justify-center">
                    <form id="formElement" className="w-[80%] max-w-[400px]" onSubmit={onSubmit}>
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                            {Strings.loginTitle[lang]}
                        </h1>

                        {nextPage === 0 && renderPage0Content()}
                        {nextPage === 1 && renderPage1Content()}

                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>{Strings.or[lang]}</p>
                            <hr className="w-1/2 border-black" />
                        </div>
                        <button onClick={handleDiscordAuth} className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                            <i className="fi fi-brands-discord" />
                            {Strings.continueWithDiscord[lang]}
                        </button>
                        <button onClick={handleFacebookAuth} className="btn-dark flex items-center justify-center gap-4 w-[90%] center mt-3">
                            <i className="fi fi-brands-facebook" />
                            {Strings.continueWithFacebook[lang]}
                        </button>

                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don't have and account ?
                            <Link to="/register" className="underline text-black text-xl ml-1">Join us Now</Link>
                        </p>
                    </form>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default Login