"use client"
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '@/context/MainContext';

const Profile = ({ children }) => {

    const { user } = useContext(MainContext);
    const [userdata, setUserData] = useState([])

    useEffect(() => {
        if (!user) return;
        fetch(`/api/accounts/${user?.email}`)
            .then(res => res.json())
            .then(data => setUserData(data.finddata))
    }, [user])

    return (
        <div className='md:p-8'>
            <div className='flex flex-col items-center md:items-start md:flex-row gap-4 md:gap-10 p-4 md:p-8 border rounded-lg shadow-2xl shadow-amber-300'>
                <div className='flex flex-col justify-center items-center'>
                    <div className='w-24 md:w-48 aspect-square flex justify-center items-center border-2 border-sky-500 rounded-full'>
                        <img src={user?.photoURL} alt="User Profile" className='rounded-full' />
                    </div>
                    <h1 className='font-semibold text-xl'>{user?.displayName}</h1>
                    <h1 className=''>{userdata?.number}</h1>
                    <div className='border-2 border-sky-500 rounded-xl overflow-hidden w-full flex flex-col'>
                        <a href='/profile' className='btn btn-sm'>My Profile</a>
                        <a href='/profile/address' className='btn btn-sm'>Delivary Address</a>
                        <a href='/profile/orders' className='btn btn-sm'>My Orders</a>
                        <a href='/profile/account-security' className='btn btn-sm'>Security</a>
                        <a href='' className='btn btn-sm'>Wishlist</a>
                        <a href='' className='btn btn-sm'>Reviews</a>
                    </div>
                </div>
                <div className='w-full space-y-4'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Profile;