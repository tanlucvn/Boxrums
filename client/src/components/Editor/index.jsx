import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import bgBannerLightEN from '@/assets/images/bgBanner-light-en.png'
import bgBannerDarkEN from '@/assets/images/bgBanner-dark-en.png'
import bgBannerLightVI from '@/assets/images/bgBanner-light-vi.png'
import bgBannerDarkVI from '@/assets/images/bgBanner-dark-vi.png'
import AnimationWrapper from '@/common/page-animation'
import lightBanner from '@/imgs/blog banner light.png'
import darkBanner from '@/imgs/blog banner dark.png'

import { Toaster, toast } from 'react-hot-toast'
import { EditorContext } from '../../pages/editor.pages'
import EditorJS from '@editorjs/editorjs'
import { tools } from '@/components/tools.component'
import { uploadImage } from '@/common/cloudinary'
import { ThemeContext } from '@/App'
import { StoreContext } from '@/stores/Store'
import { Strings } from '@/support/Constants'
import { truncatedTitle } from '@/support/Utils'
import Errorer from '@/components/Errorer'
import Loader from '../Loader'

const BlogEditor = () => {
    const { theme } = useContext(ThemeContext)
    const { token, lang, postType, setPostType } = useContext(StoreContext)
    const { blog, setBlog, textEditor, setTextEditor, setEditorState, setBannerWrapper, bannerWrapperType, setBannerWrapperType, noPerm } = useContext(EditorContext)
    const [isTextareaFocused, setIsTextareaFocused] = useState(false);
    const [titleLoading, setTitleLoading] = useState(false);
    const [bodyLoading, setBodyLoading] = useState(false);
    const fullLang = lang === "vi" ? "Vietnamese" : "English"
    const [editorReady, setEditorReady] = useState(false);
    const textareaRef = useRef(null)
    const editorRef = useRef()

    useEffect(() => {
        if (!editorRef.current || editorReady) return;

        setTextEditor(new EditorJS({
            holder: "textEditor",
            data: blog.body[0] ? blog.body[0] : blog.body,
            tools: tools,
            placeholder: Strings.letsWrite[lang],
            onReady: () => {
                setEditorReady(true);
            }
        }));
    }, [editorReady]);

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
                    case "light": return <img src={blog?.banner ? blog.banner : bgBannerLightEN} alt="Default Banner" className='z-20' onError={handleError} />
                    case "dark": return <img src={blog?.banner ? blog.banner : bgBannerDarkEN} alt="Default Banner" className='z-20' onError={handleError} />
                    case "default": return <img src={blog?.banner ? blog.banner : bgBannerDarkEN} alt="Default Banner" className='z-20' onError={handleError} />
                }
            }
            case "vi": {
                switch (theme) {
                    case "light": return <img src={blog?.banner ? blog.banner : bgBannerLightVI} alt="Default Banner" className='z-20' onError={handleError} />
                    case "dark": return <img src={blog?.banner ? blog.banner : bgBannerDarkVI} alt="Default Banner" className='z-20' onError={handleError} />
                    case "default": return <img src={blog?.banner ? blog.banner : bgBannerDarkVI} alt="Default Banner" className='z-20' onError={handleError} />
                }
            }
            case "default": return <img src={blog?.banner ? blog.banner : bgBannerLightEN} alt="Default Banner" className='z-20' onError={handleError} />
        }
    }

    const parseHtmlToBlocks = (htmlData) => {
        const blocks = [];

        // Tạo một thẻ div ẩn để chứa nội dung HTML và trích xuất các phần tử con
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlData;

        // Lặp qua từng phần tử con và xác định loại block tương ứng
        tempDiv.childNodes.forEach(node => {
            if (node.nodeName === 'H1' || node.nodeName === 'H2' || node.nodeName === 'H3' || node.nodeName === 'H4' || node.nodeName === 'H5' || node.nodeName === 'H6') {
                // Tiêu đề
                blocks.push({
                    type: 'header',
                    data: {
                        text: node.textContent.trim(), // Lấy nội dung của tiêu đề và loại bỏ khoảng trắng thừa
                        level: parseInt(node.nodeName.substring(1)) // Xác định cấp độ của tiêu đề dựa trên nodeName (ví dụ: H1, H2, ...)
                    }
                });
            } else if (node.nodeName === 'P') {
                // Đoạn văn
                blocks.push({
                    type: 'paragraph',
                    data: {
                        text: node.innerHTML.trim() // Lấy nội dung của đoạn văn và loại bỏ khoảng trắng thừa
                    }
                });
            } else if (node.nodeName === 'A') {
                // Liên kết
                blocks.push({
                    type: 'linkTool',
                    data: {
                        text: node.textContent.trim(), // Lấy nội dung của liên kết và loại bỏ khoảng trắng thừa
                        link: node.getAttribute('href') // Lấy đường dẫn của liên kết
                    }
                });
            } else if (node.nodeName === 'BLOCKQUOTE') {
                // Trích dẫn
                blocks.push({
                    type: 'quote',
                    data: {
                        text: node.innerHTML.trim() // Lấy nội dung của trích dẫn và loại bỏ khoảng trắng thừa
                    }
                });
            }
        });

        return blocks;
    };

    const AIWritingTitle = async () => {
        try {
            setTitleLoading(true)

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
        } finally {
            setTitleLoading(false)
        }
    }

    const AIWritingBody = async () => {
        if (!blog.title) return toast.error(Strings.enterTopic[lang])

        try {
            setBodyLoading(true)

            const response = await fetch('https://typli.ai/api/completion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: lang === "vi" ?
                        `Bạn là một trợ lý viết blogs hữu ích có thể viết các bài viết thân thiện với SEO dưới dạng thẻ html.
                        Hãy viết bài viết theo dạng nói chuyện.
                        Giữ đoạn văn trong khoảng 2 câu tối đa và súc tích.
                        Tránh sử dụng từ vựng hoặc thuật ngữ quá phức tạp trừ khi cần thiết cho chủ đề.
                        Nhớ viết theo định dạng thẻ html và chỉ bao gồm thẻ tiêu đề <h1> <h2> <h3>, <b> hoặc <i>, <blockquote>, <p>, statistics (chỉ sử dụng thống kê được xác minh, không làm bất cứ điều gì lên), và liên kết đến các bài viết bên ngoài khi cần thiết.
                        Hãy nhớ là viết một bài viết khoảng 900 từ trong định dạng html về ${blog.title} theo phong cách viết Blog Article và không bao gồm đưa hình ảnh trong đầu ra.` :
                        `You are a helpful blog assistant capable of writing SEO-friendly articles in HTML format.
                        Write articles in a conversational tone.
                        Keep paragraphs concise, with a maximum of 2 sentences.
                        Avoid using overly complex vocabulary or terminology unless necessary for the topic.
                        Remember to write in HTML format and only include <h1>, <h2>, <h3>, <b>, or <i> tags, <blockquote>, <p>, statistics (using verified data only, no fabrications), and links to external articles when necessary.
                        Remember to write an approximately 900-word article in HTML format about ${blog.title} in the style of a Blog Article and exclude including images in the output.`,
                    temperature: 1.2
                })
            });

            const htmlData = await response.text();

            if (htmlData && textEditor.isReady) {
                // Phân tích dữ liệu markdown thành các block và đặt vào Editor.js
                textEditor.render({
                    blocks: parseHtmlToBlocks(htmlData)
                }).then(() => {
                    // console.log('Markdown content set successfully');
                }).catch((error) => {
                    // console.error('Setting markdown content failed: ', error);
                });
            }
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setBodyLoading(false)
        }
    }

    const publishThread = () => {
        if (!blog.title)
            return toast.error(Strings.writeTitle[lang])

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, body: data })
                    setEditorState("publish")
                }
                else {
                    return toast.error(Strings.writeContent[lang])
                }
            })
                .catch((err) => {
                    toast.error(err)
                })
        }
    }

    // console.log(blog)
    // console.log(loading)
    // console.log("blog.body", blog.body)

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
                    {blog.title ? truncatedTitle(blog.title, 30) : postType.type === 'thread' ? "New Blog" : "New File"}
                </p>
                <div className='flex gap-4 ml-auto'>
                    {
                        !noPerm ?
                            <button className='btn-dark py-2 ' onClick={publishThread}>{Strings.next[lang]}</button> :
                            <Link to="/" className='btn-dark py-2 '>{Strings.back[lang]}</Link>
                    }
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    {!noPerm ? <div className='mx-auto max-w-[900px] w-full'>
                        <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey group'>
                            <label htmlFor="uploadBanner">
                                {showBanner()}

                                <input type="file" id='uploadBanner' accept='.png, .jpg, .jpeg' hidden onChange={handleChangeBanner} />

                                {!blog.banner ?
                                    <button className='btn-dark absolute py-2 bottom-0 right-0 m-7 hidden group-hover:block' onClick={() => setBannerWrapper(true)}>
                                        {Strings.generateBanner[lang]}
                                    </button> :
                                    <button className='btn-light absolute py-2 bottom-0 right-0 m-7 hidden text-red bg-red/20 group-hover:block' onClick={() => setBlog({ ...blog, banner: "" })}>
                                        {Strings.delete[lang]}
                                    </button>
                                }
                            </label>
                        </div>

                        {/* TITLE */}
                        {!titleLoading ?
                            <textarea
                                defaultValue={blog?.title ? blog.title : ''}
                                placeholder={Strings.title[lang]}
                                className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white'
                                onKeyDown={handleTitleKeyDown}
                                onChange={handleTitleChange}
                                onFocus={() => setIsTextareaFocused(true)}
                                ref={textareaRef}
                            >
                            </textarea> : <Loader />
                        }

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

                        {blog.title &&
                            <div className='flex gap-5 items-center justify-end'>
                                <button
                                    className="flex items-center justify-center font-medium gap-3 border-2 border-grey my-5 px-4 py-2 w-max min-w-[20px] h-9 text-black bg-transparent text-sm rounded-md cursor-pointer select-none"
                                    onClick={() => {
                                        AIWritingBody()
                                    }}
                                    title={Strings.aiWriter[lang]}
                                >
                                    <i className="fi fi-rr-magic-wand"></i>
                                    <p>{Strings.aiWriter[lang]}</p>
                                </button>
                            </div>}

                        {/* BODY */}
                        {bodyLoading && <Loader />}
                        <div id="textEditor" ref={editorRef}>
                        </div>
                    </div> :
                        <>
                            <Errorer message={"You dont have permissions"} />
                        </>
                    }
                </section>
            </AnimationWrapper>

            <Toaster />
        </>
    )
}

export default BlogEditor