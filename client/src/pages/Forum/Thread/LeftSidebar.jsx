import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AttachCard } from '@/components/Card/Card2';
import { dateFormat } from '@/support/Utils';
import Loader from '@/components/loader.component';

export default function LeftSidebar({ data, likes }) {
    const navigate = useNavigate()

    return (
        <div className='sticky border-2 border-grey p-10 top-[115px] text-center rounded-2xl shadow-sm max-lg:h-full'>
            <div className='text-2xl font-semibold mb-4'>
                <i class="fi fi-br-undo pl-3 pr-3 cursor-pointer" onClick={() => navigate(-1)} />
                {data.title}
            </div>

            <div className="text-xs text-dark-grey mb-4">
                <p>{data.desc}</p>
            </div>

            <div className="text-xs text-dark-grey mb-4">
                <p>{dateFormat(data.createdAt)}</p>
            </div>

            <hr className='mb-4 w-full m-auto bg-dark-grey opacity-20' />

            <div className="flex gap-3 flex-wrap">
                {!data ? <Loader /> : data.tags.slice(0, 5).map((tag, i) => (
                    <button onClick={() => loadBlogbyCategory(tag)} key={i} className="tag m-auto">
                        {tag}
                    </button>
                ))}

            </div>

            {data.attach &&
                <div>
                    <p className='text-dark-grey text-sm'>Tệp đính kèm</p>
                    <p className='text-dark-grey text-sm mb-4'>(Nhấp để tải xuống)</p>
                </div>
            }
            <AttachCard data={data} resized="true" />
        </div>
    )
}
