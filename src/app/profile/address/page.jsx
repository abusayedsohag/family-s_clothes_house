import React from 'react';

const Address = () => {
    return (

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
    );
};

export default Address;