"use client"
import { MainContext } from '@/context/MainContext';
import React, { useContext } from 'react';
import Swal from 'sweetalert2';

const Profile = () => {

    const { user, userdata, setReload } = useContext(MainContext);

    const handleGender = async (e) => {
        e.preventDefault();
        setReload(true)
        const gender = e.target.value;

        try {
            const res = await fetch(`/api/accounts/${user?.email}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ gender: gender })
            })
            const data = await res.json()

            if (data.updatedCount === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }

            setReload(false)
        } catch (error) {
            alert("something Error")
        }

    }

    return (
        <div className='w-full space-y-4'>
            <div className='border-2 border-sky-500 rounded-xl p-2 w-full'>
                <h1 className='text-2xl font-semibold mb-2'>Personal Information</h1>
                <hr />
                <div className='grid md:grid-cols-2 gap-4 p-2'>
                    <h1 className=''>Full Name: <br /> <span className='font-semibold pl-2'>{user?.displayName}</span></h1>
                    <h1>Email: <br /> <span className='pl-2'>{user.email}</span></h1>
                    <h1>Phone: <br /> <span className='pl-2'>+880{userdata.number}</span></h1>
                    <h1>Gender: <br />
                        {
                            userdata.gender ? (
                                <span className='pl-2'>{userdata?.gender}</span>
                            ) : (
                                <select onChange={handleGender} name="gender" className='select'>
                                    <option disabled selected>Select Gender</option>
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
                                <td>Status</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#15547</td>
                                <td>10/02/2025</td>
                                <td>15547</td>
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
                                <td>15547</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Profile;