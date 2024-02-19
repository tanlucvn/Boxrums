import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'boring-avatars'
import { dateFormat } from '@/support/Utils'

const MinimulBlogPost = ({ data, index }) => {
    /* let {title, blog_id: id, author: {personal_info: {fullname, username, profile_img}}, publishedAt} = blog */

    return (
        <Link to={`/thread/${data._id}`} className='flex gap-5 mb-8'>
            <h1 className='blog-index'>{index < 10 ? "0" + (index + 1) : (index + 1)}</h1>
            <div>
                <div className='flex gap-2 items-center mb-7'>
                    {/* <img src={profile_img} alt={fullname} className='w-6 h-6 rounded-full' /> */}
                    <Avatar
                        size={40}
                        name={data.author.name}
                        variant="marble"
                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
                    <p className='line-clamp-1'>{data.author.displayName} @{data.author.name}</p>
                    <p className='min-w-fit'>{dateFormat(data.createdAt, 'onlyDate')}</p>
                </div>
                <h1 className='blog-title'>{data.title}</h1>
            </div>
        </Link>
    )
}

export default MinimulBlogPost