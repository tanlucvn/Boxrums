import React, { useContext, useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import { LabelInputBox, SelectBox } from '@/components/Form/Input'
import { Strings } from '@/support/Constants'
import { StoreContext } from '@/stores/Store'

const Customize = () => {
  const { lang, setLang } = useContext(StoreContext)
  const [selectLang, setSelectLang] = useState({ name: lang === "vi" ? Strings.vietnamese[lang] : Strings.english[lang] })

  const langOptions = [
    {
      name: Strings.vietnamese[lang],
      title: Strings.vietnamese[lang],
    },
    {
      name: Strings.english[lang],
      title: Strings.english[lang],
    },
  ]

  useEffect(() => {
    if (selectLang.name === Strings.vietnamese[lang]) {
      setLang("vi")
    } else setLang("en")
  }, [selectLang])

  return (
    <AnimationWrapper>
      <h1 className='max-md:hidden'>{Strings.customize[lang]}</h1>
      <div className='py-10 w-full md:max-w-[400px]'>
        <LabelInputBox text={Strings.customizeLang[lang]} />
        <SelectBox options={langOptions} value={selectLang.name} onChange={setSelectLang} />
      </div>
    </AnimationWrapper>
  )
}

export default Customize