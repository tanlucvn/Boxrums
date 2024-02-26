import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'boring-avatars'

const UserCard = ({ data }) => {
  // let {personal_info: {fullname, username, profile_img}} = user
  return (
    <Link to={`/user/${data.name}`} className='flex gap-5 items-center mb-5'>
      <div className='w-14 h-15'>
        <Avatar
          size={"100%"}
          name={data.name}
          variant="marble"
          colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
        />
      </div>
      <div>
        <h1 className='font-medium text-xl line-clamp-2'>{data.displayName}</h1>
        <p className='text-dark-grey'>@{data.name}</p>
      </div>
    </Link>
  )
}

export default UserCard