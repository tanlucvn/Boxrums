import { useContext, useEffect, useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/stores/Store';
import { BACKEND, Strings } from '@/support/Constants';
import { Section, SectionHeader } from '@/components/Section';
import { ControlledSlider, SlideItem } from '@/components/Slider';

import Boards from './Boards';
import Admins from './Admins';
import Reports from './Reports';
import Bans from './Bans';
import Folders from './Folders';
import Files from './Files';
import SearchAuth from './SearchAuth';

const Dashboard = () => {
  const { user, setFabVisible, lang } = useContext(StoreContext);
  document.title = 'Forum | ' + Strings.adminDashboard[lang];
  const [stats, setStats] = useState([]);
  const location = useLocation()

  useEffect(() => {
    setFabVisible(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetch(BACKEND + '/api/stats');
        const response = await data.json();

        if (!response.error) {
          setStats(response);
        } else throw Error(response.error?.message || 'Error');
      } catch (err) {
        toast.error(err.message === '[object Object]' ? 'Error' : err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <Section>
      {location.pathname === '/dashboard' &&
        <>
          <SectionHeader title={Strings.adminDashboard[lang]} />

          {stats.length ? (
            <ControlledSlider
              items={stats}
              card={SlideItem}
            />
          ) : null}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8 mt-8 max-sm:grid-cols-[auto]">
            {user.role === 3 && (
              <NavLink to='/dashboard/boards' className="admin_nav_item">
                <i class="fi fi-rr-chart-pie-alt text-3xl"></i>
                {Strings.boards[lang]}
              </NavLink>
            )}

            {user.role === 3 && (
              <NavLink to='/dashboard/admins' className="admin_nav_item">
                <i class="fi fi-rr-user-pen text-3xl"></i>
                {Strings.admins[lang]}
              </NavLink>
            )}

            <NavLink
              to='/dashboard/reports'
              className={!!localStorage.getItem('reports') ? 'admin_nav_item bg-purple' : 'admin_nav_item'}
            >
              <i class="fi fi-rr-megaphone text-3xl"></i>
              {Strings.reports[lang]}
            </NavLink>

            <NavLink to='/dashboard/bans' className="admin_nav_item">
              <i class="fi fi-rr-ban text-3xl"></i>
              {Strings.bans[lang]}
            </NavLink>

            {user.role === 3 && (
              <NavLink to='/dashboard/folders' className="admin_nav_item">
                <i class="fi fi-rr-folder-open text-3xl"></i>
                {Strings.uploadsFolders[lang]}
              </NavLink>
            )}

            <NavLink
              to='/dashboard/files'
              className={!!localStorage.getItem('files') ? 'admin_nav_item bg-purple' : 'admin_nav_item'}
            >
              <i class="fi fi-rr-file text-3xl"></i>
              {Strings.moderateFiles[lang]}
            </NavLink>

            <NavLink to='/dashboard/searchauth' className="admin_nav_item">
              <i class="fi fi-rr-time-past text-3xl"></i>
              {Strings.authorizationsHistory[lang]}
            </NavLink>
          </div>
        </>
      }

      <Routes>
        {user.role === 3 && <Route path='boards' element={<Boards />} />}
        {user.role === 3 && <Route path='admins' element={<Admins />} />}
        {user.role === 3 && <Route path='folders' element={<Folders />} />}

        <Route path='bans/*' element={<Bans />} />
        <Route path='reports/*' element={<Reports />} />
        <Route path='files/*' element={<Files />} />
        <Route path='searchauth' element={<SearchAuth />} />

        <Route path='*' element={<Navigate to="/dashboard" />} />
      </Routes>
    </Section>
  );
}

export default Dashboard;
