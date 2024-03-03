import React, { useContext, useEffect, useState } from 'react'
import CommentField from './comment-field.component'
import axios from 'axios';
import NoDataMessage from './nodata.component';
import AnimationWrapper from '../common/page-animation';
import CommentCard from './comment-card.component';
import { ThreadContext } from '@/pages/Forum/Thread';
import { Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import { EditorContext } from '@/pages/editor.pages';
import { IconSelectBox, InputBox, InputColor, LabelInputBox } from './Form/Input';
import ComponentToImg from './BannerEditor/ComponentToImg';
import CoverImage from './BannerEditor/CoverImage';
import { ImgProvider } from '@/support/ImgContext'

import theme1 from '@/assets/images/theme1.webp'
import theme2 from '@/assets/images/theme2.webp'
import theme3 from '@/assets/images/theme3.webp'
import theme4 from '@/assets/images/theme4.webp'
import theme5 from '@/assets/images/theme5.webp'
import theme6 from '@/assets/images/theme6.webp'
import theme7 from '@/assets/images/theme7.webp'
import RandomTheme from './BannerEditor/RandomTheme';

const defaultIcon = { 'label': 'react', 'value': 'react' }
const defaultSettings = {
    title: "Type Title Here",
    bgColor: "#ffffff",
    pattern: "",
    download: "PNG",
    author: 'Type Author Here',
    icon: defaultIcon,
    devIconOptions: [defaultIcon],
    font: 'font-Anek',
    theme: 'background',
    customIcon: '',
    platform: 'default'
};
const devIconsUrl = "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json"

const BlogEditorSidebar = () => {
    const { lang } = useContext(StoreContext)
    const { thread, answers, bannerWrapper, setBannerWrapper, bannerWrapperType, setBannerWrapperType } = useContext(EditorContext)
    const [inputData, setInputData] = useState(defaultSettings)

    useEffect(() => {
        if (bannerWrapper) {
            document.body.classList.add('noscroll')
        } else {
            document.body.classList.remove('noscroll')
        }
    }, [bannerWrapper])

    useEffect(() => {
        fetch(devIconsUrl).
            then(r => r.json()).
            then(data => {
                data.push({ name: 'custom' })
                setInputData({ ...inputData, devIconOptions: data.map(item => ({ 'value': item.name, 'label': item.name })) })
            })
    }, [])

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleReset = () => {
        setInputData(defaultSettings);
    };

    const getRandomTheme = (theme, Pattern) => {
        setInputData({ bgColor: theme.bgColor, borderColor: theme.bdColor, pattern: Pattern });
    }

    return (
        <ImgProvider>
            <div
                className={'max-sm:w-full fixed ' + (bannerWrapper ? 'top-0 sm:right-0' : "top-[100%] sm:right-[-100%]") + " duration-700 max-sm:right-0 sm:top-0 w-full h-full z-50 bg-white shadow-2xl p-8 px-7 overflow-y-auto overflow-x-hidden"}
            >
                <div className="relative">
                    <h1 className='text-xl font-medium'>Banner Generate</h1>
                    <p className='text-lg mt-2 w-[70&] text-dark-grey line-clamp-1 '>Ok</p>
                    <button onClick={() => setBannerWrapper(preVal => !preVal)} className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'>
                        <i className='fi fi-rr-cross text-xl mt-1'></i>
                    </button>
                    <hr className='border-grey my-8 w-[120%] -ml-10' />

                    <div class="flex flex-row max-md:flex-col max-md:gap-y-7">
                        <aside class="flex h-full w-[80px] min-w-[80px] flex-col items-center border-x-2 border-grey max-md:border-x-0 max-md:border-y-2 max-md:w-full max-md:items-start">
                            <nav class="flex flex-1 flex-col gap-y-4 pt-10 max-md:flex-row max-md:gap-x-4 max-md:pt-0 max-md:my-5">
                                <button onClick={() => setBannerWrapperType("banner")} class="relative flex justify-center items-center w-12 h-12 rounded-full bg-grey group">
                                    <i class="fi fi-rr-edit text-xl mt-1"></i>

                                    <div class="absolute inset-y-0 left-[65px] hidden items-center group-hover:flex z-10">
                                        <div class="relative whitespace-nowrap rounded-md bg-grey px-4 py-2 text-sm font-semibold">
                                            <div class="absolute inset-0 -left-1 flex items-center">
                                                <div class="h-2 w-2 rotate-45 bg-grey"></div>
                                            </div>
                                            Editor <span class="text-black">(Y)</span>
                                        </div>
                                    </div>
                                </button>

                                <button onClick={() => setBannerWrapperType("theme")} class="relative flex justify-center items-center w-12 h-12 rounded-full bg-grey group">
                                    <i class="fi fi-rr-palette text-xl mt-1"></i>

                                    <div class="absolute inset-y-0 left-[65px] hidden items-center group-hover:flex z-10">
                                        <div class="relative whitespace-nowrap rounded-md bg-grey px-4 py-2 text-sm font-semibold">
                                            <div class="absolute inset-0 -left-1 flex items-center">
                                                <div class="h-2 w-2 rotate-45 bg-grey"></div>
                                            </div>
                                            Editor <span class="text-black">(Y)</span>
                                        </div>
                                    </div>
                                </button>
                            </nav>
                        </aside>

                        <section className='p-0 px-10 w-full max-md:p-0'>
                            {/* BANNER */}
                            {bannerWrapperType === 'banner' ?
                                <div className='flex flex-row gap-7 justify-between max-md:flex-col'>
                                    <div className='basis-1/4'>
                                        <LabelInputBox text={"Title"} />
                                        <InputBox name='title' type='text' placeholder='Enter title here' value={inputData.title} onChange={handleInputChange} />

                                        <LabelInputBox text={"Author"} />
                                        <InputBox name='author' type='text' placeholder='Enter author here' value={inputData.author} onChange={handleInputChange} />

                                        <LabelInputBox text={"Icon"} />
                                        <IconSelectBox value={inputData.icon} iconOptions={inputData.devIconOptions} onSelect={(e) => setInputData({ ...inputData, icon: { label: e.label, value: e.value } })} />

                                        {/* <LabelInputBox text={"Platform"} />
                                        <select
                                            name="platform"
                                            onChange={handleInputChange}
                                            value={inputData.platform}
                                            className="select-box">
                                            <option>default</option>
                                            <option>hashnode</option>
                                            <option>dev</option>
                                        </select> */}

                                        <LabelInputBox text={"Color"} />
                                        <InputColor onChange={(e) => setInputData({ ...inputData, bgColor: e })} />
                                        <button onClick={handleReset} className='btn-dark mt-5'>Reset All</button>
                                    </div>

                                    <div className='basis-3/4'>
                                        <ComponentToImg downloadAs={inputData.download}>
                                            <CoverImage {...inputData} />
                                        </ComponentToImg>
                                    </div>
                                </div> :
                                <>
                                    <div className="flex items-center border rounded-xl border-gray-50 px-4">
                                        <h2 className="text-lg pl-2 font-inter font-semibold">Themes</h2>
                                        <div className="ml-auto mr-1 p-2">
                                            <RandomTheme onThemeChange={getRandomTheme} />

                                        </div>
                                    </div>

                                    <div className="p-4 flex flex-wrap overflow-y-scroll gap-3 justify-center">
                                        <img src={theme1} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "basic" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />

                                        <img src={theme2} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "modern" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />

                                        <img src={theme3} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "stylish" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />

                                        <img src={theme5} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "outline" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />

                                        <img src={theme4} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "preview" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />

                                        <img src={theme6} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "mobile" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />

                                        <img src={theme7} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "background" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300"
                                        />
                                    </div>

                                </>
                            }
                        </section>
                    </div>
                </div>
            </div>
        </ImgProvider>
    )
}

export default BlogEditorSidebar