const SortNav = ({ links, setSort, state }) => {
    return (
        <div className="flex items-center mb-4 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-snap-x mandatory overflow-scrolling-touch">
            {links.map((item, index) => (
                <div
                    key={index}
                    onClick={() => setSort(item.sort)}
                    className={state === item.sort ? 'sort_item bg-black text-white' : 'sort_item'}
                >
                    {item.title}
                </div>
            ))}
        </div>
    )
}

export default SortNav;