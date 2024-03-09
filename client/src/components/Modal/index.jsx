import axios from 'axios'
import { useEffect, useContext, useState, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { toast } from 'react-hot-toast'

import { StoreContext } from '@/stores/Store';

import { useForm } from '@/hooks/useForm';

import { BACKEND, Strings } from '@/support/Constants';

import FormCardItem from '@/components/Card/FormCardItem';
import { InputBox, LabelInputBox, TextareaBox } from '@/components/Form/Input';
import TextareaForm from '@/components/Form/TextareaForm';
import FileUploadForm from '@/components/Form/FileUploadForm';
import { InputButton } from '@/components/Button';
import Loader from '@/components/Loader';

import ModalBody from './ModalBody';
import './datePicker.css';
import './style.css'


export const ModalContext = createContext()
const Modal = ({ open, close }) => {
  const navigate = useNavigate()
  const { postType, setPostType, token, lang, postRes, setPostRes } = useContext(StoreContext)
  const modalOpen = open ? 'modal open' : 'modal'
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [clearFiles, setClearFiles] = useState(false)

  const getFile = (files) => {
    setClearFiles(false)
    setFiles(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
    }
  }, [clearFiles])

  const [date, setDate] = useState(new Date())

  const banCallback = () => {
    setErrors({})

    if (postType.type === 'ban') {
      if (!banValues.reason.trim()) {
        return setErrors({ reason: Strings.enterReason[lang] })
      }
      if (!date) {
        return setErrors({ expiresAt: Strings.enterDate[lang] })
      }

      setLoading(true)
      onBan()
    }
  }
  const { onChange: banChange, onSubmit: banSubmit, values: banValues } = useForm(banCallback, {
    userId: postType.id,
    reason: '',
    body: postType?.someData?.body || ''
  })

  const onBan = () => {
    axios.post(`${BACKEND}/api/ban/create`, {
      ...banValues,
      expiresAt: date.toISOString()
    }, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        const data = response.data;
        setLoading(false);
        if (!data.error) {
          setPostRes({ ban: data });
          close();
          setPostType({
            type: 'answer',
            id: postType.id
          });
        } else {
          throw Error(data.error?.message || 'Error');
        }
      })
      .catch(err => {
        setLoading(false);
        setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
      });
  };

  const onDeleteBan = () => {
    axios.delete(BACKEND + '/api/ban/history/delete', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      data: { banId: postType.banId }
    })
      .then(response => {
        const data = response.data;
        if (!data.error) {
          close();
          toast.success(data.message);

          setPostRes({ banDeleted: { data: data.ban, message: data.message } });
        } else {
          throw Error(data.error?.message || 'Error');
        }
      })
      .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
  };

  const banContent = (
    <ModalBody title={Strings.banUser[lang]} subtitle={Strings.banUser[lang]} onClick={close}>
      <form onSubmit={banSubmit}>
        <LabelInputBox text={Strings.reason[lang]} errors={errors.reason} />
        <InputBox
          name="reason"
          value={banValues.reason}
          placeholder={Strings.enterReason[lang]}
          maxLength="100"
          onChange={banChange}
          className={`${errors.reason ? 'error' : ''}`}
        />

        <LabelInputBox text={Strings.content[lang]} errors={errors.body} />
        <TextareaBox
          name="body"
          value={banValues.body}
          placeholder={Strings.enterReason[lang]}
          maxLength="100"
          onChange={banChange}
          className={`${errors.body ? 'error' : ''}`}
        />


        <LabelInputBox text={Strings.banDuration[lang]} errors={errors.expiresAt} />
        <DatePicker
          className="input-box pl-4"
          selected={date}
          minDate={new Date()}
          showTimeSelect
          dateFormat={lang === 'en' ? 'dd MMM yyyy hh:mm aa' : 'dd MMM yyyy HH:mm'}
          timeFormat={lang === 'en' ? 'hh:mm aa' : 'HH:mm'}
          onChange={date => setDate(date)}
        />

        {errors.general && (
          <div className="card_item">
            <span className="form_error">{errors.general}</span>
          </div>
        )}

        <div className="card_item mt-7">
          {loading
            ? <Loader className="btn" />
            : <InputButton text={Strings.ban[lang]} />
          }
        </div>
      </form>
    </ModalBody>
  )

  const deleteBanContent = (
    <ModalBody title={Strings.unbanUser[lang]} subtitle={Strings.unbanUser[lang]} onClick={close}>
      <div className=''>
        Có đồng ý xoá trường này không?
        <div className='flex justify-end items-center gap-3 max-sm:absolute max-sm:bottom-7 max-sm:right-7'>
          <button className='btn-light' onClick={onDeleteBan}>
            Có
          </button>

          <button className='btn-dark' onClick={close}>
            Huỷ
          </button>
        </div>
      </div>
    </ModalBody>
  )

  const modalContent = {
    ban: banContent,
    deleteBan: deleteBanContent
  }

  const content = modalContent[postType.type]

  return (
    <section className={`${modalOpen} z-[99]`}>
      {content}
    </section>
  )
}

export default Modal;
