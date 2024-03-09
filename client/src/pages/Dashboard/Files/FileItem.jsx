import { useState } from 'react';
import { Link } from 'react-router-dom';

import { dateFormat, deletedUser } from '@/support/Utils';
import { BACKEND, Strings, imageTypes, videoTypes, fileExt } from '@/support/Constants';

import { UserRole, UserStatus } from '@/components/UserBadge';
import Markdown from '@/components/Markdown';
import BlogContent from '@/components/blog-content.component';

const FileItem = ({ data, moderate, lang }) => {
  const [collapsed, setCollapsed] = useState(true)
  const bodyParse = JSON.parse(data.body)

  const onModerate = ({ type }) => {
    moderate(type, data._id)
  }

  if (data.author === null) {
    data.author = deletedUser
  }

  return (
    <div className="card_block flex">
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
        <div className="card_left empty">
          <div className="attached_info">{fileExt.exec(data.file.url)[1]}</div>
        </div>
      )}

      <div className="card_right">
        <header className="card_head">
          <div className="card_head_inner">
            <Link to={'/file/' + data._id} className="card_title">{data.title}</Link>

            <div className="card_info">
              <Link to={'/user/' + data.author.name} className="head_text bold">
                {data.author.displayName}
                <UserRole role={data.author.role} />
                {data.author.ban && <UserStatus status="ban" />}
              </Link>
              <span className="bullet">•</span>
              <span className="head_text">
                <time>{dateFormat(data.createdAt)}</time>
              </span>
            </div>
          </div>
        </header>

        <div className="card_content markdown">
          {
            data && data.body && bodyParse.blocks.map((block, i) => {
              return <div className='my-4 md:my-8' key={i}>
                <BlogContent block={block} />
              </div>
            })
          }
        </div>

        <footer className="card_foot">
          <a href={BACKEND + data.file.url} className="act_btn foot_btn" target="_blank" rel="noopener noreferrer">
            <i class="fi fi-rr-download"></i>
            <span className="card_count">{Strings.download[lang]}</span>
          </a>
          <div className="act_btn foot_btn text-green hover:bg-green/20" onClick={() => onModerate({ type: 'publish' })}>
            <i class="fi fi-rr-check"></i>
            <span className="card_count">{Strings.publish[lang]}</span>
          </div>
          <div className="act_btn foot_btn text-red hover:bg-red/20" onClick={() => onModerate({ type: 'delete' })}>
            <i class="fi fi-rr-trash"></i>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default FileItem;
