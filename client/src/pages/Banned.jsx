import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { StoreContext } from '@/stores/Store';

import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket';
import { BACKEND, Strings } from '@/support/Constants';

import { Section, SectionHeader } from '@/components/Section';
import { BanInfoCard } from '@/components/Card/Card2';
import Loader from '@/components/Loader';
import AnimationWrapper from '@/common/page-animation';

const Banned = () => {
  const { lang, banned, setBanned } = useContext(StoreContext)
  const [banInfo, setBanInfo] = useState({})
  const [timer, setTimer] = useState()
  const navigate = useNavigate()

  const tryAnotherAccounts = () => {
    setBanned({ status: false, userId: '' })
    navigate('/login')
  }

  useEffect(() => {
    if (!banned.userId) return navigate('/')

    document.title = 'Forum | ' + Strings.youAreBanned[lang]

    const fetchBan = async () => {
      try {
        const data = await fetch(`${BACKEND}/api/ban?userId=${banned.userId}`)
        const response = await data.json()

        if (!response.error) {
          if (!response.ban) {
            navigate('/register')
          }
          setBanInfo(response.ban)
        } else throw Error(response.error?.message || 'Error')
      } catch (err) {
        console.error(err)
      }
    }

    fetchBan()
  }, [banned, lang, navigate])

  useEffect(() => {
    if (banInfo.expiresAt) {
      setTimer(setInterval(() => {
        if (banInfo.expiresAt < new Date().toISOString()) {
          console.log("Account unbaned")

          setBanned({ status: false, userId: '' })
        }
      }, 1000))
    }
    return () => {
      timer && clearInterval(timer)
    }
  }, [banInfo, navigate])

  useEffect(() => {
    if (banned.userId) joinToRoom('banned:' + banned.userId)
    return () => {
      if (banned.userId) leaveFromRoom('banned:' + banned.userId)
    }
  }, [banned])

  useEffect(() => {
    Socket.on('unban', (data) => {
      setBanned({ status: false, userId: '' })

      navigate('/login')
    })
  }, [navigate])

  return (
    <>
      <AnimationWrapper>
        <section className="h-cover flex items-center justify-center">
          <div id="formElement" className="w-[80%] max-w-[400px]">
            <h1 className="text-4xl font-gelasio capitalize text-center mb-20">
              {Strings.youAreBanned[lang]}
            </h1>

            {banInfo.createdAt
              ? <BanInfoCard data={banInfo} owner />
              : <Loader />
            }

            <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
              <hr className="w-1/2 border-black" />
              <p>{Strings.or[lang]}</p>
              <hr className="w-1/2 border-black" />
            </div>

            <button onClick={tryAnotherAccounts} className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
              <i class="fi fi-rr-user-pen"></i>
              {Strings.tryAnotherAcc[lang]}
            </button>
          </div>
        </section>
      </AnimationWrapper>



      {/* <Section>
      <SectionHeader title={Strings.youAreBanned[lang]} />

      {banInfo.createdAt
        ? <BanInfoCard data={banInfo} owner />
        : <Loader />
      }
    </Section> */}
    </>
  )
}

export default Banned;
