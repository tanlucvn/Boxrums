import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

import { Section } from '@/components/Section';

import Settings from './Settings';
import Profile from './Profile';

const User = ({ match }) => {
    const { setFabVisible } = useContext(StoreContext)
    const [type, setType] = useState({ user: "", route: "" })
    const location = useLocation()

    useEffect(() => {
        setFabVisible(false)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setType({ user: location.pathname.replace(/\/user\//, ''), route: location.hash })
    }, [location])

    return (
        <Section>
            {type.route === "#settings" && <Settings userName={type.user} />}
            {type.user && <Profile userName={type.user} type={type} />}
        </Section>
    )
}

export default User;