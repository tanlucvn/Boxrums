import { useContext, useEffect, useState } from 'react';
import { Routes, Navigate, Route, useNavigate } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

import { Strings } from '@/support/Constants';

import SortNav from '@/components/SortNav';

import Newest from './Newest';
import All from './All';
import Breadcrumbs from '@/components/Breadcrumbs';

const Bans = () => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.bans[lang]
  const [sort, setSort] = useState('bans')
  const navigate = useNavigate()

  useEffect(() => {
    const route = sort === 'all' ? '/dashboard/bans/all' : '/dashboard/bans';
    navigate(route);

  }, [sort, navigate]);

  return (
    <>
      <Breadcrumbs current={Strings.bans[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.byNewest[lang], sort: 'bans' },
        { title: Strings.all[lang], sort: 'all' }
      ]} setSort={setSort} state={sort} />

      <Routes>
        <Route path={'all'} element={<All />} />
        <Route path={'/'} exact element={<Newest />} />
      </Routes>

      {/* Redirect if no route matches */}
      {sort !== 'all' && <Navigate to="/dashboard/bans" />}
    </>
  )
}

export default Bans;
