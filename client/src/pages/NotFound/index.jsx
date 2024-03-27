import React, { useContext } from 'react'
import lightPageNotFountImg from '@/imgs/404-light.png'
import DarkPageNotFountImg from '@/imgs/404-dark.png'
import { Link } from 'react-router-dom'
import { ThemeContext } from '@/App'
import { StoreContext } from '@/stores/Store'
import { Strings } from '@/support/Constants'

const PageNotFound = () => {
  const { lang } = useContext(StoreContext)
  const { theme } = useContext(ThemeContext)

  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
      <img src={theme == 'light' ? DarkPageNotFountImg : lightPageNotFountImg} alt="404page" className='select-none border-2 border-grey w-72 aspect-square object-cover rounded' />
      <h1 className='text-4xl font-semibold'>{Strings.error404PageNotFound[lang]}</h1>
      <p className='text-dark-grey text-xl leadding-7 -mt-8'>{Strings.error404PageNotFoundDesc[lang]} <Link to="/" className='text-black underline'>{Strings.goToHomePage[lang]}</Link></p>
    </section>
  )
}

export default PageNotFound