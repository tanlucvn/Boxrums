import { Link } from 'react-router-dom';

export default function Breadcrumbs({ current, links }) {
    return (
        <>
            <nav class="text-sm sm:text-base rounded-md my-5">
                <ol class="list-none p-0 inline-flex space-x-2">
                    {links.map((item, index) => (
                        <li key={index} className="flex items-center">
                            <Link className="text-purple" to={item.link}>{item.title}</Link>
                            <span class="mx-2 text-dark-grey opacity-75">/</span>
                        </li>
                    ))}
                    <li className="flex items-center">
                        <Link className="text-dark-grey opacity-75">{current}</Link>
                    </li>
                </ol>
            </nav>
        </>
    )
}
