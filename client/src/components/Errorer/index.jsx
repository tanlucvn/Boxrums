import { useContext } from 'react';
import { StoreContext } from '@/stores/Store';

import './style.css'

import { Strings } from '@/support/Constants';

export default function Errorer({ message, size = 112, color = '#64707d' }) {
    const { lang } = useContext(StoreContext)

    return (
        <div className="empty-results">
            <i class="fi fi-rs-exclamation text-9xl opacity-60"></i>
            <div className="empty_words">
                <div className="empty_top opacity-90">{navigator.onLine ? message : Strings.noInternetConnection[lang]}</div>
            </div>
        </div>
    )
}
