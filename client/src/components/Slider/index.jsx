import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Strings } from '@/support/Constants';
import { counter, declOfNum } from '@/support/Utils';

/* import './style.css'; */

const ControlledSlider = ({ items, card: Card, ref }) => {
    const slider = useRef()
    const [start, setStart] = useState(true)
    const [end, setEnd] = useState(false)
    const itemWidth = 122

    const handleScroll = ({ target }) => {
        if (target.scrollLeft === 0) {
            setStart(true)
        } else {
            setStart(false)
        }

        if (target.scrollLeft + target.offsetWidth === target.scrollWidth) {
            setEnd(true)
        } else {
            setEnd(false)
        }
    }

    const scrollTo = (width) => {
        slider.current.scrollBy({
            top: 0,
            left: width,
            behavior: 'smooth'
        })
    }

    return (
        <div ref={ref} className="relative">
            <ul
                ref={slider}
                onScroll={handleScroll}
                className="grid grid-cols-6 gap-[8px] p-0 overflow-x-auto overflow-y-hidden"
                style={{ gridTemplateColumns: `repeat(${items.length}, minmax(${itemWidth}px, 1fr))` }}
            >
                <div className={start ? 'boards_slide_nav left-[5px] hidden' : 'boards_slide_nav left-[5px]'} onClick={() => scrollTo(-itemWidth)}>
                    <div className="rounded-full bg-purple w-[25px] h-[25px] flex items-center justify-center cursor-pointer bg-opacity-80">
                        <i class="fi fi-rr-arrow-small-left text-2xl text-white m-[6px_0_0_0]"></i>
                    </div>
                </div>

                {items.map(item => (
                    <Card key={item._id} data={item} />
                ))}

                <div className={end ? 'boards_slide_nav right-[5px] hidden' : 'boards_slide_nav right-[5px]'} onClick={() => scrollTo(itemWidth)}>
                    <div className="rounded-full bg-purple w-[25px] h-[25px] flex items-center justify-center cursor-pointer bg-opacity-80">
                        <i class="fi fi-rr-arrow-small-right text-2xl text-white m-[6px_0_0_2px]"></i>
                    </div>
                </div>
            </ul>
        </div>
    )
}

const PopularBoardsItem = ({ data, lang }) => {
    return (
        <li className="w-[122px] h-[122px] bg-grey snap-center snap-always rounded-xl">
            <Link to={'/board/' + data.name} className="flex flex-col w-full h-full p-3">
                <span className="text-base font-medium overflow-hidden overflow-ellipsis line-clamp-2">{data.title}</span>
                <span className="text-sm">
                    {counter(data.threadsCount)} {declOfNum(data.threadsCount, "thread", "threads", "threads")}
                </span>
            </Link>
        </li>
    )
}

const SlideItem = ({ data }) => {
    return (
        <li className="w-[122px] h-[122px] bg-grey">
            <div className="flex flex-col w-full h-full p-3">
                <span className="text-base font-medium overflow-hidden overflow-ellipsis line-clamp-2">{data.title}</span>
                <span className="text-sm">
                    {counter(data.count)}
                </span>
            </div>
        </li>
    )
}

export { ControlledSlider, PopularBoardsItem, SlideItem };