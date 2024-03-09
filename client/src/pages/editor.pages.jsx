import React, { createContext, useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import { Navigate, useParams } from 'react-router-dom'
import BlogEditor from '../components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import Loader from '../components/loader.component';
import axios from 'axios';
import { StoreContext } from '@/stores/Store';
import BlogEditorSidebar from '@/components/blog-editor-sidebar';

export const EditorContext = createContext({})
const Editor = () => {
  const { user } = useContext(StoreContext)

  let { threadId } = useParams()
  const [blog, setBlog] = useState({ banner: "", title: "", desc: "", body: [], tags: [], files: [] }) //initial state
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false })
  const [loading, setLoading] = useState(true)
  const [bannerWrapper, setBannerWrapper] = useState(false);
  const [bannerWrapperType, setBannerWrapperType] = useState('banner');
  // console.log(postType)

  useEffect(() => {
    if (!threadId) {
      return setLoading(false);
    }

    /* axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/get-blog', { blog_id, draft: true, mode: 'edit' }).then(({ data: { blog } }) => {
      setBlog(blog)
      setLoading(false)
    })
      .catch(err => {
        setBlog(null)
        setLoading(false)
        console.log(false)
      }) */
  }, [])

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor, bannerWrapper, setBannerWrapper, bannerWrapperType, setBannerWrapperType }}>
      {
        user === null || undefined ? <Navigate to='/register' /> :
          loading ? <Loader /> :
            editorState === "editor" ? <BlogEditor /> : <PublishForm />
      }

      <BlogEditorSidebar />
    </EditorContext.Provider>

  )
}

export default Editor