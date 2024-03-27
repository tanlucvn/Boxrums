import axios from 'axios'
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route, Link } from 'react-router-dom';
import { StoreContext } from '@/stores/Store';
import { BACKEND, Strings } from '@/support/Constants';
import { Section } from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import SortNav from '@/components/SortNav';
import Newest from './Newest';
import Old from './Old';
import Online from './Online';
import Karma from './Karma';
import Admins from './Admins';
import Avatar from 'boring-avatars'
import { toast } from 'react-hot-toast'
import Loader from '@/components/Loader';

const Users = () => {
    const { user, lang } = useContext(StoreContext);
    const navigate = useNavigate();
    document.title = 'Forum | ' + Strings.users[lang];
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSort = searchParams.get('sort') || 'users';
    const [sort, setSort] = useState(initialSort);
    const [users, setUsers] = useState();
    const [topList, setTopList] = useState({ threads: [], answersAndComments: [], files: [], karma: [] })

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

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${BACKEND}/api/users/stats`);

                if (!response.data.error) {
                    const statsData = response.data;

                    const threadsSorted = statsData.map(stat => ({ user: stat.user, count: stat.threadsCount }))
                        .sort((a, b) => b.count - a.count);

                    const answersAndComments = statsData.map(stat => ({
                        user: stat.user,
                        count: stat.answersCount + stat.fileCommentsCount
                    })).sort((a, b) => b.count - a.count);

                    const filesSorted = statsData.map(stat => ({ user: stat.user, count: stat.filesCount }))
                        .sort((a, b) => b.count - a.count);

                    const karmaSorted = statsData.map(stat => ({ user: stat.user, karma: stat.karma }))
                        .sort((a, b) => b.karma - a.karma);

                    setTopList({
                        threads: threadsSorted,
                        answersAndComments: answersAndComments,
                        files: filesSorted,
                        karma: karmaSorted
                    });
                } else {
                    throw new Error(response.data.error?.message || 'Error');
                }
            } catch (err) {
                toast.error(err.message === '[object Object]' ? 'Error' : err.message);
            }
        };

        fetchStats();
    }, []);

    // console.log(topList)

    return (
        <Section>
            <section className='h-cover p-0 grid grid-cols-8 gap-10 max-md:flex max-md:flex-wrap max-md:justify-center'>
                <div className='w-full col-span-3 max-md:col-span-12 max-lg:col-span-8'>
                    <SortNav links={sortItems} setSort={setSort} state={sort} />

                    <Routes>
                        <Route path='admin' element={<Admins lang={lang} />} />
                        <Route path='oldest' element={<Old lang={lang} />} />
                        <Route path='online' element={<Online lang={lang} />} />
                        <Route path='karma' element={<Karma lang={lang} />} />

                        <Route index element={<Newest lang={lang} />} />
                        <Route path='*' element={<Newest lang={lang} />} />
                    </Routes>
                </div>

                <div className='border-l border-grey pl-8 pr-8 col-span-5 max-lg:col-span-8 max-lg:border-0'>
                    <div className='flex items-center justify-center flex-wrap gap-3'>
                        <div class="w-[320px] max-md:w-full">
                            <div class="p-4 max-w-md bg-grey rounded-lg shadow-md sm:p-8 max-md:max-w-none">
                                <div class="flex justify-between items-center mb-4">
                                    <p class="text-xl font-bold leading-none">{Strings.topThreads[lang]}</p>
                                </div>
                                <div class="flow-root">
                                    <ul role="list">
                                        {topList && topList.threads.length > 0 ? topList.threads.slice(0, 4).map((item) =>
                                            <li class="py-3 sm:py-4">
                                                <div class="flex items-center space-x-4">
                                                    <div class="flex-shrink-0">
                                                        <div className="w-8 h-8">
                                                            <Link to={`/user/${item.user.name}`}>
                                                                <Avatar
                                                                    size={'100%'}
                                                                    name={item.user.name}
                                                                    variant="marble"
                                                                    colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                                />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                    <div class="flex-1 min-w-0">
                                                        <p class="text-sm font-medium truncate">
                                                            {item.user.name}
                                                        </p>
                                                        <p class="text-sm truncate text-dark-grey/80">
                                                            {item.user.displayName}
                                                        </p>
                                                    </div>
                                                    <div class="inline-flex items-center text-base font-semibold">
                                                        {item.count}
                                                    </div>
                                                </div>
                                            </li>
                                        ) :
                                            <Loader />
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="w-[320px] max-md:w-full">
                            <div class="p-4 max-w-md bg-grey rounded-lg shadow-md sm:p-8 max-md:max-w-none">
                                <div class="flex justify-between items-center mb-4">
                                    <p class="text-xl font-bold leading-none">{Strings.topAnswersAndComments[lang]}</p>
                                </div>
                                <div class="flow-root">
                                    <ul role="list">
                                        {topList && topList.answersAndComments.length > 0 ?
                                            topList.answersAndComments.slice(0, 4).map((item) =>
                                                <li class="py-3 sm:py-4">
                                                    <div class="flex items-center space-x-4">
                                                        <div class="flex-shrink-0">
                                                            <div className="w-8 h-8">
                                                                <Link to={`/user/${item.user.name}`}>
                                                                    <Avatar
                                                                        size={'100%'}
                                                                        name={item.user.name}
                                                                        variant="marble"
                                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium truncate">
                                                                {item.user.name}
                                                            </p>
                                                            <p class="text-sm truncate text-dark-grey/80">
                                                                {item.user.displayName}
                                                            </p>
                                                        </div>
                                                        <div class="inline-flex items-center text-base font-semibold">
                                                            {item.count}
                                                        </div>
                                                    </div>
                                                </li>
                                            ) :
                                            <Loader />
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="w-[320px] max-md:w-full">
                            <div class="p-4 max-w-md bg-grey rounded-lg shadow-md sm:p-8 max-md:max-w-none">
                                <div class="flex justify-between items-center mb-4">
                                    <p class="text-xl font-bold leading-none">{Strings.topUploadFiles[lang]}</p>
                                </div>
                                <div class="flow-root">
                                    <ul role="list">
                                        {topList && topList.files.length > 0 ?
                                            topList.files.slice(0, 4).map((item) =>
                                                <li class="py-3 sm:py-4">
                                                    <div class="flex items-center space-x-4">
                                                        <div class="flex-shrink-0">
                                                            <div className="w-8 h-8">
                                                                <Link to={`/user/${item.user.name}`}>
                                                                    <Avatar
                                                                        size={'100%'}
                                                                        name={item.user.name}
                                                                        variant="marble"
                                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium truncate">
                                                                {item.user.name}
                                                            </p>
                                                            <p class="text-sm truncate text-dark-grey/80">
                                                                {item.user.displayName}
                                                            </p>
                                                        </div>
                                                        <div class="inline-flex items-center text-base font-semibold">
                                                            {item.count}
                                                        </div>
                                                    </div>
                                                </li>
                                            ) :
                                            <Loader />
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="w-[320px] max-md:w-full">
                            <div class="p-4 max-w-md bg-grey rounded-lg shadow-md sm:p-8 max-md:max-w-none">
                                <div class="flex justify-between items-center mb-4">
                                    <p class="text-xl font-bold leading-none">{Strings.topKarma[lang]}</p>
                                </div>
                                <div class="flow-root">
                                    <ul role="list">
                                        {topList && topList.karma.length > 0 ?
                                            topList.karma.slice(0, 4).map((item) =>
                                                <li class="py-3 sm:py-4">
                                                    <div class="flex items-center space-x-4">
                                                        <div class="flex-shrink-0">
                                                            <div className="w-8 h-8">
                                                                <Link to={`/user/${item.user.name}`}>
                                                                    <Avatar
                                                                        size={'100%'}
                                                                        name={item.user.name}
                                                                        variant="marble"
                                                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div class="flex-1 min-w-0">
                                                            <p class="text-sm font-medium truncate">
                                                                {item.user.name}
                                                            </p>
                                                            <p class="text-sm truncate text-dark-grey/80">
                                                                {item.user.displayName}
                                                            </p>
                                                        </div>
                                                        <div class="inline-flex items-center text-base font-semibold">
                                                            {item.karma}
                                                        </div>
                                                    </div>
                                                </li>
                                            ) :
                                            <Loader />
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Section>
    );
};

export default Users;
