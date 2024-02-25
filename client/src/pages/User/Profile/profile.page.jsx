import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import AnimationWrapper from "@/common/page-animation";
import Loader from "@/components/loader.component";
import { UserContext } from "@/App";
import AboutUser from "@/components/about.component";
import { filterPaginationData } from "@/common/filter-pagination-data";
import InPageNavigaion from "@/components/inpage-navigation.component";
import NoDataMessage from "@/components/nodata.component";
import BlogPostCard from "@/components/blog-post.component";
import LoadMoreDataBtn from "@/components/load-more.component";
import PageNotFound from "@/pages/NotFound";
import toast, { Toaster } from "react-hot-toast";
import { StoreContext } from "@/stores/Store";
import { BACKEND, Strings } from "@/support/Constants";
import Errorer from "@/components/Errorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Avatar from 'boring-avatars'
import Threads from "./Threads";
import Answers from "./Answers";
import Bans from "./Bans";

const ProfilePage = ({ userName, type }) => {
  const { user, token, lang, setModalOpen, setPostType } = useContext(StoreContext)
  const navigate = useNavigate()

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)
  const [banned, setBanned] = useState(false)
  const [moder, setModer] = useState(false)

  if (userData.displayName) {
    document.title = `Forum | ${Strings.profile[lang]} ${userData.displayName}`
  }

  useEffect(() => {
    const profileName = userData.displayName || userName
    document.title = `Forum | ${Strings.profile[lang]} ${profileName}`

    if (userData.name === userName) return

    const fetchUser = async () => {
      try {
        const userMethod = user.name === userName ? '/profile' : `/user?userName=${userName}`
        const data = await fetch(`${BACKEND}/api${userMethod}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        const response = await data.json()
        console.log("Run fetch")
        if (!response.error) {
          setUserData(response)
          setBanned(!!response.ban)
          setModer(response.role === 2)
          setLoading(false)
          setNoData(false)
        } else throw Error(response.error?.message || 'Error')
      } catch (err) {
        setNoData(true)
        setLoading(false)
      }
    }

    fetchUser()
  }, [userData, userName, user?.name, token, lang])

  /* const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formateData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-search-blogs-count",
          data_to_send: { author: user_id },
        });
        formateData.user_id = user_id;
        setBlogs(formateData);
      })
      .catch((err) => {
        // toast.error(err)
        console.log(err);
      });
  };
  useEffect(() => {
    if (profileId !== profileLoaded) {
      setBlogs(null)
    }
    if (blogs === null) {
      resetState();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("")
  }; */

  console.log(userData)
  return (
    <AnimationWrapper>
      {!noData ? (
        !loading ? (
          // Look better if change this dive to section
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

              {/* <p>
                  {total_posts.toLocaleString()} Blogs -{" "}
                  {total_reads.toLocaleString()} Reads
                </p> */}

              <p>
                {userData.karma} {Strings.karma[lang]} - {userData.role} Role
              </p>

              <div className="flex gap-4 mt-2">
                {userData.name === user.name ? (
                  <Link
                    to={`/settings/edit-profile`}
                    className="btn-light rounded-md"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  ""
                )}
              </div>

              {/*  <AboutUser
                  className="max-md:hidden"
                  bio={bio}
                  social_links={social_links}
                  joinedAt={joinedAt}
                /> */}
            </div>

            <div className="max-md:mt-12 w-full">
              <InPageNavigaion
                routes={[Strings.threads[lang], Strings.answers[lang], Strings.bans[lang]]}
                defaultHidden={["About"]}
              >
                {[<Threads userData={userData} />, <Answers userData={userData} />, <Bans userData={userData} />]}
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
