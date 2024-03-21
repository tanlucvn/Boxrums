import React, { useState, useEffect, useContext } from 'react';
import unsplash from "@/support/unsplashConfig";
import { ImgContext } from '@/support/ImgContext';
import { truncatedTitle } from '@/support/Utils';

const BackgroundTheme = ({ config }) => {
    const { title, author, font, icon, customIcon, platform, bgColor } = config;

    // const [image, setImage] = useState({})

    const [imageList, setImageList] = useState([]);
    const [searchText, setSearchText] = useState('dev');

    const { unsplashImage, setUnsplashImage } = useContext(ImgContext);

    const searchImages = () => {
        unsplash.search
            .getPhotos({
                query: searchText,
                page: 1,
                per_page: 30,
                // orientation:'portrait'
            })
            .then(response => {
                // console.log(response.response.results);
                setImageList(response.response.results)
            });
    }

    useEffect(() => {
        unsplash.search
            .getPhotos({
                query: 'setup',
                page: 1,
                per_page: 30
            })
            .then(response => {
                // console.log(response.response.results);
                setImageList(response.response.results)
            });
    }, [])

    const selectImage = (image) => {
        setUnsplashImage({
            url: image.urls.regular,
            name: image.user.name,
            avatar: image.user.profile_image.small,
            profile: `${image.user.links.html}?utm_source=https://coverview.vercel.app&utm_medium=referral`,
            downloadLink: image.links.download_location
        })
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchImages(searchText);
    }

    return (
        <div className="bg-white rounded flex justify-center">
            <div className={`overflow-y-hidden flex flex-col rounded ${platform}`}
                style={{ backgroundColor: bgColor }}
            >
                <div className="flex flex-row  items-center bg-white justify-center">
                    <div className="w-full overflow-hidden">
                        {unsplashImage ?
                            <div className='relative flex group'>
                                <div className="h-max w-full max-h-[345px] aspect-[2/1]">
                                    <img src={unsplashImage.url && unsplashImage.url} className="object-cover w-full h-full" alt="preview" />
                                </div>

                                <div className="backdrop-blur-sm h-full w-full absolute top-0 right-0 left-0 ">
                                    <button
                                        onClick={() => setUnsplashImage('')}
                                        className="absolute top-2 left-2 cursor-pointer">
                                        <svg className="group-hover:inline-block hidden w-8 h-8 bg-white p-2 rounded-full z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>

                                    <div className={`${font} px-10 text-left rounded-xl h-full p-4 flex flex-col items-center justify-center`}>
                                        <p className="lg:text-4xl text-xl text-center font-bold text-black break-words">{truncatedTitle(title)}</p>
                                        <div className="flex flex-col items-center py-10">

                                            <p className="text-xl font-semibold text-left text-black">{truncatedTitle(author, 50)}</p>
                                            {
                                                customIcon ?
                                                    <div className=" ">
                                                        <img src={customIcon} alt="img" className="w-12 h-12 m-2 rounded-full bg-white border-2 border-white" />
                                                    </div>
                                                    :
                                                    <div className="mr-2 items-center justify-center flex">
                                                        <i className={`devicon-${icon.value}-plain text-black dev-icon text-3xl`}></i>
                                                    </div>
                                            }

                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-4 right-4 opacity-80">
                                    <div className=" group-hover:flex hidden items-center">
                                        <span className="text-sm text-black mx-2">Photo by</span>
                                        <a href={unsplashImage.profile} target="_blank" rel="noreferrer" className="cursor-pointer flex items-center bg-grey rounded-full text-sm">
                                            <img src={unsplashImage.avatar && unsplashImage.avatar} alt={unsplashImage.name} className="h-6 w-6 rounded-full mr-2" />

                                            <span className="pr-2">{unsplashImage.name}</span>
                                        </a>

                                        <a href="https://unsplash.com/?utm_source=https://coverview.vercel.app&utm_medium=referral" className="text-sm text-black mx-2">Unsplash</a>
                                    </div>

                                </div>
                            </div>
                            :
                            <div className="flex flex-col p-2 bg-grey items-center justify-center">
                                <div className="flex items-center w-full px-6">
                                    <div className="text-lg font-semibold">Click on any image to select</div>
                                    <form onSubmit={(e) => handleSearchSubmit(e)} className="ml-auto mr-2 w-1/2 flex rounded-full bg-dark-grey/10 border border-dark-grey/10 mb-2">
                                        <div className="relative w-full">
                                            <input
                                                type="text"
                                                value={searchText}
                                                placeholder="Search image"
                                                className="focus:outline-none w-full text-lg bg-dark-grey/10 py-3 px-4 pr-12 rounded-full border border-dark-grey/10"
                                                onChange={(e) => setSearchText(e.target.value)}
                                            />
                                            <button type="submit" onClick={() => searchImages(searchText)} className="absolute top-0 right-0 flex items-center justify-center w-12 h-full bg-grey hover:bg-gray-800 rounded-full">
                                                <i class="fi fi-rr-search"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="overflow-y-scroll overflow-x-hidden w-full h-96 max-w-5xl pb-10 mx-auto mb-10 gap-5 grid grid-cols-3">
                                    {imageList.map(image => (
                                        <img
                                            src={image.urls.regular}
                                            key={image.id}
                                            alt={image.alt_description}
                                            className="rounded m-2 cursor-pointer w-full object-cover h-40"
                                            onClick={() => selectImage(image)}
                                            loading='lazy'
                                        />
                                    ))}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}

export default BackgroundTheme;