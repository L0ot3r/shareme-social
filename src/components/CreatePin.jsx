import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories, feedQuery } from '../utils/data';

const CreatePin = ({ user }) => {
	const [title, setTitle] = useState('');
	const [about, setAbout] = useState('');
	const [destination, setDestination] = useState('');
	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useState(false);
	const [category, setCategory] = useState(null);
	const [imageAsset, setImageAsset] = useState(null);
	const [wrongImageType, setWrongImageType] = useState(false);

	const navigate = useNavigate();

	const uploadImage = (e) => {
		const { type, name } = e.target.files[0];

		if (
			type === 'image/png' ||
			type === 'image/svg' ||
			type === 'image/jpeg' ||
			type === 'image/gif' ||
			type === 'image/tiff'
		) {
			setWrongImageType(false);
			setLoading(true);

			client.assets
				.upload('image', e.target.files[0], {
					contentType: type,
					filename: name,
				})
				.then((document) => {
					setImageAsset(document);
					setLoading(false);
				})
				.catch((error) => {
					console.log('Image upload error ', error);
				});
		} else {
			setWrongImageType(true);
		}
	};

	const savePin = () => {
		if (title && about && destination && imageAsset?._id && category) {
			const doc = {
				_type: 'pin',
				title: title,
				about: about,
				destination: destination,
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: imageAsset?._id,
					},
				},
				userId: user._id,
				postedBy: {
					_type: 'postedBy',
					_ref: user._id,
				},
				category: category,
			};

			client.create(doc).then(() => {
				navigate('/');
				client.fetch(feedQuery).then(() => {
					window.location.reload()
				})
			});
		} else {
			setFields(true);
			setTimeout(() => {
				setFields(false);
			}, 2000);
		}
	};

	return (
		<div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
			{fields && (
				<p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>
					Veuillez remplir tous les champs
				</p>
			)}
			<div className='flex xl:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>
				<div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
					<div className='relative flex justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420'>
						{loading && (
							<div className='absolute top-0 bottom-0 right-0 left-0 bg-black opacity-50'>
								<Spinner />
							</div>
						)}
						{wrongImageType && <p>Wrong image type</p>}
						{!imageAsset ? (
							<label>
								<div className='flex flex-col items-center justify-center h-full'>
									<div className='flex flex-col justify-center items-center'>
										<p className='font-bold text-2xl'>
											<AiOutlineCloudUpload />
										</p>
										<p className='text-lg'>Cliquez pour envoyer</p>
									</div>
									<p className='mt-32 text-gray-400 text-center'>
										Formats recommendés: <br /> JPG, SVG, PNG, GIF ou TIFF{' '}
										<br /> Taille inférieur à 20MB
									</p>
								</div>
								<input
									type='file'
									name='upload-image'
									onChange={uploadImage}
									className='w-0 h-0'
								/>
							</label>
						) : (
							<div className='relative h-full'>
								<img
									src={imageAsset?.url}
									alt='uploaded-pic'
									className='h-full w-full'
								/>
								<button
									type='button'
									className='absolute bottom-3 right-3 p-3 rounded-full bg-white opacity-70 hover:opacity-100 text-xl outline-none hover:shadow-md transition-all duration-500 ease-in-out'
									onClick={() => setImageAsset(null)}
								>
									<MdDelete />
								</button>
							</div>
						)}
					</div>
				</div>

				<div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder='Ajoutez un titre'
						className='outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2'
					/>
					{user && (
						<div className='flex gap-2 my-2 items-center bg-white rounded-lg'>
							<img
								src={user.image}
								alt='user-profile'
								className='w-10 h-10 rounded-full'
							/>
							<p className='font-bold'>{user.userName}</p>
						</div>
					)}
					<input
						type='text'
						value={about}
						onChange={(e) => setAbout(e.target.value)}
						placeholder='Decription'
						className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
					/>
					<input
						type='text'
						value={destination}
						onChange={(e) => setDestination(e.target.value)}
						placeholder='Ajoutez un lien'
						className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
					/>
					<div className='flex flex-col'>
						<div>
							<p className='mb-2 font-semibold text-lg sm:text-xl'>
								Selectionnez une categorie
							</p>
							<select
								name=''
								id=''
								onChange={(e) => setCategory(e.target.value)}
								className='outline-none w-4/5 text-base border-b-2 border-gray-200 rounded-md cursor-pointer'
							>
								<option value='other' className='bg-white'>
									Choisir la Categorie
								</option>

								{categories?.map((item) => (
									<option
										value={item.name}
										className='capitalize text-base border-0 outline-none bg-white text-black'
									>
										{item.name.charAt(0).toUpperCase() +
											item.name.slice(1, item.length)}
									</option>
								))}
							</select>
						</div>
						<div className='flex justify-end items-end mt-5'>
							<button
								type='button'
								onClick={savePin}
								className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
							>
								Sauvegarder
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatePin;
