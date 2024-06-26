import { Fragment, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';

import { StoreContext } from '@/stores/Store';

import { useForm } from '@/hooks/useForm';

import { BACKEND, Strings } from '@/support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket';
import { dateFormat, deletedUser } from '@/support/Utils';

import FormCardItem from '@/components/Card/FormCardItem';
import FileUploadForm from '@/components/Form/FileUploadForm';
import { UserRole, UserStatus, UserOnline } from '@/components/UserBadge';
import Loader from '@/components/Loader';
import Errorer from '@/components/Errorer';
import CustomScrollbar from '@/components/CustomScrollbar';
import Avatar from 'boring-avatars'

import MessageItem from './MessageItem';
import './style.css';
import { LabelInputBox } from '@/components/Form/Input';

const Dialogue = () => {
  const { user, token, lang } = useContext(StoreContext)
  const { userName } = useParams()
  const [toUser, setToUser] = useState({})
  const [errors, setErrors] = useState({})
  const [dialogueId, setDialogueId] = useState(null)
  const [items, setItems] = useState([])
  const limit = 15
  const [page, setPage] = useState(1)
  const [nextPage, setNextPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loading, setLoading] = useState(true)
  const [moreLoading, setMoreLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [moreTrigger, setMoreTrigger] = useState(true)
  const [toBottom, setToBottom] = useState(true)
  const [fetchMessagesInit, setFetchMessagesInit] = useState(true)
  const [firstMsg, setFirstMsg] = useState('')
  const [typing, setTyping] = useState(false)
  const [chatWidth, setChatWidth] = useState(null)
  const mainSection = document.querySelector('.main_section');
  const contentSection = document.querySelector('.content');

  useEffect(() => {
    if (dialogueId) joinToRoom('pm:' + dialogueId, { token, userId: user.id })
    return () => {
      if (dialogueId) leaveFromRoom('pm:' + dialogueId)
    }
    // eslint-disable-next-line
  }, [dialogueId])

  useEffect(() => {
    document.querySelector('html').scrollTo(0, 0)
    document.body.classList.add('noscroll')
    document.querySelector('.main_section')?.classList.add('with_hested_scroll')
    setChatWidth(mainSection?.clientWidth);
    return () => {
      document.body.classList.remove('noscroll')
      document.querySelector('.main_section')?.classList.remove('with_hested_scroll')
    }
  }, [])

  useEffect(() => {
    const userTitle = toUser.displayName || userName
    document.title = `Forum | ${Strings.dialogueWith[lang]} ${userTitle}`
  }, [toUser, userName, lang])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/user?userName=${userName}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          setToUser(response)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch (err) {
        setToUser(deletedUser)
        setLoading(false)
        setNoData(true)
      }
    }

    const fetchDialogue = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/dialogue?userName=${userName}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response) return setLoading(false)

        if (!response.error) {
          setDialogueId(response._id)
        } else throw Error(response.error?.message || 'Error')
      } catch (err) {
        toast.error(err.message === '[object Object]' ? 'Error' : err.message)
      }
    }

    // set initial state
    setDialogueId(null)
    setItems([])
    setLoading(true)
    setPage(1)
    setNextPage(1)
    setHasNextPage(true)
    setMoreTrigger(true)
    setFetchMessagesInit(true)
    setFirstMsg('')

    if (userName === 'deleted') {
      setToUser(deletedUser)
      setLoading(false)
      setNoData(true)
      return
    }

    fetchUser()
    fetchDialogue()
    // eslint-disable-next-line
  }, [userName])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!hasNextPage || !dialogueId) return

      setMoreLoading(true)

      try {
        const data = await fetch(`${BACKEND}/api/messages?dialogueId=${dialogueId}&limit=${limit}&page=${page}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()

        if (!response.error) {
          response.docs.map(resGroup => {
            if (resGroup.date === items.find(item => item.date === resGroup.date)?.date) {
              setItems(prev => {
                let newArray = [...prev]
                const index = newArray.findIndex(item => item.date === resGroup.date)
                newArray[index]?.messages.unshift(...resGroup.messages)
                const messages = newArray[index].messages
                  .filter((e, i, a) => a.findIndex(({ _id }) => _id === e._id) === i)
                newArray[index].messages = messages

                return newArray
              })
            } else {
              setItems(prev => {
                let newArray = [resGroup, ...prev]
                const index = newArray.findIndex(item => item.date === resGroup.date)
                const messages = newArray[index].messages
                  .filter((e, i, a) => a.findIndex(({ _id }) => _id === e._id) === i)
                newArray[index].messages = messages

                return newArray
              })
            }

            return true
          })

          setNextPage(response.nextPage)
          setHasNextPage(response.hasNextPage)
          setLoading(false)
          setMoreLoading(false)
          setNoData(false)
          setMoreTrigger(true)
          if (fetchMessagesInit) {
            setFetchMessagesInit(false)
            setToBottom((Math.random() * 100).toFixed())
          }
          if (firstMsg) {
            document.querySelector(`#${firstMsg}`).scrollIntoView()
          }
        } else throw Error(response.error?.message || 'Error')
      } catch (err) {
        setLoading(false)
        setNoData(true)
        setMoreLoading(false)
      }
    }

    fetchMessages()
    // eslint-disable-next-line
  }, [page, dialogueId])

  const handleScroll = ({ target }) => {
    document.querySelector('html').scrollTo(0, 0)
    if (!moreTrigger) return

    if (target.scrollTop <= 70) {
      setMoreTrigger(false)
      setPage(nextPage)
    }
  }

  useEffect(() => {
    items.length && setFirstMsg('msg_' + items[0].messages[0]._id)
  }, [items])

  useEffect(() => {
    if (dialogueId && toUser) Socket.emit('readMessages', { token, dialogueId, from: toUser._id })
    // eslint-disable-next-line
  }, [dialogueId, toUser])

  useEffect(() => {
    Socket.on('joinToDialogue', (data) => {
      setDialogueId(data._id)
    })
    Socket.on('newMessage', (data) => {
      setItems(prev => {
        const date = new Date(data.createdAt).toISOString().split('T')[0]
        if (prev[prev.length - 1].date === date) {
          prev[prev.length - 1].messages.push(data)
          return prev
        } else {
          return [...prev, { groupId: data._id, date, messages: [data] }]
        }
      })
      setNoData(false)
      setToBottom((Math.random() * 100).toFixed())
    })
    Socket.on('messageDeleted', (data) => {
      setItems(prev => {
        const currentGroup = prev.filter(item => item.groupId === data.groupId)
        const newMessages = currentGroup[0].messages.filter(item => item._id !== data.id)

        let newArray = [...prev]
        newArray[newArray.findIndex(item => item.groupId === data.groupId)].messages = newMessages

        if (!newMessages.length) {
          return prev.filter(item => item.groupId !== data.groupId)
        }

        return newArray
      })
    })
    Socket.on('messagesRead', () => {
      setItems(prev => prev.map(group => {
        return {
          ...group,
          messages: group.messages.map(msg => ({ ...msg, read: true }))
        }
      }))
    })
    Socket.on('startTyping', (data) => {
      setTyping(true)
    })
    Socket.on('stopTyping', (data) => {
      setTyping(false)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Socket.on('newMessage', (data) => {
      if (data.from._id !== user.id) {
        Socket.emit('readMessages', { token, dialogueId, from: toUser._id })
      }
    })
    // eslint-disable-next-line
  }, [dialogueId])

  const [files, setFiles] = useState([])
  const [clearFiles, setClearFiles] = useState(false)
  const [uploading, setUploading] = useState(false)

  const getFile = (files) => {
    setClearFiles(false)
    setFiles(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
    }
  }, [clearFiles])

  const sendMessageWithFiles = () => {
    const formData = new FormData()
    files.map(item => formData.append('file', item))
    formData.append('postData', JSON.stringify({
      dialogueId,
      body: values.body.substring(0, 1000),
      to: toUser._id
    }))

    fetch(BACKEND + '/api/message/create', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token
      },
      body: formData
    })
      .then(response => {
        setUploading(false)
        return response.json()
      })
      .then(data => {
        if (data.error) throw Error(data.error?.message || 'Error')
      })
      .catch(err => {
        toast.error(err.message === '[object Object]' ? 'Error' : err.message)
      })
  }

  const sendMessageCallback = () => {
    if (uploading || toUser.name === 'deleted') return

    if (!files.length && !values.body.trim()) {
      return setErrors({ body: Strings.enterContent[lang] })
    }

    setErrors({})
    reset()
    if (!files.length) {
      Socket.emit('createMessage', { token, dialogueId, body: values.body, to: toUser._id })
    } else {
      setClearFiles(true)
      setUploading(true)
      sendMessageWithFiles()
    }
    Socket.emit('stopType', { token, dialogueId })
  }

  const { onChange, onSubmit, values, reset } = useForm(sendMessageCallback, {
    body: ''
  })

  useEffect(() => {
    if (values.body.length > 0) {
      Socket.emit('startType', { token, dialogueId })
    } else {
      Socket.emit('stopType', { token, dialogueId })
    }
    // eslint-disable-next-line
  }, [values.body])

  const onBlur = () => {
    Socket.emit('stopType', { token, dialogueId })
  }

  const [chatHeight, setChatHeight] = useState(window.innerHeight)

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })

  const handleResize = () => {
    document.querySelector('html').scrollTo(0, 0)
    setChatHeight(window.innerHeight)
    setChatWidth(contentSection.clientWidth)
  }

  // console.log("hooks")
  useEffect(() => {
    if (userName) {
      document.body.classList.add('noscroll')
    } else {
      document.body.classList.remove('noscroll')
    }
  }, [userName])

  return (
    <Fragment>
      <div className="messages_wrapper" style={{ height: `calc(${chatHeight}px - 180px)` }}>
        {toUser.name && (
          <div className="flex items-start py-1 px-3 text-sm relative">
            <div className="flex flex-col w-full">
              <div className="flex items-center gap-5 font-medium">
                <Link to={'/messages'} class="w-8 h-8 flex items-center justify-center rounded-full bg-grey relative hover:bg-black/10 ">
                  <i class="fi fi-rr-arrow-left mt-[.3rem] text-xl"></i>
                </Link>

                <div className="w-10 h-10">
                  <Avatar
                    size={"100%"}
                    name={toUser.name}
                    variant="marble"
                    colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                  />
                </div>

                <div className="flex flex-col flex-1 overflow-hidden">
                  <Link to={'/user/' + toUser.name} className="text-xl">
                    {toUser.displayName}
                    <UserRole role={toUser.role} />
                    {toUser.ban && <UserStatus status="ban" />}
                  </Link>
                  <div className="text-sm text-dark-grey/80">
                    {typing ? (
                      <>
                        {Strings.isTyping[lang]}
                      </>
                    ) : (
                      <UserOnline onlineAt={toUser.onlineAt} offlineText={Strings.lastSeen[lang]} dateType="short" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <CustomScrollbar className="view" onScroll={handleScroll} toBottom={toBottom}>
          {!noData ? (
            !loading ? (
              items.length ? (
                <>
                  {moreLoading && <Loader className="more_loader" color="#64707d" />}

                  <div className="messages_list mb-[5rem] max-md:mb-[9rem]">
                    {items.map(item => (
                      <div key={item.groupId} className="messages_group">
                        <div className="group_date_block">
                          <span className="group_date_title">
                            {dateFormat(item.date, 'onlyDate')}
                          </span>
                        </div>

                        {item.messages.map(msg => (
                          <MessageItem key={msg._id} groupId={item.groupId} data={msg} user={user} token={token} />
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              ) : <Errorer message={Strings.noMessagesYet[lang]} />
            ) : <Loader color="#64707d" />
          ) : (
            <Errorer message={Strings.unableToDisplayMessages[lang]} />
          )}
        </CustomScrollbar>

        {toUser.name && toUser.name !== 'deleted' && (
          <form className="w-full sticky comments_form bg-grey rounded-md z-50 max-w-none m-0" /* style={{ width: `${chatWidth}px` }} */ onSubmit={onSubmit}>
            <div className='flex items-center gap-3'>
              <div className='w-full flex items-center basis-full'>
                {/* <LabelInputBox errors={errors.body} /> */}
                <TextareaAutosize
                  className="input-box w-full pl-3 resize-none bg-light-grey"
                  name="body"
                  value={values.body}
                  maxLength="1000"
                  minRows={1}
                  maxRows={1}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder={Strings.enterYourMessage[lang]}
                />
              </div>

              <div className='flex gap-3 justify-center items-center basis-1/12'>
                <FileUploadForm
                  mini
                  sendFiles={getFile}
                  clearFiles={clearFiles}
                />

                <button className="btn-dark send_btn" disabled={uploading}>
                  {uploading
                    ? <i class="fi fi-rr-circle"></i>
                    : <i class="fi fi-rr-paper-plane-top"></i>
                  }
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Fragment>
  )
}

export default Dialogue;
