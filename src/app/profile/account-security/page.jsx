"use client"
import { MainContext } from '@/context/MainContext';
import React, { useContext, useEffect, useState } from 'react';

const Security = () => {

    const { user } = useContext(MainContext);
    const [userdata, setUserData] = useState([])

    useEffect(() => {
        if (!user) return;
        fetch(`/api/accounts/${user?.email}`)
            .then(res => res.json())
            .then(data => setUserData(data.finddata))
    }, [user])


    return (
        <div>
            <div className='border-2 border-sky-500 rounded-xl p-2 w-full'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-2xl font-semibold mb-2'>Account Security</h1>

                </div>
                <hr />
                <div className='grid md:grid-cols-2 gap-4 p-2'>
                    <label>Current Password</label>
                    <input type="password" className='input' />
                    <label>New Password</label>
                    <input type="password" className='input' />
                    <h2>Email: {user?.email}</h2>
                    <button className='btn btn-sm btn-primary'>Verify Email</button>
                    <h2>Email: {userdata?.number}</h2>
                    <button className='btn btn-sm btn-primary'>Verify Number</button>
                </div>

            </div>
        </div>
    );
};

export default Security;