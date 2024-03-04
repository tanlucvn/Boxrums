import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AttachCard } from '@/components/Card/Card2';

export default function LeftSidebar({ data, likes }) {
    const navigate = useNavigate()
    const vietnameseTime = new Date(data.createdAt).toLocaleString('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
    });

    const calculateReadingTime = (text) => {
        // Bỏ qua Markdown
        // eslint-disable-next-line no-useless-escape
        const plainText = text.replace(/[\*\_]+/g, '');
        const words = plainText.split(/\s+/).filter(word => word !== ''); // Tách văn bản thành từng từ

        const wordsPerMinute = 200; // Số từ trung bình mà người đọc có thể đọc trong 1 phút
        const readingTime = Math.ceil(words.length / wordsPerMinute); // Tính thời lượng đọc (làm tròn lên)

        return readingTime;
    }

    return (
        <div className='sticky border-2 border-grey p-10 top-[115px] text-center rounded-2xl shadow-sm max-lg:h-full'>
            <div className='text-2xl font-semibold mb-4'>
                <i class="fi fi-br-undo pl-3 pr-3 cursor-pointer" onClick={() => navigate(-1)} />
                {data.title}
            </div>

            <div className="text-xs text-dark-grey mb-4">
                {/* <p>Khoảng {calculateReadingTime(data.body)} phút xem</p> */}
                <p>{vietnameseTime}</p>
            </div>

            <hr className='mb-4 w-full m-auto bg-dark-grey opacity-20' />

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
