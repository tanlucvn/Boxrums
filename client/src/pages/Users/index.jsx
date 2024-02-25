import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { StoreContext } from '@/stores/Store';
import { Strings } from '@/support/Constants';
import { Section } from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import SortNav from '@/components/SortNav';
import Newest from './Newest';
import Old from './Old';
import Online from './Online';
import Karma from './Karma';
import Admins from './Admins';

const Users = () => {
    const { user, lang } = useContext(StoreContext);
    const navigate = useNavigate();
    document.title = 'Forum | ' + Strings.users[lang];
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSort = searchParams.get('sort') || 'users';
    const [sort, setSort] = useState(initialSort);

    useEffect(() => {
        if (sort !== 'users') {
            navigate(`/users${sort}`);
        } else if (sort === 'users') {
            navigate(`/users`);
        }
    }, [sort, navigate]);

    const sortItems = [
        { title: Strings.newest[lang], sort: 'users' },
        { title: Strings.oldest[lang], sort: '/oldest' },
        { title: Strings.online[lang], sort: '/online' },
        { title: Strings.admins[lang], sort: '/admin' }
    ];

    if (user) {
        sortItems.push({ title: Strings.karma[lang], sort: '/karma' });
    }

    console.log(sort)

    return (
        <Section>
            <Breadcrumbs
                current={Strings.users[lang]}
                links={[{ title: Strings.home[lang], link: '/' }]}
            />

            <SortNav links={sortItems} setSort={setSort} state={sort} />

            {/* {sort === 'admin' && <Admins lang={lang} />}
                {sort === 'oldest' && <Old lang={lang} />}
                {sort === 'online' && <Online lang={lang} />}
                {sort === 'karma' && <Karma lang={lang} />}
                {sort !== 'admin' && sort !== 'oldest' && sort !== 'online' && sort !== 'karma' && (
                    <Newest lang={lang} />
                )} */}
            <Routes>
                <Route path='admin' element={<Admins lang={lang} />} />
                <Route path='oldest' element={<Old lang={lang} />} />
                <Route path='online' element={<Online lang={lang} />} />
                <Route path='karma' element={<Karma lang={lang} />} />

                <Route index element={<Newest lang={lang} />} />
                <Route path='*' element={<Newest lang={lang} />} />
            </Routes>
        </Section>
    );
};

export default Users;
