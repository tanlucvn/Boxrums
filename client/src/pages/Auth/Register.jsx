import { useContext, useState } from "react"
import AnimationWrapper from "@/common/page-animation"
import { LabelInputBox, InputBox } from "@/components/Form/Input"
import { RegEmailVerifications } from "@/components/ModalPopup"
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import validator from 'validator';

import { BACKEND, CLIENT, Strings } from '@/support/Constants';
import { useForm } from "@/hooks/useForm"
import { StoreContext } from "@/stores/Store"

const Register = ({ type }) => {
    document.title = 'Boxrum | Register'

    const { lang } = useContext(StoreContext)
    const [user, setUser] = useState()
    const navigate = useNavigate();

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nextPage, setNextPage] = useState(0)

    const registerUser = async () => {
        if (loading) return;
        if (errors.email || errors.username) return;

        setErrors({});

        if (validator.isEmpty(values.password)) {
            return setErrors({ password: Strings.emptyPassword[lang] });
        } else if (!validator.isLength(values.password, { min: 6 })) {
            return setErrors({ password: Strings.passwordMinLength[lang] });
        } else if (!validator.isLength(values.password, { max: 50 })) {
            return setErrors({ password: Strings.passwordMaxLength[lang] });
        }

        if (validator.isEmpty(values.repassword)) {
            return setErrors({ repassword: Strings.emptyRePassword[lang] });
        } else if (!validator.isLength(values.repassword, { min: 6 })) {
            return setErrors({ repassword: Strings.passwordMinLength[lang] });
        } else if (!validator.isLength(values.repassword, { max: 50 })) {
            return setErrors({ repassword: Strings.passwordMinLength[lang] });
        }

        if (!validator.equals(values.password, values.repassword)) {
            return setErrors({ repassword: Strings.passwordNotMatch[lang] });
        }

        setLoading(true);
        try {
            // REMOVE REPASSWORD BEFORE POSTING TO SERVER
            const { repassword, ...filteredValues } = values;

            const response = await fetch(`${BACKEND}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filteredValues)
            });

            setLoading(false);
            const data = await response.json();

            if (data.accessToken) {
                setSuccess(true);
                setUser(data)
            } else {
                throw new Error(data.error?.message || 'Error');
            }
        } catch (err) {
            setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
        }
    };

    const { onChange, onSubmit, values } = useForm(registerUser, {
        email: '',
        username: '',
        password: '',
        repassword: ''
    })

    if (errors.general === "Failed to fetch") {
        toast.error(Strings.failedToFetch[lang])
    } else if (errors.general === "E-mail is already been registered") {
        setErrors({ email: Strings.emailRegistered[lang] })
        setNextPage(0);
    } else if (errors.general === "Username is already been registered") {
        setNextPage(nextPage => nextPage - 1);
        setErrors({ username: Strings.usernameRegistered[lang] })
    }

    const handleSetNextPage = () => {
        if (nextPage === 1) return

        if (validator.isEmpty(values.email)) {
            return setErrors({ email: Strings.emptyEmail[lang] });
        } else if (!validator.isEmail(values.email)) {
            return setErrors({ email: Strings.emailNotValid[lang] });
        }

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
        window.location.href = `https://discord.com/api/oauth2/authorize?client_id=1193082815420575745&redirect_uri=${CLIENT}/auth/discord&response_type=code&scope=email+identify`;
    };

    const handleFacebookAuth = () => {
        window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=1044853073435724&redirect_uri=${CLIENT}/auth/facebook&scope=email`;
    };

    const renderPage0Content = () => (
        <>
            <LabelInputBox text={Strings.enterEmail[lang]} errors={errors.email} />
            <InputBox icon="fi-rr-user" className={`${errors.email ? 'error' : ''}`} type="text" name='email' id='email' placeholder={Strings.placeholderEmail[lang]} value={values.email} onChange={onChange} autoFocus={true} />

            <LabelInputBox text={Strings.username[lang]} errors={errors.username} />
            <InputBox icon="fi-rr-user" className={`${errors.username ? 'error' : ''}`} type="text" name='username' id='username' placeholder={Strings.placeholderUsername[lang]} value={values.username} onChange={onChange} />

            <button className="btn-dark center mt-14" onClick={handleSetNextPage}>
                {Strings.next[lang]}
            </button>
        </>
    )

    const renderPage1Content = () => (
        <>
            <LabelInputBox text={Strings.password[lang]} errors={errors.password} />
            <InputBox icon="fi-rr-lock" className={`${errors.password ? 'error' : ''}`} type="password" name='password' id='password' placeholder={Strings.placeholderPassword[lang]} value={values.password} onChange={onChange} autoFocus={true} />

            <LabelInputBox text={Strings.enterRePassword[lang]} errors={errors.repassword} />
            <InputBox icon="fi-rr-lock" className={`${errors.repassword ? 'error' : ''}`} type="password" name='repassword' id='repassword' placeholder={Strings.placeholderRePassword[lang]} value={values.repassword} onChange={onChange} />

            <div className="back-section flex text-dark-grey cursor-pointer hover:opacity-80" onClick={handleSetPrevPage}>
                <i className="fi fi-rr-arrow-small-left mr-3" />
                {Strings.back[lang]}
            </div>
            <button className="btn-dark center mt-14" type='submit'>
                {Strings.register[lang]}
            </button>
        </>
    )

    return (
        <>
            {success === true && <RegEmailVerifications open={true} data={user} />}
            <AnimationWrapper keyValue={type}>
                <Toaster />
                <section className="h-cover flex items-center justify-center">
                    <form id="formElement" className="w-[80%] max-w-[400px]" onSubmit={onSubmit}>
                        <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                            {Strings.registerTitle[lang]}
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
                            Already a member ?
                            <Link to="/login" className="underline text-black text-xl ml-1">Sign in here</Link>
                        </p>
                    </form>
                </section>
            </AnimationWrapper>
        </>

    )
}

export default Register