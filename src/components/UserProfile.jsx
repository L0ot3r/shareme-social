import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { googleLogout } from '@react-oauth/google';

import { AiOutlineLogout } from 'react-icons/ai';
import {
	userCreatedPinsQuery,
	userQuery,
	userSavedPinsQuery,
} from '../utils/data';
import { client } from '../client';
import { MasonryLayout, Spinner } from './';

const randomImage =
	'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeBtnStyles =
	'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
	'bg-primary text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = () => {
	const [user, setUser] = useState(null);
	const [pins, setPins] = useState(null);
	const [text, setText] = useState('Created');
	const [activeBtn, setActiveBtn] = useState('created');
	const navigate = useNavigate();
	const { userId } = useParams();

	useEffect(() => {
		const query = userQuery(userId);

		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, [userId]);

	useEffect(() => {
		if (text === 'Created') {
			const createdPinsQuery = userCreatedPinsQuery(userId);

			client.fetch(createdPinsQuery).then((data) => {
				setPins(data);
			});
		} else {
			const savedPinsQuery = userSavedPinsQuery(userId);

			client.fetch(savedPinsQuery).then((data) => {
				setPins(data);
			});
		}
	}, [text, userId]);

	const logoutUser = () => {
		googleLogout();
		localStorage.clear();
		navigate('/');
		window.location.reload();
		console.log('deconnecté !');
	};

	if (!user) return <Spinner message='Chargement du profile ...' />;

	return (
		<div className='relative pb-2 h-full justify-center items-center'>
			<div className='flex flex-col pb-5'>
				<div className='relative flex flex-col mb-7'>
					<div className='flex flex-col justify-center items-center'>
						<img
							src={randomImage}
							alt='banner'
							className='w-full h-370 2xl:h-510 shadow-lg object-cover'
						/>
						<img
							src={user?.image}
							alt='user-pic'
							className='rounded-full w-40 h-40 -mt-20 shadow-xl object-cover'
						/>
						<h1 className='font-bold text-3xl text-center mt-3'>
							{user.userName}
						</h1>
						<div className='absolute top-0 z-1 right-0 p-2'>
							{userId === user?._id || userId !== undefined ? (
								<button
									type='button'
									className='bg-white p-2 rounded-full cursor-pointer outline-none shadow-md'
									onClick={() => logoutUser()}
								>
									<AiOutlineLogout color='red' fontSize={21} />
								</button>
							) : null}
						</div>
					</div>
					<div className='text-center mb-7'>
						<button
							type='button'
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn('created');
							}}
							className={`${
								activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
							}`}
						>
							Created
						</button>
						<button
							type='button'
							onClick={(e) => {
								setText(e.target.textContent);
								setActiveBtn('saved');
							}}
							className={`${
								activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
							}`}
						>
							Saved
						</button>
					</div>
					{pins?.length ? (
						<div className='px-2'>
							<MasonryLayout pins={pins} />
						</div>
					) : (
            <div className='w-full text-center'>
              <h2 className='font-bold text-2xl mt-2'>Nous n'avons rien trouvé :(</h2>
            </div>
          )}
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
