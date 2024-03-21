import React, { useContext, useEffect, useState } from 'react'
import { Strings } from '@/support/Constants';
import { StoreContext } from '@/stores/Store';
import { EditorContext } from '@/pages/editor.pages';
import { IconSelectBox, InputBox, InputColor, LabelInputBox } from '../Form/Input';
import ComponentToImg from '../BannerEditor/ComponentToImg';
import CoverImage from '../BannerEditor/CoverImage';
import { ImgProvider } from '@/support/ImgContext'

import bgThemeBasicDark from '@/assets/images/bgTheme-basic-dark.png'
import bgThemeBasicLight from '@/assets/images/bgTheme-basic-light.png'
import bgThemeBackgroundDark from '@/assets/images/bgTheme-background-dark.png'
import bgThemeBackgroundLight from '@/assets/images/bgTheme-background-light.png'
import bgThemeModernDark from '@/assets/images/bgTheme-modern-dark.png'
import bgThemeModernLight from '@/assets/images/bgTheme-modern-light.png'
import bgThemeStylishDark from '@/assets/images/bgTheme-stylish-dark.png'
import bgThemeStylishLight from '@/assets/images/bgTheme-stylish-light.png'
import bgThemeOutlineDark from '@/assets/images/bgTheme-outline-dark.png'
import bgThemeOutlineLight from '@/assets/images/bgTheme-outline-light.png'
import bgThemePreviewDark from '@/assets/images/bgTheme-preview-dark.png'
import bgThemePreviewLight from '@/assets/images/bgTheme-preview-light.png'
import bgThemeMobileDark from '@/assets/images/bgTheme-mobile-dark.png'
import bgThemeMobileLight from '@/assets/images/bgTheme-mobile-light.png'

import RandomTheme from '../BannerEditor/RandomTheme';

const defaultIcon = { 'label': 'react', 'value': 'react' }
const defaultSettings = {
    title: "Boxrums",
    bgColor: "#ffffff",
    pattern: "",
    download: "PNG",
    author: 'A Forum Website',
    icon: defaultIcon,
    devIconOptions: [defaultIcon],
    font: 'font-worksans',
    theme: 'background',
    customIcon: '',
    platform: 'default'
};
const devIconsUrl = "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json"

const BlogEditorSidebar = () => {
    const { theme, lang } = useContext(StoreContext)
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
                                            {Strings.edit[lang]}
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
                                            {Strings.themes[lang]}
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
                                        <LabelInputBox text={Strings.title[lang]} />
                                        <InputBox name='title' type='text' placeholder={Strings.enterTitle[lang]} value={inputData.title} onChange={handleInputChange} />

                                        <LabelInputBox text={Strings.authorOrSubtitle[lang]} />
                                        <InputBox name='author' type='text' placeholder={Strings.enterAuthorOrSubtitle[lang]} value={inputData.author} onChange={handleInputChange} />

                                        <LabelInputBox text={Strings.icon[lang]} />
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

                                        <LabelInputBox text={Strings.colorBackground[lang]} />
                                        <InputColor onChange={(e) => setInputData({ ...inputData, bgColor: e })} />
                                        <button onClick={handleReset} className='btn-dark mt-5'>{Strings.resetAll[lang]}</button>
                                    </div>

                                    <div className='basis-3/4'>
                                        <ComponentToImg downloadAs={inputData.download} lang={lang}>
                                            <CoverImage {...inputData} />
                                        </ComponentToImg>
                                    </div>
                                </div> :
                                <>
                                    <div className="flex items-center border-2 rounded-xl border-grey px-4">
                                        <h2 className="text-lg pl-2 font-inter font-semibold">{Strings.themes[lang]}</h2>
                                        {/* <div className="ml-auto mr-1 p-2">
                                            <RandomTheme onThemeChange={getRandomTheme} />
                                        </div> */}
                                    </div>

                                    <div className="p-4 flex flex-wrap overflow-y-scroll gap-3 justify-center">
                                        <img src={theme === "light" ? bgThemeBasicLight : bgThemeBasicDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "basic" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
                                        />

                                        <img src={theme === "light" ? bgThemeModernLight : bgThemeModernDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "modern" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
                                        />

                                        <img src={theme === "light" ? bgThemeStylishLight : bgThemeStylishDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "stylish" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
                                        />

                                        <img src={theme === "light" ? bgThemeOutlineLight : bgThemeOutlineDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "outline" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
                                        />

                                        <img src={theme === "light" ? bgThemePreviewLight : bgThemePreviewDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "preview" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
                                        />

                                        <img src={theme === "light" ? bgThemeMobileLight : bgThemeMobileDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "mobile" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
                                        />

                                        <img src={theme === "light" ? bgThemeBackgroundLight : bgThemeBackgroundDark} alt="basic theme"
                                            onClick={(e) => setInputData({ ...inputData, theme: "background" })}
                                            className="cursor-pointer basis-1/4 rounded-xl hover:scale-90 duration-300 object-cover border-2 border-grey"
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