import { dateFormat } from '@/support/Utils';

export const UserRole = ({ role }) => {
    return (
        <>
            {role === 3 && (
                <span class="inline-flex items-center justify-center w-6 h-6 me-2 text-sm mx-2 font-semibold text-[#ffffff]] bg-red rounded-full light:text-[#ffffff]">
                    <i class="fi fi-rr-chess-king text-sm"></i>
                </span>

            )}
            {role === 2 && (
                <span className="user_status ic mod">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <path d="M 21 3 C 20.706 3 20.427 3.129 20.236 3.354 L 9.48 16.066 L 8.707 15.293 C 8.519 15.099 8.26 14.99 7.99 14.99 C 7.22 14.99 6.739 15.824 7.125 16.491 C 7.17 16.57 7.227 16.643 7.293 16.707 L 8.209 17.623 L 4.988 21.574 L 4.707 21.293 C 4.519 21.099 4.26 20.99 3.99 20.99 C 3.22 20.99 2.739 21.824 3.125 22.491 C 3.17 22.57 3.227 22.643 3.293 22.707 L 7.293 26.707 C 7.826 27.262 8.761 27.032 8.975 26.293 C 9.078 25.936 8.975 25.551 8.707 25.293 L 8.426 25.012 L 12.377 21.791 L 13.293 22.707 C 13.826 23.262 14.761 23.032 14.975 22.293 C 15.078 21.936 14.975 21.551 14.707 21.293 L 13.934 20.52 L 26.646 9.764 C 26.871 9.573 27 9.294 27 9 L 27 4 C 27 3.448 26.552 3 26 3 L 21 3 Z" />
                    </svg>
                </span>
            )}
        </>
    )
}

export const UserStatus = ({ status }) => {
    return (
        <>
            {status === 'ban' && (
                <span className="user_status ban">ban</span>
            )}
            {status === 'owner' && (
                <span className="user_status">owner</span>
            )}
        </>
    )
}

export const UserOnline = ({ onlineAt, dot, offlineText = '', dateType = 'full' }) => {
    const onlineDuration = 5 * 60000 // 5 minutes
    if (offlineText) {
        offlineText = offlineText + ' '
    }

    return dot ? (
        new Date() - new Date(onlineAt) < onlineDuration && <span className="online" title="online" />
    ) : (
        new Date() - new Date(onlineAt) < onlineDuration ? 'online' : offlineText + dateFormat(onlineAt, dateType)
    )
}