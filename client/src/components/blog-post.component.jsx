import React from 'react'
import { counter, dateFormat, declOfNum } from '@/support/Utils'
import Avatar from 'boring-avatars'
import { Strings } from '@/support/Constants'

const BlogPostCard = ({ data, lang }) => {
    return (
        <a href={`/thread/${data._id}`} className='flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:opacity-80'>
            <div className='w-full'>
                <div className='flex gap-2 items-center mb-7'>
                    <div className="w-6 h-6">
                        <Avatar
                            size={"100%"}
                            name={data.author.name}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                        />
                    </div>
                    <p className='line-clamp-1'>{data.author.displayName} @{data.author.name}</p>
                    <p className='min-w-fit'>{dateFormat(data.createdAt)}</p>
                </div>
                <h1 className='blog-title'>{data.title}</h1>
                <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{data.body}</p>
                <div className='flex gap-4 mt-7'>
                    {/* <span className='btn-light py-1 px-4'>{tags[0]}</span> */}
                    <span className='ml-3 flex items-center gap-2 text-dark-grey'>
                        <i className='fi fi-rr-heart text-xl'></i>{counter(data.likes ? data.likes.length : 0)} {declOfNum(data.likes ? data.likes.length : 0, Strings.like[lang], Strings.likes[lang])}
                    </span>
                </div>
            </div>
            <div className='h-28 aspect-square bg-grey'>
                {
                    data.banner ? <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
                        <Avatar
                            size={"100%"}
                            name={data.title}
                            variant="marble"
                            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                            square="true"
                        />
                }
            </div>
        </a>
    )
}

export default BlogPostCard