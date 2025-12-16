"use client"
import { MainContext } from '@/context/MainContext';
import React, { useContext, useEffect, useState } from 'react';

const Order = () => {

    const { user } = useContext(MainContext);

    return (
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
    );
};

export default Order;