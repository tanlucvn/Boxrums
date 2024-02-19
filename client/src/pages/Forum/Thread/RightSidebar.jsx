import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import Loader from '@/components/Loader';

const RightSidebar = ({ headings, loading }) => {
    const [activeHeading, setActiveHeading] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)

    const handleScroll = () => {
        const h1Elements = document.querySelectorAll('h1');

        h1Elements.forEach((h1Element) => {
            const rect = h1Element.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                setActiveHeading(h1Element.id);
            }

        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='sticky border-l border-grey p-10 top-[115px] rounded-2xl shadow-sm bg-grey max-lg:h-full'>
            <p className='text-2xl font-semibold mb-4'>CÁC NỘI DUNG CHÍNH</p>
            <ul className='right-container__text text-dark-grey cursor-pointer mb-4'>
                {loading ? <Loader color='#64707d' /> : headings.map(({ id, text }) => (
                    <li key={id} className={activeHeading === id ? 'text-purple font-bold' : ''}>
                        <ScrollLink to={id} spy={true} smooth={true} offset={-120} duration={500} className='text-xl'>
                            {text}
                        </ScrollLink>
                    </li>
                ))}
            </ul>

            <hr className='mb-4 w-full m-auto bg-dark-grey opacity-20' />

            <div className="about-page">
                <ul className='flex flex-wrap list-none'>
                    <li className='cursor-pointer'>
                        <span className='text-black'>
                            Điều khoản
                        </span>
                        <span>
                            ・
                        </span>
                    </li>
                    <li className='cursor-pointer'>
                        <span className='text-black'>
                            Chính sách riêng tư
                        </span>
                        <span>
                            ・
                        </span>
                    </li>
                    <li className='cursor-pointer'>
                        <span className='text-black'>
                            Cookies
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default RightSidebar;
