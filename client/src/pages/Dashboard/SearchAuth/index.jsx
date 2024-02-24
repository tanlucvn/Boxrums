import { useContext, useEffect, useState } from 'react';

import { StoreContext } from '@/stores/Store';

import { useForm } from '@/hooks/useForm';
import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';

import { SectionHeader } from '@/components/Section';
import FormCardItem from '@/components/Card/FormCardItem';
import { InputBox } from '@/components/Form/Input';
import DataView from '@/components/DataView';
import { AuthHistoryCard } from '@/components/Card';

const SearchAuth = () => {
  const { lang } = useContext(StoreContext)
  document.title = 'Forum | ' + Strings.authorizationsHistory[lang]
  const [init, setInit] = useState(true)
  const [ip, setIp] = useState('')
  const [errors, setErrors] = useState({})

  const { loading, moreLoading, noData, items, refetch } = useMoreFetch({ method: 'user/authHistory/search', params: { ip }, auth: true })

  useEffect(() => {
    if (!init) {
      refetch((Math.random() * 100).toFixed())
    } else {
      setInit(false)
    }
    // eslint-disable-next-line
  }, [ip])

  const searchCallback = () => {
    setErrors({})

    if (!values.ip.trim()) {
      return setErrors({ ip: Strings.enterYourSearchTerm[lang] })
    }

    setIp(values.ip)
  }

  const { onChange, onSubmit, values } = useForm(searchCallback, { ip: '' })

  return (
    <>
      <form className="form_inner" onSubmit={onSubmit}>
        <FormCardItem>
          <div className={errors.ip ? 'form_block error' : 'form_block'}>
            <InputBox
              name="ip"
              value={values.ip}
              placeholder={Strings.enterYourSearchTerm[lang] + '...'}
              maxLength="50"
              onChange={onChange}
            />
          </div>
        </FormCardItem>
      </form>

      {ip && <SectionHeader title={Strings.searchResults[lang]} />}

      <DataView
        data={items}
        noData={noData}
        loading={loading}
        moreLoading={moreLoading}
        card={AuthHistoryCard}
        noDataMessage={Strings.noResults[lang]}
        errorMessage={Strings.enterYourSearchTerm[lang]}
      />
    </>
  )
}

export default SearchAuth;
