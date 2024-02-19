import { Link } from 'react-router-dom';
/* import './style.css'; */

export const Section = ({ children }) => {
    return (
        <section className="p-0 my-7">
            {children}
        </section>
    )
}

export const SectionHeader = ({ title, link }) => {
    return link ? (
        <div className="mb-3 flex items-center select-none">
            <p className='text-2xl font-bold select-none'>{title}</p>
            <div className="flex ml-auto">
                <Link to={link.url} className='flex gap-2'>
                    {link.title}
                    <i class="fi fi-rr-angle-small-right"></i>
                </Link>
            </div>
        </div>
    ) : (
        <div className="mb-3">
            <p>{title}</p>
        </div>
    )
}