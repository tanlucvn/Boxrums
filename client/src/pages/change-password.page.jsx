import React, { useContext, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { InputBox, LabelInputBox } from '@/components/Form/Input'
import axios from 'axios'
import { BACKEND, Strings } from '@/support/Constants'
import { StoreContext } from '@/stores/Store'
import { useForm } from '@/hooks/useForm'

const ChangePassword = () => {
  const { token, lang } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const editPasswordCallback = () => {
    if (loading) return

    setErrors({})

    if (!passwordValues.password.trim()) {
      return setErrors({ password: Strings.emptyPassword[lang] })
    }

    if (!passwordValues.newPassword.trim()) {
      return setErrors({ newPassword: Strings.emptyNewPassword[lang] })
    }

    if (!passwordValues.confirmPassword.trim()) {
      return setErrors({ confirmPassword: Strings.emptyConfirmPassword[lang] })
    }

    if (passwordValues.newPassword.trim() !== passwordValues.confirmPassword) {
      return setErrors({ confirmPassword: Strings.passwordNotMatch[lang] })
    }

    setLoading(true)

    editPassword()
  }

  const { onChange: editPasswordChange, onSubmit: editPasswordSubmit, values: passwordValues, reset } = useForm(editPasswordCallback, {
    password: '',
    newPassword: '',
    confirmPassword: ''
  })

  const editPassword = () => {
    const { confirmPassword, ...body } = passwordValues;

    axios.put(BACKEND + '/api/profile/password/edit', body, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setLoading(false);
        const data = response.data;
        if (!data.error) {
          toast.success(Strings.passwordChanged[lang])
          navigate('/')
          reset()
        } else {
          throw Error(data.error?.message || 'Error');
        }
      })
      .catch(err => {
        if (err.response?.data?.error?.message === "Password not valid") {
          toast.error(Strings.currentPasswordNotMatch[lang])
        }
        setLoading(false);
        setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
      });
  };


  return (
    <AnimationWrapper>
      <form onSubmit={editPasswordSubmit}>
        <h1 className='max-md:hidden'>{Strings.changePassword[lang]}</h1>
        <div className='py-10 w-full md:max-w-[400px]'>
          <LabelInputBox text={Strings.password[lang]} errors={errors.password} />
          <InputBox name='password' type='password' className='profile-edit-input' placeholder={Strings.enterPassword[lang]} icon='fi-rr-unlock' value={passwordValues.password} onChange={editPasswordChange} />

          <LabelInputBox text={Strings.newPassword[lang]} errors={errors.newPassword} />
          <InputBox name='newPassword' type='password' className='profile-edit-input' placeholder={Strings.enterNewPassword[lang]} icon='fi-rr-unlock' value={passwordValues.newPassword} onChange={editPasswordChange} />

          <LabelInputBox text={Strings.confirmPassword[lang]} errors={errors.confirmPassword} />
          <InputBox name='confirmPassword' type='password' className='profile-edit-input' placeholder={Strings.enterConfirmPassword[lang]} icon='fi-rr-unlock' value={passwordValues.confirmPassword} onChange={editPasswordChange} />

          <button className='btn-dark px-10' type='submit'>{Strings.changePassword[lang]}</button>
        </div>
      </form>
    </AnimationWrapper>
  )
}

export default ChangePassword