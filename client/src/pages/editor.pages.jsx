import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useParams, useLocation } from 'react-router-dom'
import BlogEditor from '../components/Editor';
import PublishForm from '../components/Editor/PublishForm';
import Loader from '../components/Loader';
import { StoreContext } from '@/stores/Store';
import BlogEditorSidebar from '@/components/Editor/BlogEditorSidebar';
import { BACKEND, Strings } from '@/support/Constants';
import Errorer from '@/components/Errorer';


const threadEditorStructure = {
  banner: "",
  title: "",
  desc: "",
  body: [],
  tags: [],
  files: []
}
export const EditorContext = createContext({})
const Editor = () => {
  const { user, lang, postType, setPostType } = useContext(StoreContext)

  const { threadId, fileId } = useParams()
  const [blog, setBlog] = useState(threadEditorStructure) //initial state
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false })
  const [loading, setLoading] = useState(true)
  const [noData, setNodata] = useState(false)
  const [noPerm, setNoPerm] = useState(false)
  const [bannerWrapper, setBannerWrapper] = useState(false);
  const [bannerWrapperType, setBannerWrapperType] = useState('banner');
  const location = useLocation().pathname.split('/')[2]

  // console.log(postType)

  const fetchThread = async () => {
    try {
      const data = await fetch(`${BACKEND}/api/thread?threadId=${threadId}`)
      const response = await data.json()

      if (!response.error) {
        // setBlog(response.thread)
        if (user.id === response.thread.author._id || user.role > response.thread.author.role) {
          setBlog(response.thread)
        } else {
          setNoPerm(true)
        }
        setLoading(false)
        setNodata(false)
      } else throw Error(response.error?.message || 'Error')
    } catch (err) {
      setNodata(true)
      setLoading(false)
    }
  }

  const fetchFile = async () => {
    try {
      const data = await fetch(`${BACKEND}/api/file?fileId=${fileId}`)
      const response = await data.json()

      if (!response.error) {
        // setBlog(response.file)
        if (user.id === response.file.author._id || user.role > response.file.author.role) {
          setBlog(response.file)
        } else {
          setNoPerm(true)
        }
        setLoading(false)
        setNodata(false)
      } else throw Error(response.error?.message || 'Error')
    } catch (err) {
      setNodata(true)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!threadId && !fileId) {
      return setLoading(false);
    }

    if (location === 'thread') fetchThread()
    if (location === 'file') fetchFile()
  }, [])

  useEffect(() => {
    if (location === 'file') {
      setPostType({
        type: "fileEdit",
      })
    }

    if (location === 'thread') {
      setPostType({
        type: "threadEdit",
      })
    }
  }, [location])

  // console.log("editor", blog)
  return (
    <EditorContext.Provider value={{
      blog, setBlog,
      editorState, setEditorState,
      textEditor, setTextEditor,
      bannerWrapper, setBannerWrapper, bannerWrapperType, setBannerWrapperType,
      noPerm, setNoPerm
    }}>
      {
        user === null || undefined ? <Navigate to='/login' /> :
          !noData ? loading ? <Loader /> :
            editorState === "editor" ? <BlogEditor /> : <PublishForm /> :
            <Errorer message={Strings.threadNotFound[lang]} />
      }

      <BlogEditorSidebar />
    </EditorContext.Provider>

  )
}

export default Editor