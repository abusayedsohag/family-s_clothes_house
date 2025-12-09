"use client"
import React, { useContext } from 'react';
import { MainContext } from '@/context/MainContext';

const Profile = () => {

    const { user } = useContext(MainContext)
    if (!user) {
        return
    }

    return (
        <div className='flex gap-10 p-10 border rounded-lg shadow-2xl shadow-amber-300'>
            <div className='w-48 aspect-square flex justify-center items-center border-2 border-sky-500 rounded-full'>
                <img src={user.photoURL} alt="Admin Profile" className='rounded-full' />
            </div>
            <div className='border-2 border-sky-500 p-4 w-full'>
                <h1 className='font-semibold text-lg'>Name: {user.displayName}</h1>
                <h1>Email: {user.email}</h1>
                <h1></h1>
            </div>
        </div>
    );
};

export default Profile;