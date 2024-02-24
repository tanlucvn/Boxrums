import { useContext, useEffect, useState } from 'react';
import { Routes, Navigate, Route, useNavigate } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

import { Strings } from '@/support/Constants';

import SortNav from '@/components/SortNav';
import Breadcrumbs from '@/components/Breadcrumbs';

import Unread from './Unread';
import Read from './Read';

const Reports = () => {
  const { lang } = useContext(StoreContext);
  document.title = 'Forum | ' + Strings.reports[lang];
  const [sort, setSort] = useState('reports');
  const navigate = useNavigate()

  useEffect(() => {
    const route = sort === 'read' ? '/dashboard/reports/read' : '/dashboard/reports';
    navigate(route);

  }, [sort, navigate]);

  useEffect(() => {
    localStorage.removeItem('reports');
  }, []);

  return (
    <>
      <Breadcrumbs current={Strings.reports[lang]} links={[
        { title: Strings.home[lang], link: '/' },
        { title: Strings.dashboard[lang], link: '/dashboard' }
      ]} />

      <SortNav links={[
        { title: Strings.unread[lang], sort: 'reports' },
        { title: Strings.read[lang], sort: 'read' }
      ]} setSort={setSort} state={sort} />

      <Routes>
        <Route path={'read'} element={<Read />} />
        <Route path={'/'} exact element={<Unread />} />
      </Routes>

      {/* Redirect if no route matches */}
      {sort !== 'read' && <Navigate to="/dashboard/reports" />}
    </>
  );
};

export default Reports;
