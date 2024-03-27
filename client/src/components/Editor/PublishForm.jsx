import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import AnimationWrapper from '../../common/page-animation'
import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../../pages/editor.pages'
import Tag from '../tags.component'
import { useNavigate, useParams } from 'react-router-dom'
import { StoreContext } from '@/stores/Store'
import { BACKEND, Strings } from '@/support/Constants'
import Avatar from 'boring-avatars'
import { LabelInputBox, SelectBox } from '../Form/Input'
import FileUploadForm from '../Form/FileUploadForm'

const PublishForm = () => {
  const { lang, postType } = useContext(StoreContext)
  const { token } = useContext(StoreContext)
  const { blog, setBlog, setEditorState } = useContext(EditorContext)
  const [boards, setBoards] = useState([])
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [clearFiles, setClearFiles] = useState(false)
  const navigate = useNavigate()
  const charLength = 200
  const tagLimit = 10

  const getFile = (files) => {
    setClearFiles(false)
    setFiles(files)
  }

  useEffect(() => {
    if (clearFiles) {
      setFiles([])
    }
  }, [clearFiles])

  const handleClose = () => {
    setEditorState("editor")
  }

  const handleBlogTitleChange = (e) => {
    const input = e.target;
    setBlog({ ...blog, title: input.value })
  }

  const handleTagsKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      const tag = e.target.value;

      if (blog?.tags?.length < tagLimit) {
        if (!blog.tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...blog.tags, tag] })
        }
      }
      else {
        toast.error(Strings.addMaxTags[lang].replace('{tag}', `${tagLimit}`))
      }

      e.target.value = ""
    }
  }

  const handlePublish = (e) => {
    if (e.target.className.includes('disable')) {
      return
    }

    if (postType.type === "thread") {
      if (!blog.boards) {
        setErrors({ boards: Strings.pleaseSelectBoard[lang] })
        return toast.error(Strings.pleaseSelectBoard[lang])
      }
    }

    if (postType.type === "upload") {
      if (!blog.folders) {
        setErrors({ folders: Strings.pleaseSelectFolder[lang] })
        return toast.error(Strings.pleaseSelectFolder[lang])
      }
    }

    if (!blog.title) {
      setErrors({ title: Strings.writeTitle[lang] })
      return toast.error(Strings.writeTitle[lang])
    }

    if (!blog.desc.length || blog.desc.length > charLength) {
      setErrors({ desc: Strings.emptyDesc[lang] })
      return toast.error(Strings.writeDesc[lang].replace('{charLength}', `${charLength}`))
    }
    if (!blog.tags.length || blog.tags.length > 10) {
      setErrors({ tags: Strings.emptyTags[lang] })
      return toast.error(Strings.writeTags[lang].replace('{tag}', `${tagLimit}`))
    }

    const loadingToast = toast.loading(Strings.publishing[lang])


    e.target.classList.add('disable');

    if (postType.type === "thread") {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('desc', blog.desc);
      formData.append('banner', blog.banner);
      formData.append('body', JSON.stringify(blog.body));
      formData.append('tags', JSON.stringify(blog.tags));
      formData.append('boardId', blog.boards.boardId);

      files.forEach(file => {
        formData.append('attach', file);
      });

      axios.post(BACKEND + '/api/thread/create', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        e.target.classList.remove('disable');

        toast.dismiss(loadingToast)
        toast.success(Strings.published[lang]);

        navigate(`/thread/${res.data._id}`)

      }).catch(({ response }) => {
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast)
        return toast.error(response)
      })
    }

    if (postType.type === "upload") {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('desc', blog.desc);
      formData.append('banner', blog.banner);
      formData.append('body', JSON.stringify(blog.body));
      formData.append('tags', JSON.stringify(blog.tags));
      formData.append('folderId', blog.folders.folderId);

      files.forEach(file => {
        formData.append('file', file);
      });

      axios.post(`${BACKEND}/api/file/create`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }).then((res) => {
        e.target.classList.remove('disable');

        toast.dismiss(loadingToast);
        toast.success(Strings.published[lang]);

        navigate(`/file/${res.data._id}`)
      }).catch((error) => {
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        return toast.error(error.response.data.message || 'Error');
      });
    }

    if (postType.type === "threadEdit") {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('desc', blog.desc);
      formData.append('banner', blog.banner);
      formData.append('body', JSON.stringify(blog.body));
      formData.append('tags', JSON.stringify(blog.tags));
      formData.append('threadId', blog._id);

      files.forEach(file => {
        formData.append('attach', file);
      });

      axios.put(BACKEND + '/api/thread/edit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        e.target.classList.remove('disable');

        toast.dismiss(loadingToast)
        toast.success(Strings.edited[lang]);

        navigate(`/thread/${res.data._id}`)
      }).catch(({ response }) => {
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast)
        return toast.error(response)
      })
    }

    if (postType.type === "fileEdit") {
      const formData = new FormData();
      formData.append('title', blog.title);
      formData.append('desc', blog.desc);
      formData.append('banner', blog.banner);
      formData.append('body', JSON.stringify(blog.body));
      formData.append('tags', JSON.stringify(blog.tags));
      formData.append('fileId', blog._id);

      files.forEach(file => {
        formData.append('file', file);
      });

      axios.put(BACKEND + '/api/file/edit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      }).then((res) => {
        e.target.classList.remove('disable');

        toast.dismiss(loadingToast)
        toast.success(Strings.edited[lang]);

        navigate(`/file/${res.data._id}`)
      }).catch(({ response }) => {
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast)

        if (response.data.error.message === "File upload failed") {
          return toast.error(Strings.fileUploadFailed[lang])
        }
        return toast.error(response)
      })
    }
  }

  const loadBoards = () => {
    if (boards.length) return;

    axios.get(`${BACKEND}/api/boards?pagination=true`)
      .then(response => {
        const data = response.data;
        if (data.docs?.length) {
          setBoards(data.docs);
        } else {
          throw new Error(Strings.boardsNotLoaded[lang]);
        }
      })
      .catch(err => {
        setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
      });
  }

  const loadFolders = () => {
    if (boards.length) return;

    axios.get(`${BACKEND}/api/folders?pagination=true`)
      .then(response => {
        const data = response.data;
        if (data.docs?.length) {
          setFolders(data.docs);
        } else {
          throw new Error(Strings.boardsNotLoaded[lang]);
        }
      })
      .catch(err => {
        setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message });
      });
  }

  // console.log(blog)
  // console.log(postType)

  return (
    <AnimationWrapper >
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        <Toaster />
        <button className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]' onClick={handleClose}><i className='fi fi-rr-cross'></i></button>
        <div className='max-w-[500px] center '>
          <p className='text-dark-grey mb-1'>Preview</p>
          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            {blog.banner ?
              <img src={blog.banner} alt="Banner" /> :
              <Avatar
                size={"100%"}
                name={blog.title}
                variant="marble"
                colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                square="true"
              />}
          </div>
          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{blog.title}</h1>
          <p className='line-clamp-3 text-xl leading-7 mt-4 break-words'>{blog.desc}</p>
        </div>
        <div className='border-grey lg:border-1 lg:pl-4'>
          {postType.type === "thread" && <LabelInputBox text={Strings.selectBoards[lang]} errors={errors.boards} />}
          {postType.type === "upload" && <LabelInputBox text={Strings.selectFolders[lang]} errors={errors.folders} />}
          {postType.type === "thread" && <SelectBox options={boards} onClick={loadBoards} value={blog?.boards ? blog.boards.title : Strings.selectBoards[lang]} onChange={(value) => setBlog({ ...blog, boards: { boardId: value._id, title: value.title, threadsCount: value.threadsCount, answersCount: value.answersCount } })} />}
          {postType.type === "upload" && <SelectBox options={folders} onClick={loadFolders} value={blog?.folders ? blog.folders.title : Strings.selectFolders[lang]} onChange={(value) => setBlog({ ...blog, folders: { folderId: value._id, title: value.title, filesCount: value.filesCount } })} />}

          <LabelInputBox text={Strings.title[lang]} className="mb-2 mt-9" errors={errors.title} />
          <input type="text" placeholder={Strings.enterTitle[lang]} defaultValue={blog.title} className='input-box pl-4' onChange={handleBlogTitleChange} />

          <LabelInputBox text={Strings.shortDesc[lang]} className="mb-2 mt-9" errors={errors.desc} />
          <textarea
            maxLength={charLength}
            placeholder={Strings.enterDesc[lang]}
            defaultValue={blog.desc}
            className='h-40 resize-none leading-7 input-box pl-4'
            onChange={(e) => setBlog({ ...blog, desc: e.target.value })}
            onKeyDown={(e) => {
              if (e.keyCode === 13)
                e.preventDefault()
            }}
          >

          </textarea>
          <p className='mt-1 text-dark-grey text-sm text-right'>
            {charLength - blog.desc.length} {Strings.charsLeft[lang]}
          </p>

          <LabelInputBox text={"Upload Attach"} className="mb-2 mt-9" />
          <FileUploadForm
            hint={`${Strings.maxFilesCount[lang]}: 1; ${Strings.maxSize[lang]}: 80 Mb`}
            multiple={false}
            sendFiles={getFile}
            clearFiles={clearFiles}
          />

          <LabelInputBox text={`${Strings.tags[lang]} ${Strings.tagsInformation[lang]}`} errors={errors.tags} />
          <div className='relative input-box pl-2 py-2 pb-4'>
            <input type="text" placeholder={Strings.enterTags[lang]} onKeyDown={handleTagsKeyDown} className='sticky input-box bg-white top-0 lef0 pl-4 mb-3 focus:bg-white' />
            {
              blog.tags && blog.tags.map((tag, i) => {
                return <Tag key={i} tagIndex={i} tag={tag} />
              })
            }
          </div>
          <p className='mt-1 pt-1 mb-4 text-dark-grey text-sm text-right'>{tagLimit - blog.tags.length} {Strings.tagsLeft[lang]}</p>
          <button onClick={handlePublish} className='btn-dark px-8 '>Publish</button>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm