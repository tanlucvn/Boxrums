import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import bgBannerLightEN from '@/assets/images/bgBanner-light-en.png'
import bgBannerDarkEN from '@/assets/images/bgBanner-dark-en.png'
import bgBannerLightVI from '@/assets/images/bgBanner-light-vi.png'
import bgBannerDarkVI from '@/assets/images/bgBanner-dark-vi.png'
import darkLogo from '../imgs/logo-dark.png'
import AnimationWrapper from '../common/page-animation'
import lightBanner from '../imgs/blog banner light.png'
import darkBanner from '../imgs/blog banner dark.png'

import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../pages/editor.pages'
import EditorJS from '@editorjs/editorjs'
import { tools } from './tools.component'
import { uploadImage } from '../common/cloudinary'
import axios from 'axios'
import { ThemeContext, UserContext } from '../App'
import BlogEditorSidebar from './blog-editor-sidebar'
import { StoreContext } from '@/stores/Store'
import { BACKEND, Strings } from '@/support/Constants'
import { truncatedTitle } from '@/support/Utils'
import { SelectBox } from './Form/Input'

const BlogEditor = () => {
    const { threadId } = useParams()
    const navigate = useNavigate()
    // const { userAuth: { access_token } } = useContext(UserContext)

    const { theme } = useContext(ThemeContext)
    const { token, lang } = useContext(StoreContext)
    const { blog, setBlog, textEditor, setTextEditor, setEditorState, setBannerWrapper, bannerWrapperType, setBannerWrapperType } = useContext(EditorContext)
    const [boards, setBoards] = useState([])
    const [isTextareaFocused, setIsTextareaFocused] = useState(false);
    const fullLang = lang === "vi" ? "Vietnamese" : "English"
    const textareaRef = useRef(null)

    const content = ""

    useEffect(() => {
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holderId: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                tools: tools,
                placeholder: "Let's write an awesome story"
            }))
        }
    }, [])
    const handleChangeBanner = (e) => {
        if (e.target.files[0]) {
            let ladingTast = toast.loading('Uploading...')
            uploadImage(e.target.files[0]).then((url) => {
                toast.dismiss(ladingTast)
                toast.success("Uploaded Successfully")
                setBlog({ ...blog, banner: url })
            }).catch(err => {
                toast.dismiss(ladingTast)
                toast.error(err)

            })
        }
    }

    const handleTitleKeyDown = (e) => {
        // for enter key
        if (e.keyCode === 13)
            e.preventDefault()
    }

    const handleTitleChange = (e) => {
        setBlog({ ...blog, title: e.target.value })
        const input = e.target
        input.style.height = 'auto'
        input.style.height = input.scrollHeight + 'px'
    }

    const handleError = (e) => {
        const img = e.target
        img.src = theme == 'light' ? lightBanner : darkBanner;
    }

    const showBanner = () => {
        switch (lang) {
            case "en": {
                switch (theme) {
                    case "light": return <img src={blog.banner ? blog.banner : bgBannerLightEN} alt="Default Banner" className='z-20' onError={handleError} />
                    case "dark": return <img src={blog.banner ? blog.banner : bgBannerDarkEN} alt="Default Banner" className='z-20' onError={handleError} />
                    case "default": return <img src={blog.banner ? blog.banner : bgBannerDarkEN} alt="Default Banner" className='z-20' onError={handleError} />
                }
            }
            case "vi": {
                switch (theme) {
                    case "light": return <img src={blog.banner ? blog.banner : bgBannerLightVI} alt="Default Banner" className='z-20' onError={handleError} />
                    case "dark": return <img src={blog.banner ? blog.banner : bgBannerDarkVI} alt="Default Banner" className='z-20' onError={handleError} />
                    case "default": return <img src={blog.banner ? blog.banner : bgBannerDarkVI} alt="Default Banner" className='z-20' onError={handleError} />
                }
            }
            case "default": return <img src={blog.banner ? blog.banner : bgBannerLightEN} alt="Default Banner" className='z-20' onError={handleError} />
        }
    }

    const AIWritingTitle = async () => {
        try {
            const response = await fetch('https://typli.ai/api/completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: `You are Typli, an AI Blog Title Generator. You generate very creative and unique titles for blogs. Generate one very unique and creative blog titles and return to ${fullLang} languages. Here is a description of the title for blog:\n\n${blog.title}`, temperature: 1.2 })
            });
            const data = await response.text();
            if (data) {
                setBlog({ ...blog, title: data })
                setIsTextareaFocused(true);
                textareaRef.current.value = data.replace(/[^a-zA-Z\sÀ-ÖÔÕƠà-öôõơẠ-ỹạ-ỹĂ-ỹĨ-ỹĩ-ỹĀ-ỹā-ỹĂ-ỹă-ỹĐđ-ỹ0-9]/g, '');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const loadBoards = () => {
        if (boards.length) return

        fetch(`${BACKEND}/api/boards?pagination=true`)
            .then(response => response.json())
            .then(data => {
                if (data.docs?.length) {
                    setBoards(data.docs)
                } else throw Error(Strings.boardsNotLoaded[lang])
            })
            .catch(err => {
                setErrors({ general: err.message === '[object Object]' ? 'Error' : err.message })
            })
    }

    const publishThread = () => {
        if (!blog.banner) {
            return toast.error("Upload a blog banner to publish it")
        }
        if (!blog.title)
            return toast.error("Write blog title to publis it")

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, body: data })
                    setEditorState("publish")
                }
                else {
                    return toast.error("Write Something in your blog to publish it")
                }
            })
                .catch((err) => {
                    toast.error(err)
                })
        }
    }

    // console.log(blog)

    return (
        <>
            <nav className='navbar'>
                <Link to={'/'} className='flex-none w-10'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 612 684" className={`w-10 ${theme === 'dark' ? 'opacity-90' : 'opacity-80'}`}>
                        <path fill={theme === 'dark' ? '#916bc2' : '#000'} d="M305.7 0L0 170.9v342.3L305.7 684 612 513.2V170.9L305.7 0z" />
                        <path fill="#fff" d="M305.7 80.1l-233.6 131 233.6 131 234.2-131-234.2-131" />
                    </svg>
                </Link>
                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {blog.title ? truncatedTitle(blog.title, 30) : "New Blog"}
                </p>
                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2 ' onClick={publishThread}>Publish</button>
                    <button className='btn-light py-2' /* onClick={handleSaveDraft} */>Save Draft</button>
                </div>
            </nav>
            <Toaster />
            <AnimationWrapper>
                <section>
                    <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey group'>
                            <label htmlFor="uploadBanner">
                                {showBanner()}
                                {/* {blog.banner &&
                                    <button class="absolute w-10 h-10 flex items-center justify-center top-5 left-5 bg-grey rounded-full cursor-pointer z-30" onClick={() => setBlog({ ...blog, banner: "" })}>
                                        <i class="fi fi-rr-cross-small text-2xl mt-2"></i>
                                    </button>
                                } */}

                                <input type="file" id='uploadBanner' accept='.png, .jpg, .jpeg' hidden onChange={handleChangeBanner} />

                                <button className='btn-light absolute py-2 bottom-0 right-0 m-7 hidden group-hover:block' onClick={() => setBannerWrapper(true)}>
                                    Generate Banner
                                </button>
                            </label>
                        </div>

                        <SelectBox options={boards} className="mt-5 bg-white" onClick={loadBoards} value={blog?.boards ? blog.boards.title : Strings.selectBoards[lang]} onChange={(value) => setBlog({ ...blog, boards: { boardId: value._id, title: value.title, threadsCount: value.threadsCount, answersCount: value.answersCount } })} />


                        {/* ============= TITLE ============= */}
                        <textarea
                            defaultValue={blog.title ? blog.title : ''}
                            placeholder='Blog Title'
                            className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                            onFocus={() => setIsTextareaFocused(true)}
                            ref={textareaRef}
                        >
                        </textarea>

                        {isTextareaFocused &&
                            <div className='flex gap-10 items-center justify-end'>
                                <button
                                    className="flex items-center justify-center font-medium gap-3 border-2 border-grey my-5 px-4 py-2 w-max min-w-[20px] h-9 text-black bg-transparent text-sm rounded-md cursor-pointer select-none"
                                    onClick={() => {
                                        AIWritingTitle()
                                        setIsTextareaFocused(true)
                                        textareaRef.current.focus();
                                    }}
                                    title={Strings.aiWriter[lang]}
                                >
                                    <i className="fi fi-rr-magic-wand"></i>
                                    <p>{Strings.aiWriter[lang]}</p>
                                </button>

                                <button class="w-10 h-10 flex items-center justify-center text-red bg-red/20 rounded-full cursor-pointer" onClick={() => setIsTextareaFocused(false)}>
                                    <i class="fi fi-rr-cross-small text-2xl mt-2"></i>
                                </button>
                            </div>
                        }


                        <hr className='w-full opacity-10 my-5' />

                        <div id="textEditor">
                        </div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    )
}

export default BlogEditor