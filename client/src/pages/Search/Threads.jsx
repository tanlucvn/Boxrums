import { useEffect, useState } from 'react';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import DataView from '@/components/DataView';
import { BlogPostCard } from '@/components/Card/Card2';

const Threads = ({ lang, query, type }) => {
  const { loading, moreLoading, noData, items, refetch } = useMoreFetch({ method: 'search', params: { query, type } })
  const [init, setInit] = useState(true)

  useEffect(() => {
    if (!init) {
      refetch((Math.random() * 100).toFixed())
    } else {
      setInit(false)
    }
    // eslint-disable-next-line
  }, [query])

  return (
    <DataView
      data={items}
      noData={noData}
      loading={loading}
      moreLoading={moreLoading}
      card={BlogPostCard}
      noDataMessage={Strings.noResults[lang]}
      errorMessage={Strings.unableToDisplaySearchResults[lang]}
    />
  )
}

export default Threads;
