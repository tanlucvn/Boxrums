import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigaion from "@/components/inpage-navigation.component";
import Loader from "@/components/loader.component";
import NoDataMessage from "@/components/nodata.component";
import AnimationWrapper from "@/common/page-animation";
import BlogPostCard from "@/components/blog-post.component";
import LoadMoreDataBtn from "@/components/load-more.component";
import { BACKEND, Strings } from "@/support/Constants";
import { StoreContext } from "@/stores/Store";
import Users from "./Users";
import Threads from "./Threads";
import Answers from "./Answers";
import Boards from "./Boards";

const SearchPage = () => {
  const { lang, token } = useContext(StoreContext)
  const { query } = useParams();

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigaion
          routes={[Strings.threads[lang], Strings.answer[lang], Strings.boards[lang], "Account Matched"]}
          defaultHidden={["Account Matched"]}
        >
          <Threads query={query} lang={lang} type="threads" />
          <Answers query={query} lang={lang} type="answers" />
          <Boards query={query} lang={lang} type="boards" />
          <Users query={query} lang={lang} type="users" />
        </InPageNavigaion>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">Users Related to search <i className="fi fi-rr-user mt-1"></i></h1>
        <Users query={query} lang={lang} type="users" />

      </div>
    </section>
  );
};

export default SearchPage;
