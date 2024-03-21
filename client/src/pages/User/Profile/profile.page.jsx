import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimationWrapper from "@/common/page-animation";
import Loader from "@/components/Loader";
import InPageNavigaion from "@/components/InpageNavigation";
import { StoreContext } from "@/stores/Store";
import { BACKEND, Strings } from "@/support/Constants";
import Errorer from "@/components/Errorer";
import Avatar from 'boring-avatars'
import Threads from "./Threads";
import Answers from "./Answers";
import Bans from "./Bans";
import { InputBox } from "@/components/Form/Input";
import { ModalContext } from "@/components/Modal";
import { counter } from "@/support/Utils";
import Tags from "@/components/Tags";
import { toast } from 'react-hot-toast'
import AboutUser from "@/components/about.component";
import AuthHistory from "./AuthHistory";
import { UserOnline } from "@/components/UserBadge";

const ProfilePage = ({ userName, type }) => {
  const { user, token, lang, setModalOpen, setPostType, postRes } = useContext(StoreContext)

  const [userData, setUserData] = useState({})
  const [userStats, setUserStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [banned, setBanned] = useState(false)
  const [open, setOpen] = useState(false)
  const [moder, setModer] = useState(false)

  if (userData.displayName) {
    document.title = `Forum | ${Strings.profile[lang]} ${userData.displayName}`
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileName = userData.displayName || userName;
        document.title = `Forum | ${Strings.profile[lang]} ${profileName}`;

        if (userData.name === userName) return;

        const userMethod = user.name === userName ? '/profile' : `/user?userName=${userName}`;
        const response = await axios.get(`${BACKEND}/api${userMethod}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });

        if (!response.data.error) {
          setUserData(response.data);
          setBanned(!!response.data.ban);
          setModer(response.data.role === 2);

          if (response.data._id) {
            await fetchStats(response.data._id);
          } else if (user.name === userName) {
            await fetchStats(user.id);
          }

          setLoading(false);
          setNoData(false);
        } else {
          throw new Error(response.data.error?.message || 'Error');
        }
      } catch (err) {
        setNoData(true);
        setLoading(false);
      }
    };

    fetchData();
  }, [userData, userName, user?.name, token, lang]);

  const fetchStats = async (userId) => {
    try {
      const response = await axios.get(`${BACKEND}/api/user/stats?userId=${userId}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });

      if (!response.data.error) {
        setUserStats(response.data);
      } else {
        throw new Error(response.data.error?.message || 'Error');
      }
    } catch (err) {
      toast.error(err.message === '[object Object]' ? 'Error' : err.message);
    }
  };

  const onBan = () => {
    if (userData.ban) {
      axios.delete(BACKEND + '/api/ban/delete', {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        data: { userId: userData._id }
      })
        .then(response => {
          const data = response.data;
          const user = response.data.user;
          if (!data.error) {
            setBanned(false);
            setUserData({ ...userData, ...user });
          } else {
            throw Error(data.error?.message || 'Error');
          }
        })
        .catch(err => toast.error(err.message === '[object Object]' ? 'Error' : err.message));
    } else {
      setPostType({
        type: 'ban',
        id: userData._id,
        someData: {
          body: ""
        }
      });
      setModalOpen(true);
    }
  };

  const editRole = async () => {
    const role = moder ? 1 : 2;

    try {
      const response = await axios.put(`${BACKEND}/api/role/edit`, { userId: userData._id, role }, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.error) {
        setUserData(prev => {
          prev.role = role;
          return prev;
        });
        setModer(!moder);
      } else {
        throw new Error(response.data.error?.message || 'Error');
      }
    } catch (err) {
      toast.error(err.message === '[object Object]' ? 'Error' : err.message);
    }
  };

  const deleteUser = async () => {
    setPostType({
      type: 'deleteUser',
      id: userData._id,
    });
    setModalOpen(true);
  };

  useEffect(() => {
    if (postRes.ban && postRes.ban.user === userData._id) {
      setUserData({ ...userData, ban: postRes.ban._id })
    }
  }, [postRes])

  return (
    <AnimationWrapper>
      {!noData ? (
        !loading ? (
          // Look better if change this div to section
          <div className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
              <div className="w-48 h-48 md:w-32 md:h-32">
                <Avatar
                  size={"100%"}
                  name={userData.name}
                  variant="marble"
                  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                />
              </div>
              <h1 className="text-2xl font-medium">@{userData.name}</h1>
              <p className="text-xl capitalize h-6">{userData.displayName}</p>

              <UserOnline onlineAt={userData.onlineAt} offlineText={Strings.lastSeen[lang]} />

              <div>
                {userData.role === 2 && <Tags title={Strings.moderator[lang]} className="bg-purple/20 text-black" />}
                {userData.role === 3 && <Tags title={Strings.admins[lang]} className="bg-red/20 text-black" icon={<i class="fi fi-sr-crown"></i>} />}
              </div>

              <div className="flex gap-4 mt-2">
                {userData.name === user.name ? (
                  <Link
                    to={`/settings/edit-profile`}
                    className="btn-light rounded-md"
                  >
                    {Strings.profileSettings[lang]}
                  </Link>
                ) : (
                  ""
                )}
              </div>

              {/* <div className="flex gap-4 mt-2">
                {user.role === 3 && (
                  <button
                    onClick={onBan}
                    className={`btn-light rounded-md ${open && 'bg-red/20 text-red'}`}
                  >
                    {userData.ban ? Strings.unbanUser[lang] : Strings.ban[lang]}
                  </button>
                )}
              </div> */}

              <div className="flex gap-4 mt-2 flex-wrap break-words">
                {user.role >= 2 && user.id !== userData._id ?
                  <>
                    {user.role === 3 && user.name !== userName && (
                      <>
                        <button onClick={() => editRole()} className="btn-light">
                          {moder ? Strings.removeModerator[lang] : Strings.appointAsAModerator[lang]}
                        </button>

                        <button onClick={() => deleteUser(userData._id)} className="btn-light">{Strings.delete[lang]}</button>
                      </>
                    )}
                    {user.role > userData.role && (
                      <>
                        <button onClick={() => onBan(userData._id)} className="btn-light">
                          {banned ? Strings.unbanUser[lang] : Strings.banUser[lang]}
                        </button>

                        <Link to={'/user/' + userData.name + '/auth/history'} className="btn-light">
                          {Strings.authorizationsHistory[lang]}
                        </Link>
                      </>
                    )}
                  </>
                  :
                  <>
                    {user.role >= 2 &&
                      <Link to={'/user/' + user.name + '/auth/history'} className="btn-light">
                        {Strings.authorizationsHistory[lang]}
                      </Link>
                    }
                  </>
                }
              </div>

              <AboutUser
                className="max-md:hidden"
                bio={userData.bio}
                social_links={userData.socialLinks}
                joinedAt={userData.createdAt}
                lang={lang}
              />
            </div>

            <div className="max-md:mt-12 w-full">
              <InPageNavigaion
                routes={[
                  `${Strings.threads[lang]} (${counter(userStats.threadsCount)})`,
                  `${Strings.answers[lang]} (${counter(userStats.answersCount)})`,
                  `${Strings.bans[lang]} (${counter(userStats.bansCount)})`,
                  user.role >= 2 && Strings.authorizationsHistory[lang]
                ]}
                defaultHidden={["About"]}
              >
                {[
                  <Threads userData={userData} />,
                  <Answers userData={userData} />,
                  <Bans userData={userData} />,
                  user.role >= 2 && <AuthHistory userData={userData} />
                ]}
              </InPageNavigaion>
            </div>
          </div>
        ) : <Loader color="#64707d" />
      ) : (
        <Errorer message={Strings.unableToDisplayUserProfile[lang]} />
      )
      }
    </AnimationWrapper>
  );
};

export default ProfilePage;
