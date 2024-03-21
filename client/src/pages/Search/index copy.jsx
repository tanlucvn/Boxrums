import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InPageNavigaion from "@/components/InpageNavigation";
import UserCard from "@/components/usercard.component";
import { Strings } from "@/support/Constants";
import { StoreContext } from "@/stores/Store";
import { useMoreFetch } from "@/hooks/useMoreFetch";
import DataView from "@/components/DataView";
import { BlogPostCard } from "@/components/Card/Card2";

const SearchPage = () => {
  const { lang, token } = useContext(StoreContext)
  const { query } = useParams();
  const [init, setInit] = useState(true)

  const { loading: usersLoading, moreLoading: usersMoreLoading, noData: usersNoData, items: usersItems, refetch: usersRefetch } = useMoreFetch({ method: 'search', params: { query, type: 'users' } });
  const { loading: threadsLoading, moreLoading: threadsMoreLoading, noData: threadsNoData, items: threadsItems, refetch: threadsRefetch } = useMoreFetch({ method: 'search', params: { query, type: 'threads' } });

  useEffect(() => {
    if (!init) {
      usersRefetch((Math.random() * 100).toFixed())
      threadsRefetch((Math.random() * 100).toFixed())
    } else {
      setInit(false)
    }
  }, [query])

  const UserCardWrapper = () => {
    return (
      <DataView
        data={usersItems}
        noData={usersNoData}
        loading={usersLoading}
        moreLoading={usersMoreLoading}
        card={UserCard}
        noDataMessage={Strings.noResults[lang]}
        errorMessage={Strings.noUsersYet[lang]}
      />
    );
  };

  console.log("ủe load", usersLoading)

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigaion
          routes={[`${Strings.searchResults[lang]} "${query}"`, "Account Matched"]}
          defaultHidden={["Account Matched"]}
        >
          <DataView
            data={threadsItems}
            noData={threadsNoData}
            loading={threadsLoading}
            moreLoading={threadsMoreLoading}
            card={BlogPostCard}
            noDataMessage={Strings.noResults[lang]}
            errorMessage={Strings.noThreadsYet[lang]}
          />
          <>
            <UserCardWrapper />
          </>
        </InPageNavigaion>
      </div>
      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">Users Related to search <i className="fi fi-rr-user mt-1"></i></h1>
        <UserCardWrapper />

      </div>
    </section>
  );
};

export default SearchPage;
