"use client"
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '@/context/MainContext';

const Profile = () => {

    const { user } = useContext(MainContext);
    const [userdata, setUserData] = useState([])

    useEffect(() => {
        if (!user) return;
        fetch(`/api/accounts/${user?.email}`)
            .then(res => res.json())
            .then(data => setUserData(data.finddata))
    }, [user])

    return (
        <div className='md:p-10'>
            <div className='flex flex-col items-center md:items-start md:flex-row gap-4 md:gap-10 p-4 md:p-10 border rounded-lg shadow-2xl shadow-amber-300'>
                <div className='w-24 md:w-48 aspect-square flex justify-center items-center border-2 border-sky-500 rounded-full'>
                    <img src={user?.photoURL} alt="User Profile" className='rounded-full' />
                </div>
                <div className='w-full space-y-4'>
                    <div className='border-2 border-sky-500 rounded-xl p-2 w-full'>
                        <h1 className='text-2xl font-semibold mb-2'>Personal Information</h1>
                        <hr />
                        <div className='grid md:grid-cols-2 gap-4 p-2'>
                            <h1 className=''>Full Name: <br /> <span className='font-semibold'>{user?.displayName}</span></h1>
                            <h1>Email: <br /> {user?.email}</h1>
                            <h1>Phone: <br /> +880 {userdata.number}</h1>
                            <h1>Gender: <br />
                                {
                                    userdata.gender ? (
                                        <h1>{userdata}</h1>
                                    ) : (
                                        <select name="gender" className='select'>
                                            <option>Select Gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Others</option>
                                        </select>
                                    )
                                }
                            </h1>
                        </div>

                    </div>
                    <div className='border-2 border-sky-500 rounded-xl p-2 w-full'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-2xl font-semibold mb-2'>My Address</h1>
                            <div className='flex gap-2'>
                                <button className='btn btn-sm btn-accent'>Home</button>
                                <button className='btn btn-sm btn-secondary'>Office</button>
                                <button className='btn btn-sm btn-primary'>Add Address</button>
                            </div>
                        </div>
                        <hr />
                        <div className='grid md:grid-cols-2 gap-4 p-2'>
                            <div className='border p-2 rounded-lg'>
                                <h1>Abu Sayed Sayed</h1>
                                <h3>+8801761555819</h3>
                                <h2>Salbon Mistripara, Salbon , Rangpur</h2>
                                <h2>Label: Home or Office</h2>
                            </div>
                            <div className='border p-2 rounded-lg'>
                                <h1>Abu Sayed Sayed</h1>
                                <h3>+8801761555819</h3>
                                <h2>Salbon Mistripara, Salbon , Rangpur</h2>
                                <h2>Label: Home or Office</h2>
                            </div>
                        </div>

                    </div>
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
                    <div className='border-2 border-sky-500 rounded-xl p-2 w-full'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-2xl font-semibold mb-2'>Order History</h1>

                        </div>
                        <hr />
                        <div className='p-2 table'>
                            <table>
                                <thead>
                                    <tr>
                                        <td>Order ID</td>
                                        <td>Order Date</td>
                                        <td>Products</td>
                                        <td>Total Amount</td>
                                        <td>Invoice</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#15547</td>
                                        <td>10/02/2025</td>
                                        <td>15547</td>
                                        <td>15547</td>
                                        <td>15547</td>
                                    </tr>
                                    <tr>
                                        <td>#15547</td>
                                        <td>10/03/2025</td>
                                        <td>15547</td>
                                        <td>15547</td>
                                        <td>15547</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;