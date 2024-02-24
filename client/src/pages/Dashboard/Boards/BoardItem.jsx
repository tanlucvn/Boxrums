import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Strings } from '@/support/Constants';
import { counter, declOfNum } from '@/support/Utils';

import { useForm } from '@/hooks/useForm';

import { CardBody } from '@/components/Card';
import FormCardItem from '@/components/Card/FormCardItem';
import { InputBox } from '@/components/Form/Input';
import { Button, InputButton } from '@/components/Button';

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
    <div className='card_block'>
      <header className="card_head">
        <div className="card_head_inner">
          <Link to={'/boards/' + data.name} className="card_title">{data.title}</Link>
        </div>

        {!edit ? (
          <div className="edit_action_menu">
            <button onClick={() => setEdit(true)} className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-sky-500/30 hover:text-sky-500 flex items-center">
              <i class="fi fi-rr-pencil" title="Chỉnh sửa"></i>
            </button>
            <button onClick={deleteClick} className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center">
              <i class="fi fi-rr-trash" title="Xoá"></i>
            </button>
          </div>
        ) : (
          <div className="edit_action_menu">
            <button onClick={close} className="p-2 px-3 rounded-md border border-grey ml-auto bg-sky-500/30 text-sky-500 flex items-center">
              <i class="fi fi-rr-pencil" title="Chỉnh sửa"></i>
            </button>
            <button onClick={deleteClick} className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center">
              <i class="fi fi-rr-trash" title="Xoá"></i>
            </button>
          </div>
        )}
      </header>

      <footer className="card_foot">
        {!edit ? (
          <>
            <div className="flex items-center m-3 gap-2">
              <i class="fi fi-rr-document"></i>
              <span>{counter(data.threadsCount)}</span>
              <span>
                {declOfNum(data.threadsCount, [Strings.thread[lang], Strings.threads[lang]])}
                Test
              </span>
            </div>

            <div className="flex items-center m-3 gap-2">
              <i className="fi fi-rr-comment-dots" />
              <span className="card_count">{counter(data.answersCount)}</span>
              <span className="count_title">
                {declOfNum(data.answersCount, [Strings.answer[lang], Strings.answers[lang]])}
                Test
              </span>
            </div>
          </>
        ) : (
          <form className="form_inner" onSubmit={onSubmit}>
            <FormCardItem title={Strings.boardShortName[lang] + '*'} error={errors.name}>
              <div className={errors.name ? 'form_block error' : 'form_block'}>
                <InputBox
                  name="name"
                  value={values.name}
                  placeholder={Strings.enterShortName[lang]}
                  maxLength="21"
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            <FormCardItem title={Strings.boardTitle[lang] + '*'} error={errors.title}>
              <div className={errors.title ? 'form_block error' : 'form_block'}>
                <InputBox
                  name="title"
                  value={values.title}
                  placeholder={Strings.enterTitle[lang]}
                  maxLength="50"
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            <FormCardItem title={Strings.boardDescription[lang]} error={errors.body}>
              <div className={errors.body ? 'form_block error' : 'form_block'}>
                <InputBox
                  name="body"
                  value={values.body}
                  placeholder={Strings.enterDescription[lang]}
                  maxLength="100"
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            <FormCardItem title={Strings.boardPosition[lang] + '*'} error={errors.position}>
              <div className={errors.position ? 'form_block error' : 'form_block'}>
                <InputBox
                  type="number"
                  name="position"
                  value={values.position}
                  placeholder={Strings.enterPosition[lang]}
                  onChange={onChange}
                />
              </div>
            </FormCardItem>

            {fetchErrors[data._id] && (
              <div className="card_item">
                <span className="form_error">{fetchErrors[data._id]}</span>
              </div>
            )}

            <InputButton text={Strings.save[lang]} />
          </form>
        )}
      </footer>
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
      <footer className="card_foot">
        <form className="form_inner" onSubmit={onSubmit}>
          <FormCardItem title={Strings.boardShortName[lang] + '*'} error={errors.name}>
            <div className={errors.name ? 'form_block error' : 'form_block'}>
              <InputBox
                name="name"
                value={values.name}
                placeholder={Strings.enterShortName[lang]}
                maxLength="21"
                onChange={onChange}
              />
            </div>
          </FormCardItem>

          <FormCardItem title={Strings.boardTitle[lang] + '*'} error={errors.title}>
            <div className={errors.title ? 'form_block error' : 'form_block'}>
              <InputBox
                name="title"
                value={values.title}
                placeholder={Strings.enterTitle[lang]}
                maxLength="50"
                onChange={onChange}
              />
            </div>
          </FormCardItem>

          <FormCardItem title={Strings.boardDescription[lang]} error={errors.body}>
            <div className={errors.body ? 'form_block error' : 'form_block'}>
              <InputBox
                name="body"
                value={values.body}
                placeholder={Strings.enterDescription[lang]}
                maxLength="100"
                onChange={onChange}
              />
            </div>
          </FormCardItem>

          <FormCardItem title={Strings.boardPosition[lang] + '*'} error={errors.position}>
            <div className={errors.position ? 'form_block error' : 'form_block'}>
              <InputBox
                type="number"
                name="position"
                value={values.position}
                placeholder={Strings.enterPosition[lang]}
                onChange={onChange}
              />
            </div>
          </FormCardItem>

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
      </footer>
    </>
  )
}

export { BoardItem, NewBoardItem };
