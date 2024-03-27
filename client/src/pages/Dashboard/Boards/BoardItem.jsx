import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Strings } from '@/support/Constants';
import { counter, declOfNum } from '@/support/Utils';

import { useForm } from '@/hooks/useForm';
import { InputBox, LabelInputBox } from '@/components/Form/Input';
import { Button, InputButton } from '@/components/Button';
import Avatar from 'boring-avatars'

const BoardItem = ({ lang, data, editBoard, deleteBoard, fetchErrors, setFetchErros }) => {
  const [edit, setEdit] = useState(false)
  const [errors, setErrors] = useState({})

  const formCallback = () => {
    setErrors({})
    setFetchErros({})

    if (!values.name.trim()) {
      return setErrors({ name: Strings.enterShortName[lang] })
    }
    if (!values.title.trim()) {
      return setErrors({ title: Strings.enterTitle[lang] })
    }
    if (!values.position || values.position <= 0) {
      return setErrors({ position: Strings.enterPosition[lang] })
    }

    setEdit(false)

    editBoard({
      boardId: data._id,
      name: values.name,
      title: values.title,
      body: values.body,
      position: values.position * 1
    })
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    name: data.name || '',
    title: data.title || '',
    body: data.body || '',
    position: data.position || 1
  })

  const deleteClick = () => {
    const conf = window.confirm(`${Strings.delete[lang]}?`)

    if (!conf) return

    setEdit(false)

    deleteBoard(data._id)
  }

  const close = () => {
    setEdit(false)
    setFetchErros({})
  }

  return (
    <div className='bg-grey flex gap-8 px-7 py-3 items-center border-b border-grey pb-5 mb-4 hover:opacity-90'>
      <div className='w-full'>
        <Link to={`/board/${data.name}`} className='blog-title'>{data.title}</Link>
        <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{data.body}</p>

        <div className='flex justify-between flex-wrap'>
          <div className="flex gap-x-10 justify-between items-center flex-wrap">
            <div className='flex gap-4 mt-7'>
              <p className='ml-3 flex items-center gap-2 text-dark-grey'>
                <i class="fi fi-rr-ballot"></i>
                {counter(data.threadsCount)}
                <span className='max-sm:hidden'>{declOfNum(data.threadsCount, Strings.thread[lang], Strings.threads[lang])}</span>
              </p>

              <p className='ml-3 flex items-center gap-2 text-dark-grey'>
                <i class="fi fi-rr-comment-dots"></i>
                {counter(data.answersCount)}
                <span className='max-sm:hidden'>{declOfNum(data.answersCount, Strings.answer[lang], Strings.answers[lang])}</span>
              </p>
            </div>
          </div>

          {!edit ? (
            <div className="flex items-center justify-end gap-3 mt-7">
              <button onClick={() => setEdit(true)} className="p-2 px-3 rounded-md border border-grey hover:bg-sky-500/30 hover:text-sky-500 flex items-center">
                <i class="fi fi-rr-pencil" title="Chỉnh sửa"></i>
              </button>
              <button onClick={deleteClick} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                <i class="fi fi-rr-trash" title="Xoá"></i>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 mt-7">
              <button onClick={close} className="p-2 px-3 rounded-md border border-grey bg-sky-500/30 text-sky-500 flex items-center">
                <i class="fi fi-rr-pencil" title="Chỉnh sửa"></i>
              </button>
              <button onClick={deleteClick} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                <i class="fi fi-rr-trash" title="Xoá"></i>
              </button>
            </div>
          )}

          {edit &&
            <form className="form_inner" onSubmit={onSubmit}>
              <LabelInputBox text={Strings.boardShortName[lang] + '*'} errors={errors.name} />
              <InputBox
                className="bg-light-grey"
                name="name"
                value={values.name}
                placeholder={Strings.enterShortName[lang]}
                maxLength="21"
                onChange={onChange}
              />

              <LabelInputBox text={Strings.boardTitle[lang] + '*'} errors={errors.title} />
              <InputBox
                className="bg-light-grey"
                name="title"
                value={values.title}
                placeholder={Strings.enterTitle[lang]}
                maxLength="50"
                onChange={onChange}
              />

              <LabelInputBox text={Strings.boardDescription[lang]} errors={errors.body} />
              <InputBox
                className="bg-light-grey"
                name="body"
                value={values.body}
                placeholder={Strings.enterDescription[lang]}
                maxLength="100"
                onChange={onChange}
              />

              <LabelInputBox text={Strings.boardPosition[lang] + '*'} errors={errors.position} />
              <InputBox
                className="bg-light-grey"
                type="number"
                name="position"
                value={values.position}
                placeholder={Strings.enterPosition[lang]}
                onChange={onChange}
              />

              <InputButton text={Strings.save[lang]} />
            </form>
          }
        </div>
      </div>

      <div className='h-28 aspect-square bg-grey max-sm:hidden'>
        {
          data.banner ? <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
            <Avatar
              size={"100%"}
              name={data.title}
              variant="marble"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
              square="true"
            />
        }
      </div>
    </div>
  )
}

const NewBoardItem = ({ lang, createBoard, setCreate, fetchErrors, setFetchErros }) => {
  const [errors, setErrors] = useState({})

  const formCallback = () => {
    setErrors({})
    setFetchErros({})

    if (!values.name.trim()) {
      return setErrors({ name: Strings.enterShortName[lang] })
    }
    if (!values.title.trim()) {
      return setErrors({ title: Strings.enterTitle[lang] })
    }
    if (!values.position || values.position <= 0) {
      return setErrors({ position: Strings.enterPosition[lang] })
    }

    createBoard({
      name: values.name,
      title: values.title,
      body: values.body,
      position: values.position * 1
    })
  }

  const { onChange, onSubmit, values } = useForm(formCallback, {
    name: '',
    title: '',
    body: '',
    position: 1
  })

  const close = () => {
    setCreate(false)
    setFetchErros({})
  }

  return (
    <>
      <div className="bg-grey flex gap-8 px-7 py-3 items-center border-b border-grey pb-5 mb-4 hover:opacity-90">
        <form className="form_inner" onSubmit={onSubmit}>
          <LabelInputBox text={Strings.boardShortName[lang] + '*'} errors={errors.name} />
          <InputBox
            className="bg-light-grey"
            name="name"
            value={values.name}
            placeholder={Strings.enterShortName[lang]}
            maxLength="21"
            onChange={onChange}
          />

          <LabelInputBox text={Strings.boardTitle[lang] + '*'} errors={errors.title} />
          <InputBox
            className="bg-light-grey"
            name="title"
            value={values.title}
            placeholder={Strings.enterTitle[lang]}
            maxLength="50"
            onChange={onChange}
          />

          <LabelInputBox text={Strings.boardDescription[lang]} errors={errors.body} />
          <InputBox
            className="bg-light-grey"
            name="body"
            value={values.body}
            placeholder={Strings.enterDescription[lang]}
            maxLength="100"
            onChange={onChange}
          />

          <LabelInputBox text={Strings.boardPosition[lang] + '*'} errors={errors.position} />
          <InputBox
            className="bg-light-grey"
            type="number"
            name="position"
            value={values.position}
            placeholder={Strings.enterPosition[lang]}
            onChange={onChange}
          />

          {fetchErrors.generalCreate && (
            <div className="card_item">
              <span className="form_error">{fetchErrors.generalCreate}</span>
            </div>
          )}

          <div className="flex gap-3">
            <InputButton text={Strings.create[lang]} />
            <Button className="btn-light" text={Strings.cancel[lang]} onClick={close} />
          </div>
        </form>
      </div>
    </>
  )
}

export { BoardItem, NewBoardItem };
