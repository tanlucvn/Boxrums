import { useState } from 'react';
import { Link } from 'react-router-dom';

import { dateFormat, deletedUser } from '@/support/Utils';
import { BACKEND, Strings, imageTypes, videoTypes, fileExt } from '@/support/Constants';

import { UserRole, UserStatus } from '@/components/UserBadge';
import BlogContent from '@/components/blog-content.component';
import Avatar from 'boring-avatars'
import { AttachCard } from '@/components/Card/Card2';

const FileItem = ({ data, moderate, lang }) => {
  const [collapsed, setCollapsed] = useState(true)

  const onModerate = ({ type }) => {
    moderate(type, data._id)
  }

  if (data.author === null) {
    data.author = deletedUser
  }

  return (
    <div className='bg-grey flex gap-8 items-center border-b border-grey px-7 py-5 mb-4'>
      <div className='w-full'>
        <div className='flex gap-2 items-center mb-7'>
          {data.author !== null ?
            <>
              <Link to={`/user/${data.author.name}`} className="w-8 h-8">
                <Avatar
                  size={"100%"}
                  name={data.author.name}
                  variant="marble"
                  colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                />
              </Link>
              <p className='line-clamp-1'>{data.author.displayName} @{data.author.name}</p>
            </> :
            <>
              <div className="w-6 h-6">
                <Avatar
                  size={"100%"}
                  name={deletedUser.name}
                  variant="marble"
                  colors={['#C20D90']}
                />
              </div>
              <p className='line-clamp-1'>{deletedUser.displayName} @{deletedUser.name}</p>
            </>
          }

          <p className='min-w-fit'>{dateFormat(data.createdAt)}</p>
        </div>
        <h1 className='blog-title'>{data.title}</h1>
        <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>
          {data.desc}
        </p>

        {/* IMG/VIDEO/FILE BOX */}
        <AttachCard data={data} />

        {/* INTERACT BTN */}
        <div className='flex gap-4 mt-7  max-sm:justify-center'>
          <a href={BACKEND + data.file.url} className="act_btn foot_btn text-sky-500 hover:bg-sky-500/20" target="_blank" rel="noopener noreferrer" title={Strings.download[lang]}>
            <i class="fi fi-rr-download"></i>
            <span className="card_count max-sm:hidden">{Strings.download[lang]}</span>
          </a>
          <div className="act_btn foot_btn text-green hover:bg-green/20" onClick={() => onModerate({ type: 'publish' })} title={Strings.publish[lang]}>
            <i class="fi fi-rr-check"></i>
            <span className="card_count max-sm:hidden">{Strings.publish[lang]}</span>
          </div>
          <div className="act_btn foot_btn text-red hover:bg-red/20" onClick={() => onModerate({ type: 'delete' })} title={Strings.delete[lang]}>
            <i class="fi fi-rr-trash"></i>
          </div>
        </div>
      </div>

      <div className="h-28 aspect-square flex justify-center items-center">
        {imageTypes.find(i => i === data.file.type) ? (
          <div
            className="card_left"
            style={{ backgroundImage: `url(${BACKEND + data.file.url})` }}
          />
        ) : videoTypes.find(i => i === data.file.type) ? (
          <div
            className="card_left"
            style={{ backgroundImage: `url(${BACKEND + data.file.thumb})` }}
          >
            <div className="attached_info">{fileExt.exec(data.file.url)[1]}</div>
          </div>
        ) : (
          <div className="card_left empty bg-light-grey">
            <div className="attached_info">{fileExt.exec(data.file.url)[1]}</div>
          </div>
        )}
      </div>

      <div className='h-28 aspect-square bg-grey max-sm:hidden'>
        {
          data.banner ?
            <img src={data.banner} alt="Banner" className='w-full h-full aspect-square object-cover' /> :
            <Avatar
              size={"100%"}
              name={data.title}
              variant="marble"
              colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
              square="true"
            />
        }
      </div>
    </div>
  )
}

export default FileItem;
