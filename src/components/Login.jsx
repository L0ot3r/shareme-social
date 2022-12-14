import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { shareVideo, logoWhite } from '../assets';
import jwt_decode from 'jwt-decode';

import { client } from '../client';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
	const navigate = useNavigate();

	const handleCallbackResponse = (response) => {
		const userObject = jwt_decode(response.credential);
		localStorage.setItem('user', JSON.stringify(userObject));

		const { name, sub, picture } = userObject;
		const doc = {
			_type: 'user',
			_id: sub,
			userName: name,
			image: picture,
		};

		client.createIfNotExists(doc).then(() => {
			navigate('/', { replace: true });
		});
	};

	return (
		<div className='flex justify-start items-center flex-col h-screen'>
			<div className='relative w-full h-full'>
				<video
					src={shareVideo}
					type='video/mp4'
					loop
					controls={false}
					muted
					autoPlay
					className='w-full h-full object-cover'
				/>
				<div className='absolute flex flex-col justify-center items-center bottom-0 left-0 right-0 top-0 bg-blackOverlay'>
					<div className='p-5'>
						<img src={logoWhite} alt='logo' width='130px' />
					</div>
					<div className='shadow-2xl'>
						<GoogleLogin
							onSuccess={handleCallbackResponse}
							onError={(err) => {
								console.log(err);
							}}
							shape='pill'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
