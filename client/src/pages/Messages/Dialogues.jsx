import { createContext, useContext, useEffect, useState } from 'react';

import { Outlet, useLocation } from 'react-router-dom'
import { StoreContext } from '@/stores/Store';

import { useMoreFetch } from '@/hooks/useMoreFetch';

import { Strings } from '@/support/Constants';
import Socket, { joinToRoom, leaveFromRoom } from '@/support/Socket';

import Breadcrumbs from '@/components/Breadcrumbs';
import DataView from '@/components/DataView';
import { DialoqueCard } from '@/components/Card/Card2';
import Avatar from 'boring-avatars'

export const DialogueContext = createContext({})
const Dialogues = () => {
  const { user, token, lang } = useContext(StoreContext)
  const { loading, moreLoading, noData, items, setItems } = useMoreFetch({ method: 'dialogues', auth: true })
  const [dialogue, setDialogue] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const [initPage, setInitPage] = useState(location.pathname === '/messages');
  document.title = 'Forum | ' + Strings.messages[lang]

  useEffect(() => {
    joinToRoom('dialogues:' + user.id, { token })
    return () => {
      leaveFromRoom('dialogues:' + user.id)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Socket.on('newDialogue', (data) => {
      setItems(prev => [data, ...prev])
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    Socket.on('updateDialogue', (data) => {
      let newArray = [...items]
      newArray[newArray.findIndex(item => item._id === data._id)] = data

      setItems(newArray)
    })
    // eslint-disable-next-line
  }, [items])

  useEffect(() => {
    setInitPage(location.pathname === '/messages');
  }, [location.pathname]);

  useEffect(() => {
    if (initPage && Object.keys(dialogue).length > 0) {
      setDialogue({});
    }
  }, [initPage, dialogue]);

  // console.log("dialogue", dialogue)

  return (
    <DialogueContext.Provider value={{ dialogue, setDialogue }}>
      <div class="flex h-screen antialiased">
        <div class="flex flex-row h-full w-full overflow-x-hidden gap-3">
          <div class="flex flex-col py-8 pl-6 pr-6 border-r-2 border-grey w-64 bg-white flex-shrink-0 max-md:hidden">
            <div
              class="flex flex-col items-center bg-grey border border-light-grey mt-4 w-full py-6 px-4 rounded-lg"
            >
              <div class="h-20 w-20">
                <Avatar
                  size={"100%"}
                  name={dialogue.user ? dialogue.user.name : "null"}
                  variant="marble"
                  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                />
              </div>
              <div class="text-sm font-semibold mt-2">@{dialogue.user ? dialogue.user.name : "None"}</div>
              <div class="text-xs text-dark-grey/80">{dialogue.user ? dialogue.user.name : "None"}</div>
              <div class="flex flex-row items-center mt-3">
                {dialogue.user ? dialogue.user.karma : "None"} Points
              </div>
            </div>

            <div class="flex flex-col mt-8">
              <div class="flex flex-row items-center justify-between text-xs">
                <span class="font-bold">Active Conversations</span>
                <span
                  class="flex items-center justify-center bg-grey h-5 w-5 rounded-full font-medium"
                >
                  {items.length}
                </span>
              </div>

              <DataView
                data={items}
                noData={noData}
                loading={loading}
                moreLoading={moreLoading}
                card={DialoqueCard}
                noDataMessage={Strings.noMessagesYet[lang]}
                errorMessage={Strings.unableToDisplayMessages[lang]}
              />

              {/* <div class="flex flex-row items-center justify-between text-xs mt-6">
                <span class="font-bold">Archivied</span>
                <span
                  class="flex items-center justify-center bg-grey h-5 w-5 rounded-full font-medium"
                >
                  7
                </span  >
              </div>

              <div class="flex flex-col space-y-1 mt-4 -mx-2">
                <button
                  class="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                >
                  <div
                    class="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                  >
                    H
                  </div>
                  <div class="ml-2 text-sm font-semibold">Henry Boyd</div>
                </button>
              </div> */}
            </div>
          </div>

          <div className="flex flex-col flex-auto mb-[6rem] w-full">
            {initPage ? <div>Hello</div> : <Outlet />}
          </div>


            <div className="flex flex-col flex-auto mb-[6rem] w-[500px] py-6">
              {!initPage &&
                <>
              {/* <!-- Sidebar Header --> */}
              <div class="flex items-center justify-between px-4">
                <h2 class="text-xl font-semibold text-black">Search</h2>
                <button x-on:click="open = false" class="text-gray-500 hover:text-gray-700">
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" x-description="Heroicon name: x" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              {/* <!-- Search Input --> */}
              <div class="mt-4 px-4">
                <input type="text" placeholder="Search post here" class="w-full p-2 border border-gray-300 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"/>
              </div>
              <div class="mt-4 px-4">
                <p class="ml-2 text-gray-400">Results</p>
              </div>
              {/* <!-- Sidebar Content --> */}
              <div class="mt-4 px-4 h-full overflow-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* <!-- Card 1 --> */}
                  <div class="bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                    <h3 class="text-lg font-semibold text-black mb-2">Card 1</h3>
                    <p class="text-gray-600">Content for card 1.</p>
                  </div>
                  {/* <!-- Card 2 --> */}
                  <div class="bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                    <h3 class="text-lg font-semibold text-black mb-2">Card 2</h3>
                    <p class="text-gray-600">Content for card 2.</p>
                  </div>
                  {/* <!-- Card 3 --> */}
                  <div class="bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                    <h3 class="text-lg font-semibold text-black mb-2">Card 3</h3>
                    <p class="text-gray-600">Content for card 3.</p>
                  </div>
                  {/* <!-- Card 4 --> */}
                  <div class="bg-gray-50 hover:bg-gray-100 p-4 cursor-pointer rounded-md border border-gray-300 transition-colors duration-300">
                    <h3 class="text-lg font-semibold text-black mb-2">Card 4</h3>
                    <p class="text-gray-600">Content for card 4.</p>
                  </div>
                </div>
              </div>
              {/* <!-- Sidebar Footer --> */}
              <div class="mt-6 px-4">
                <button class="flex justify-center items-center bg-black text-white rounded-md text-sm p-2 gap-1">
                  <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z" fill="currentColor"></path>
                    </g>
                  </svg> Filters </button>
              </div>
                </>
              }
            </div>
        </div>
      </div>
    </DialogueContext.Provider>
  )
}

export default Dialogues;
