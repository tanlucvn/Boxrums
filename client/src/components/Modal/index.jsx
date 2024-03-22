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

  const callBackStored = () => {
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

    const reportCallback = () => {
      setErrors({})

      if (postType.type === 'createReport') {
        if (!reportValues.body.trim()) {
          return setErrors({ reason: Strings.enterReason[lang] })
        }

        setLoading(true)
        onReport()
      }
    }

    return { banCallback, reportCallback };
  }
  const { onChange: banChange, onSubmit: banSubmit, values: banValues } = useForm(callBackStored().banCallback, {
    userId: postType.id,
    reason: '',
    body: postType?.someData?.body || ''
  })

  const { onChange: reportChange, onSubmit: reportSubmit, values: reportValues } = useForm(callBackStored().reportCallback, {
    threadId: postType.threadId,
    postId: postType.threadId,
    body: postType.someData?.body || ''
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

  const onReport = () => {
    axios.post(BACKEND + '/api/report/create', {
      threadId: reportValues.threadId,
      postId: reportValues.postId,
      body: reportValues.body
    }, {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.data.error) {
          close();
          toast.success(Strings.reportSent[lang]);
        } else {
          throw new Error(response.data.error?.message || 'Error');
        }
      })
      .catch(error => {
        close();
        if (error.response.data.error.message === "Report to the post already has") {
          return toast.error(Strings.postIsReported[lang])
        }
        toast.error(error.message === '[object Object]' ? 'Error' : error.message);
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

  const onDeleteUser = async () => {
    try {
      const response = await axios.delete(`${BACKEND}/api/user/delete`, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data: { userId: postType.id }
      });

      if (!response.data.error) {
        close()
        toast.success(response.message)
        navigate('/users');
        setPostRes({ userDeleted: { user: response.user, message: response.message } })
      } else {
        throw new Error(response.data.error?.message || 'Error');
      }
    } catch (err) {
      toast.error(err.message === '[object Object]' ? 'Error' : err.message);
    }
  };

  const onEditRole = async () => {
    const role = postType.someData.moder ? 1 : 2;

    try {
      const response = await axios.put(`${BACKEND}/api/role/edit`, { userId: postType.id, role }, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.error) {
        close()
        toast.success(Strings.editedRoleSuccess[lang])
        setPostRes({ editedRole: { message: response.data.message } });
      } else {
        throw new Error(response.data.error?.message || 'Error');
      }
    } catch (err) {
      toast.error(err.message === '[object Object]' ? 'Error' : err.message);
    }
  }

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
        {Strings.msgDeleteBan[lang]}

        <div className='flex justify-end items-center gap-3 max-sm:absolute max-sm:bottom-7 max-sm:right-7'>
          <button className='btn-light' onClick={onDeleteBan}>
            {Strings.accept[lang]}
          </button>

          <button className='btn-dark' onClick={close}>
            {Strings.cancel[lang]}
          </button>
        </div>
      </div>
    </ModalBody>
  )

  const deleteUserContent = (
    <ModalBody title={Strings.deleteUser[lang]} subtitle={Strings.deleteUser[lang]} onClick={close}>
      <div className=''>
        {Strings.msgDeleteUser[lang]}

        <div className='flex justify-end items-center gap-3 max-sm:absolute max-sm:bottom-7 max-sm:right-7'>
          <button className='btn-light' onClick={onDeleteUser}>
            {Strings.accept[lang]}
          </button>

          <button className='btn-dark' onClick={close}>
            {Strings.cancel[lang]}
          </button>
        </div>
      </div>
    </ModalBody>
  )

  const createReportContent = (
    <ModalBody title={Strings.report[lang]} subtitle={Strings.report[lang]} onClick={close}>
      <form onSubmit={reportSubmit}>
        <div className=''>
          <p className='mb-5'>{Strings.msgReport[lang]}</p>

          <LabelInputBox text={Strings.reason[lang]} errors={errors.reason} />
          <InputBox
            name="body"
            value={reportValues.body}
            placeholder={Strings.enterReason[lang]}
            maxLength="100"
            onChange={reportChange}
            className={`${errors.reason ? 'error' : ''}`}
          />
          <div className='flex justify-end items-center gap-3 max-sm:absolute max-sm:bottom-7 max-sm:right-7'>
            <button className='btn-light' type="submit">
              {Strings.accept[lang]}
            </button>

            <button className='btn-dark' onClick={close}>
              {Strings.cancel[lang]}
            </button>
          </div>
        </div>
      </form>
    </ModalBody>
  )

  const editRole = (
    <ModalBody title={Strings.appointAsAModerator[lang]} subtitle={Strings.appointAsAModerator[lang]} onClick={close}>
      <div className=''>
        {Strings.msgAppointAsAModerator[lang]}
        <div className='flex justify-end items-center gap-3 max-sm:absolute max-sm:bottom-7 max-sm:right-7'>
          <button className='btn-light' onClick={onEditRole}>
            {Strings.accept[lang]}
          </button>

          <button className='btn-dark' onClick={close}>
            {Strings.cancel[lang]}
          </button>
        </div>
      </div>
    </ModalBody>
  )

  const modalContent = {
    ban: banContent,
    deleteBan: deleteBanContent,
    deleteUser: deleteUserContent,
    createReport: createReportContent,
    editRole: editRole,
  }

  const content = modalContent[postType.type]

  return (
    <section className={`${modalOpen} z-[99]`}>
      {content}
    </section>
  )
}

export default Modal;
