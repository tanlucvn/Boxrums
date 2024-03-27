import React, { useContext, useEffect, useState } from "react";
import AnimationWrapper from "../../common/page-animation";
import InPageNavigaion, { activeTabRef } from "../../components/InpageNavigation";
import axios from "axios";
import Loader from "../../components/Loader";
import MinimulBlogPost from "../../components/nobanner-blog-post.component";
import NoDataMessage from "../../components/NoData";
import { filterPaginationData } from "../../common/filter-pagination-data";
import LoadMoreDataBtn from "../../components/load-more.component";
import Threads from "./Threads";
import { StoreContext } from "@/stores/Store";
import Boards from "./Boards";
import { useMoreFetch } from "@/hooks/useMoreFetch";
import { BACKEND, Strings } from "@/support/Constants";
import { ArticleCard } from '@/components/Card/Card2';
import Uploads from "./Uploads";

const Home = () => {
  const { lang } = useContext(StoreContext)
  const [searchTags, setSearchTags] = useState("");
  const { loading, moreLoading, noData, items } = useMoreFetch({ method: 'threads/trending' })
  const { loading: tagsLoading, moreLoading: tagsMoreLoading, noData: tagsNoData, items: tagsResult, refetch: tagsRefetch } = useMoreFetch({ method: 'search', params: { query: searchTags, type: "tags" } })
  const [threads, setThreads] = useState();
  const [trendingBlogs, setTrendingBlogs] = useState(items);
  const [init, setInit] = useState(true)
  const [pageState, setPageState] = useState('home')

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/threads/recently?limit=${5}`)
        const response = await data.json()

        if (!response.error) {
          if (response.docs.length) {
            setThreads(response.docs)
          }
        } else throw Error(response.error?.message || 'Error')
      } catch (err) {
        console.error(err)
      }
    }

    fetchThreads()
  }, [])

  const allTags = () => {
    const uniqueTags = threads ? threads.reduce((accumulator, currentThread) => {
      currentThread.tags.forEach(tag => {
        if (!accumulator.includes(tag)) {
          accumulator.push(tag);
        }
      });
      return accumulator;
    }, []) : [];

    return uniqueTags;
  }

  const loadBlogbyCategory = (tag) => {
    setSearchTags(tag.toLowerCase());
    setPageState(prevPageState => {
      if (prevPageState === tag.toLowerCase()) {
        return 'home';
      } else {
        return tag.toLowerCase();
      }
    });
  }

  // console.log(pageState)
  useEffect(() => {
    if (!init) {
      tagsRefetch((Math.random() * 100).toFixed())
    } else {
      setInit(false)
    }
    // eslint-disable-next-line
  }, [searchTags])

  // console.log(tagsResult)
  return (
    <AnimationWrapper>
      <section className="h-cover p-0 grid grid-cols-8 gap-10 max-md:flex max-md:justify-center">
        {/* latest blog */}
        <div className="w-full col-span-5 max-md:col-span-12 max-lg:col-span-8">
          <InPageNavigaion
            routes={[pageState, "trending"]}
            defaultHidden={["trending"]}
          >
            <>
              {pageState !== "home" ?
                <Threads lang={tagsResult} /> :
                <>
                  <Boards lang={lang} />
                  <Threads lang={lang} />
                  <Uploads lang={lang} />
                </>}

            </>
            <>
              {tagsResult.map(item => (
                <ArticleCard key={item._id} data={item} />
              ))}
            </>
            <>
              {items === null ? (
                <Loader />
              ) : (
                items.length ?
                  items.map((item, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <MinimulBlogPost data={item} index={i} />
                      </AnimationWrapper>
                    );
                  })
                  : <NoDataMessage message={'No blog Trending'} />
              )}
            </>
          </InPageNavigaion>
        </div>

        {/* filter and trending */}
        <div className="border-l border-grey pl-8 pr-8 col-span-3 max-md:hidden max-lg:col-span-8 max-lg:border-0">
          <div className="w-full flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                {Strings.storiesInterest[lang]}
              </h1>
              <div className="flex gap-3 flex-wrap">
                {/* GET 10 TAGS */}
                {!threads ? <Loader /> : allTags().slice(0, 10).map((tag, i) => (
                  <button onClick={() => loadBlogbyCategory(tag)} key={i} className={"tag " + (pageState === tag ? "bg-black text-white" : "")}>
                    {tag}
                  </button>
                ))}

              </div>
            </div>

            <div>
              <h1 className="text-xl font-medium mb-8">
                {Strings.trending[lang]} <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>
              {items === null ? (
                <Loader />
              ) : (
                items.length ?
                  items.map((item, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      >
                        <MinimulBlogPost data={item} index={i} />
                      </AnimationWrapper>
                    );
                  })
                  : <NoDataMessage message={'No blog Trending'} />
              )}
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
