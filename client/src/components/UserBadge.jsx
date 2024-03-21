import { useContext } from 'react';
import { Strings } from '@/support/Constants';
import { dateFormat } from '@/support/Utils';
import { StoreContext } from '@/stores/Store';

export const UserRole = ({ role }) => {
    const { lang } = useContext(StoreContext)
    return (
        <>
            {role === 3 && (
                <span class="bg-red/20 text-black text-sm font-medium px-2.5 py-0.5 rounded-full ml-2">
                    {Strings.admins[lang]}
                </span>

            )}
            {role === 2 && (
                <span class="bg-purple/20 text-black text-sm font-medium px-2.5 py-0.5 rounded-full ml-2">
                    {Strings.moderator[lang]}
                </span>
            )}
        </>
    )
}

export const UserStatus = ({ status, lang }) => {
    return (
        <>
            {status === 'ban' && (
                <span class="bg-red/20 text-red text-sm font-medium px-2.5 py-0.5 rounded-full ml-2">
                    {Strings.banned[lang]}
                </span>
            )}
            {status === 'owner' && (
                <span class="bg-purple/20 text-purple text-sm font-medium px-2.5 py-0.5 rounded-full ml-2">
                    {Strings.owner[lang]}
                </span>
            )}
        </>
    )
}

export const UserOnline = ({ onlineAt, dot, offlineText = '', dateType = 'full' }) => {
    const { lang } = useContext(StoreContext)

    const onlineDuration = 5 * 60000 // 5 minutes
    if (offlineText) {
        offlineText = offlineText + ' '
    }

    return dot ? (
        new Date() - new Date(onlineAt) < onlineDuration &&
        <span class="flex items-center gap-1 bg-green/20 text-green text-sm font-medium px-2.5 py-0.5 rounded-full w-fit">
            <i class="fi fi-sr-bullet mt-[6px]"></i>
        </span>
    ) : (
        new Date() - new Date(onlineAt) < onlineDuration ?
            <span class="flex items-center gap-1 text-green text-sm font-medium w-fit">
                <i class="fi fi-sr-bullet mt-1"></i>
                {Strings.online[lang]}
            </span> : offlineText + dateFormat(onlineAt, dateType)
    )
}