import axios from 'axios'
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { BACKEND, Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import { useForm } from '@/hooks/useForm';
import { InputBox, LabelInputBox } from '@/components/Form/Input';
import validator from 'validator';
import AnimationWrapper from '@/common/page-animation';

export default function ForgotPassword() {
    const { lang } = useContext(StoreContext)
    document.title = `Boxrum | ${Strings.forgotPassword[lang]}`

    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const forgotPasswordSend = async () => {
        if (loading) return;

        if (validator.isEmpty(values.email)) {
            return setErrors({ email: "Required" });
        }
        setErrors({});
        setLoading(true);

        try {
            const response = await axios.post(`${BACKEND}/auth/forgot-password`, values, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setLoading(false);
            const data = response.data;

            if (data.user._id) {
                setSuccess(true);
            } else {
                throw new Error(data.error?.message || 'Error');
            }
        } catch (err) {
            setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
        }
    };

    const { onChange, onSubmit, values } = useForm(forgotPasswordSend, {
        email: '',
    })

    const renderInputContent = () => (
        <form className='form' onSubmit={onSubmit}>
            <LabelInputBox text={Strings.enterEmail[lang]} errors={errors.email} />
            <InputBox className={`${errors.email ? 'error' : ''}`} type="text" name='email' id='email' placeholder="Phone, email or username" value={values.email} onChange={onChange} />

            <div className='flex justify-center'>
                <button type='submit' className="btn-dark mt-14">
                    {Strings.forgotPassword[lang]}
                </button>
            </div>
        </form>
    )

    const renderRequestedContent = () => (
        <div class="flex flex-col items-center justify-center overflow-hidden">
            <p className='text-purple text-2xl font-bold'>{Strings.passwordRestRequested[lang]}</p>
            <p>{Strings.passwordSendSuccessLine1[lang]}</p>
            <p className='text-purple my-2'>{values.email}</p>
            <p>{Strings.verifyErrLine2[lang]}</p>
        </div>
    )

    return (
        <AnimationWrapper>
            <section className="h-cover flex items-center justify-center">
                <div className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
                        {Strings.forgotPassword[lang]}
                    </h1>

                    {success ? renderRequestedContent() : renderInputContent()}

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
