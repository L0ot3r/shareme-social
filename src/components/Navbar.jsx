import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import { BiUser } from 'react-icons/bi';

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
	const navigate = useNavigate();

	// if(!user) return null;

	return (
		<div className='flex items-center gap-2 md:gap-5 w-full mt-5 pb-7'>
			<div className='flex justify-start items-center w-full p-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
				<IoMdSearch size={21} className='ml-1' />
				<input
					type='text'
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Search ...'
					onFocus={() => navigate('/search')}
					value={searchTerm}
					className='p-2 w-full bg-white outline-none'
				/>
			</div>
			<div className='flex gap-3'>
				{user ? (
					<Link to={`/user-profile/${user?._id}`} className='hidden md:block'>
						<img
							src={user?.image}
							alt='user'
							className='w-14 h-12 rounded-lg'
						/>
					</Link>
				) : (
					<Link
						to={`/login`}
						className='hidden md:flex md:flex-col md:items-center'
					>
						<BiUser className='w-8 h-8 rounded-lg' />
						<p className='text-sm'>Connexion</p>
					</Link>
				)}

				<Link
					to={`create-pin`}
					className='bg-black text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center'
				>
					<IoMdAdd />
				</Link>
			</div>
		</div>
	);
};

export default Navbar;
