import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

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
import { Doughnut } from 'react-chartjs-2';
import { LabelInputBox, SelectBox } from '@/components/Form/Input';
import Loader from '@/components/Loader';

const Dashboard = () => {
  const { user, setFabVisible, lang } = useContext(StoreContext);
  document.title = 'Forum | ' + Strings.adminDashboard[lang];
  const [stats, setStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState({ name: "January" });
  const [init, setInit] = useState(false);
  const chartRef = useRef()
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
          setInit(true);
        } else throw Error(response.error?.message || 'Error');
      } catch (err) {
        toast.error(err.message === '[object Object]' ? 'Error' : err.message);
      }
    };

    if (!init) {
      fetchStats();
    }
  }, [location, init]);

  useEffect(() => {
    if (stats.length === 0 || !init) return;
    if (!chartRef.current) return;

    if (stats.length) {
      const ctx = document.getElementById('myChart').getContext('2d');
      const filteredData = stats.map(item => ({
        ...item,
        count: item.month ? (item.month[selectedMonth.name] || 0) : 0
      }));

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: filteredData.map(item => item.title),
          datasets: [{
            label: `# ${selectedMonth.name}`,
            data: filteredData.map(item => item.count),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      return () => myChart.destroy();
    }


  }, [stats, selectedMonth.name, init, chartRef.current]);

  const months = [
    {
      name: "January",
      title: Strings.january[lang],
    },
    {
      name: "February",
      title: Strings.february[lang],
    },
    {
      name: "March",
      title: Strings.march[lang],
    },
    {
      name: "April",
      title: Strings.april[lang],
    },
    {
      name: "May",
      title: Strings.may[lang],
    },
    {
      name: "June",
      title: Strings.june[lang],
    },
    {
      name: "July",
      title: Strings.july[lang],
    },
    {
      name: "August",
      title: Strings.august[lang],
    },
    {
      name: "September",
      title: Strings.september[lang],
    },
    {
      name: "October",
      title: Strings.october[lang],
    },
    {
      name: "November",
      title: Strings.november[lang],
    },
    {
      name: "December",
      title: Strings.december[lang],
    },
  ];

  // console.log(stats)

  return (
    <Section>
      {location.pathname === '/dashboard' &&
        <section className='h-cover p-0 grid grid-cols-8 gap-10 max-md:flex max-md:flex-wrap max-md:justify-center'>
          <div className='w-full col-span-5 max-md:col-span-12 max-lg:col-span-8'>
            {stats.length > 0 ? (
              <ControlledSlider
                items={stats}
                card={SlideItem}
              />
            ) : <Loader />}

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
          </div>


          <div className='border-l border-grey pl-8 pr-8 col-span-3 max-lg:col-span-8 max-lg:border-0'>
            {stats.length > 0 ?
              <>
                <LabelInputBox text={Strings.filter[lang]} />
                <SelectBox options={months} onChange={setSelectedMonth} value={selectedMonth.name} />
                <canvas ref={chartRef} id="myChart" width="400" height="400"></canvas>
              </> :
              <Loader />
            }
          </div>
        </section>
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
