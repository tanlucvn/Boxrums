import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios'
import AnimationWrapper from '../common/page-animation'
import Loader from '../components/Loader'
import toast, { Toaster } from 'react-hot-toast'
import { InputBox } from '@/components/Form/Input'
import { uploadImage } from '../common/cloudinary'
import { storeInSession } from '../common/session'
import { StoreContext } from '@/stores/Store'
import { BACKEND } from '@/support/Constants'
import Avatar from 'boring-avatars'

const profileDataStructure = {
    name: "",
    displayName: "",
    email: "",
    createdAt: "",
    onlineAt: "",
    role: 1,
    bio: "",
    socialLinks: {
        "youtube": "",
        "instagram": "",
        "facebook": "",
        "twitter": "",
        "github": "",
        "website": ""
    }
}
const EditProfile = () => {
    const bioLimit = 150;
    const { user, token } = useContext(StoreContext)

    const [profile, setProfile] = useState(profileDataStructure)
    const [loading, setLoading] = useState(true)
    const [charactersLeft, setCharactersLeft] = useState(bioLimit)
    const [updateProfileImg, setUpdatedProfileImg] = useState(null)

    const profileImageEle = useRef()
    const editProfileForm = useRef()

    useEffect(() => {
        if (token) {
            axios.get(BACKEND + '/api/profile',
                {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(({ data }) => {
                    setProfile(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
    }, [token])

    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length)
    }

    const urlRegex = {
        youtube: /^(https?:\/\/)?(www\.)?(youtube\.com\/(channel\/|user\/)?[a-zA-Z0-9_-]+)(\/)?$/,
        facebook: /^(https?:\/\/)?(www\.)?(facebook\.com\/[a-zA-Z0-9._-]+)(\/)?$/,
        twitter: /^(https?:\/\/)?(www\.)?(twitter\.com\/[a-zA-Z0-9_]+)(\/)?$/,
        github: /^(https?:\/\/)?(www\.)?(github\.com\/[a-zA-Z0-9_-]+)(\/)?$/,
        instagram: /^(https?:\/\/)?(www\.)?(instagram\.com\/[a-zA-Z0-9._-]+)(\/)?$/,
        website: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9_-]+\.[a-zA-Z]+)(\/)?$/
    };

    const isValidSocialLink = (link, platform) => {
        return urlRegex[platform].test(link);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(editProfileForm.current);

        const formData = {};
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        const { displayName, bio, youtube, facebook, twitter, github, instagram, website } = formData;

        if (displayName.length < 3) {
            return toast.error('Display name should be at least 3 letters long');
        }

        if (bio.length > bioLimit) {
            return toast.error(`Bio should not be more than ${bioLimit} characters`);
        }

        const socialPlatforms = ['youtube', 'facebook', 'twitter', 'github', 'instagram', 'website'];
        for (let platform of socialPlatforms) {
            const link = formData[platform];
            if (link && !isValidSocialLink(link, platform)) {
                return toast.error(`${platform} link is invalid. You must enter a valid link.`);
            }
        }

        const loadingToast = toast.loading('Updating...');

        axios.put(BACKEND + '/api/profile/edit', {
            userId: user.id,
            displayName,
            bio,
            socialLinks: { youtube, facebook, twitter, github, instagram, website }
        }, {
            headers: {
                'Authorization': "Bearer " + token
            }
        })
            .then((response) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute('disabled');
                toast.success("Profile updated successfully :)");
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute('disabled');
                const errorMessage = error.response?.data?.error || 'An error occurred while updating profile';
                toast.error(errorMessage);
            });
    }


    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    <form ref={editProfileForm}>
                        <Toaster />
                        <h1 className='max-md:hidden'>Edit Profile</h1>
                        <div className='flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10'>
                            <div className='max-lg:center mb-5'>
                                <div className='w-48 h-48'>
                                    <Avatar
                                        size={'100%'}
                                        name={profile.name}
                                        variant="marble"
                                        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                                    />
                                </div>
                            </div>

                            <div className='w-full'>
                                <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                                    <div>
                                        <InputBox name='name' type='text' value={profile.name} placeholder='Full Name' icon='fi-rr-at' disable={true} />
                                    </div>
                                    <div>
                                        <InputBox name='email' type='email' value={profile.email} placeholder='Email' icon='fi-rr-envelope' disable={true} />
                                    </div>
                                </div>

                                <InputBox type="text" name="displayName" value={profile.displayName} placeholder='Display name' icon='fi-rr-user' />
                                <p className='text-dark-grey -mt-3'>Username will use to search user and will be visible to all users</p>

                                <textarea name="bio" maxLength={bioLimit} defaultValue={profile.bio} className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5' placeholder='Bio' onChange={handleCharacterChange}></textarea>
                                <p className='mt-1 text-dark-grey'>{charactersLeft} characters left</p>

                                <p className='my-6 text-dark-grey'>Add your social handles below</p>

                                <div className='md:grid md:grid-cols-2 gap-x-6'>
                                    {
                                        Object.keys(profile.socialLinks).map((key, i) => {
                                            const link = profile.socialLinks[key];
                                            return <InputBox key={i} name={key} type='text' value={link} placeholder='https://' icon={"fi " +
                                                (key !== "website" ? "fi-brands-" + key : "fi-rr-globe")} />
                                        })
                                    }
                                </div>

                                <button className='btn-dark w-auto px-10' type='submit' onClick={handleSubmit}>Update</button>

                            </div>
                        </div>
                    </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile