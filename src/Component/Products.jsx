"use client"
import React, { useEffect, useState } from 'react';

const Products = () => {

    const [allProducts, setAllProducts] = useState([])

    console.log(allProducts);


    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => setAllProducts(data.products))
    }, [])





    return (
        <div className='grid grid-cols-12 md:w-11/12 mx-auto'>
            <div className='col-span-2'>
                <div className="border bg-white rounded-2xl p-6 space-y-6">
                    <button to='/' className={({ isActive }) => `rounded-full btn w-full ${isActive ? 'bg-purple-600 text-white' : 'text-black hover:bg-purple-600 hover:text-white'}`}>All Products</button>

                    {
                        <button
                            className={({ isActive }) => `rounded-full btn w-full ${isActive ? 'bg-purple-600 text-white' : 'text-black hover:bg-purple-600 hover:text-white'}`}>{"category"}</button>
                    }
                </div>
            </div>
            <div className='grid grid-cols-3 gap-4 col-span-10'>
                {
                    allProducts?.map((data, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl shadow-sky-200">
                            <figure className="px-5 pt-5">
                                <img
                                    src={data?.pImage?.[0]}
                                    alt={data?.pName}
                                    className="rounded-xl" />
                            </figure>
                            <div className="card-body p-5">
                                <h2 className="card-title text-2xl font-semibold">{data.pName}</h2>
                                <p className="text-start">Price: ${data.price}</p>
                                <div className="card-actions">
                                    <a to={`/productDetails/${data.price}`}>
                                        <button className="btn btn-primary btn-outline rounded-full">View Details</button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Products;