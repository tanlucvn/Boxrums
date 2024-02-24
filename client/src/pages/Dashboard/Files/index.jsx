import { useContext, useEffect, useState } from 'react';
import { Routes, Navigate, Route, useNavigate } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

import { Strings } from '@/support/Constants';

import SortNav from '@/components/SortNav';

import NotModerated from './NotModerated';
import All from './All';
import Breadcrumbs from '@/components/Breadcrumbs';

const Files = () => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.moderateFiles[lang]
  const [sort, setSort] = useState('files')
  const navigate = useNavigate()

  useEffect(() => {
    const route = sort === 'all' ? '/dashboard/files/all' : '/dashboard/files';
    navigate(route);

  }, [sort, navigate]);

  return (
    <>
      <Breadcrumbs current={Strings.moderateFiles[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.needToModerate[lang], sort: 'files' },
        { title: Strings.all[lang], sort: 'all' }
      ]} setSort={setSort} state={sort} />

      <Routes>
        <Route path={'all'} element={<All />} />
        <Route path={'/'} exact element={<NotModerated />} />
      </Routes>

      {sort !== 'all' && <Navigate to="/dashboard/files" />}
    </>
  )
}

export default Files;
