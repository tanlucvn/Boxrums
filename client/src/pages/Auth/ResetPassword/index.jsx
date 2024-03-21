import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import { useForm } from '@/hooks/useForm';
import { InputBox, LabelInputBox } from '@/components/Form/Input';
import validator from 'validator';
import AnimationWrapper from '@/common/page-animation';

export default function ResetPassword() {
    const { lang } = useContext(StoreContext)
    document.title = `Boxrum | ${Strings.resetPassword[lang]}`

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const loginUser = async () => {
        if (loading) return;

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
            return setErrors({ repassword: Strings.passwordMaxLength[lang] });
        }

        if (!validator.equals(values.password, values.repassword)) {
            return setErrors({ repassword: "Password not match" });
        }

        setErrors({});
        setLoading(true);

        try {
            const response = await fetch(`${BACKEND}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values, values.repassword = undefined)
            });

            setLoading(false);
            const data = await response.json();

            if (data.message === 'Invalid token') return setErrors({ general: "Invalid Token" })

            if (data.user?._id) {
                setSuccess(true);
            } else {
                values.repassword = ""
                throw new Error(data.error?.message || 'Error');
            }
        } catch (err) {
            setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
        }
    };

    const { onChange, onSubmit, values } = useForm(loginUser, {
        token: token,
        password: '',
        repassword: ''
    })

    const checkToken = async () => {
        try {
            const response = await fetch(`${BACKEND}/auth/check-resetpassword-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: values.token })
            });

            setLoading(false);
            const data = await response.json();

            if (data.message === 'Invalid token') return setErrors({ general: "Invalid Token" })
        } catch (err) {
            setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
        }
    }

    const renderInputContent = () => (
        <form className='form' onSubmit={onSubmit}>
            <LabelInputBox text={Strings.enterPassword[lang]} errors={errors.password} />
            <InputBox className={`${errors.password ? 'error' : ''}`} type="password" name='password' id='password' placeholder={Strings.placeholderPassword[lang]} value={values.password} onChange={onChange} autocomplete="current-password" />

            <LabelInputBox text={Strings.enterRePassword[lang]} errors={errors.repassword} />
            <InputBox className={`${errors.repassword ? 'error' : ''}`} type="password" name='repassword' id='repassword' placeholder={Strings.placeholderRePassword[lang]} value={values.repassword} onChange={onChange} autocomplete="current-password" />

            <div className='flex justify-center'>
                <button type='submit' className="btn-dark mt-14">
                    {Strings.submit[lang]}
                </button>
            </div>
        </form>
    )

    const renderSuccessContent = () => (
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <p className='text-purple text-2xl font-bold mb-2'>{Strings.passwordChangeSuccess[lang]}</p>
            <p className='mb-2'>{Strings.passwordChangeSuccessLine1[lang]}</p>

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
    )

    useEffect(() => {
        checkToken()
    }, [])
    return (
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center">
                <div className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                        {Strings.resetPassword[lang]}
                    </h1>

                    {success ? renderSuccessContent() :
                        errors.general === 'Invalid Token' ?
                            renderErrorContent() :
                            renderInputContent()

                    }

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
    )
}
