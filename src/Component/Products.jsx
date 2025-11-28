"use client"
import React, { useEffect, useState } from 'react';

const Products = () => {

    const [allProducts, setAllProducts] = useState([]);
    const [showPro, setShowPro] = useState(allProducts)

    const [category, setCategory] = useState([]);
    const [nowCate, setNowCate] = useState()


    useEffect(() => {
        fetch("/api/products")
            .then(res => res.json())
            .then(data => setAllProducts(data.products))
    }, [])

    useEffect(() => {
        fetch("/api/category")
            .then(res => res.json())
            .then(data => setCategory(data.category))
    }, [])

    useEffect(() => {
        if (nowCate) {
            const filterCate = allProducts.filter(cate => cate.pCategory === nowCate)
            setShowPro(filterCate)
        } else {
            setShowPro(allProducts)
        }
    }, [nowCate, allProducts])





    return (
        <div className='grid grid-cols-12 gap-4 w-11/12 mx-auto'>
            <div className='col-span-2 hidden md:block'>
                <fieldset className='fieldset border rounded-md'>
                    <legend className='fieldset-legend text-center text-xl p-2'>Category</legend>
                    <div className="rounded-2xl p-2 space-y-6 flex flex-row md:flex-col">
                        <button onClick={() => setNowCate(null)} className={`rounded-full btn w-full`}>All Products</button>
                        {
                            category?.map((data, iDx) => (
                                <button key={iDx} onClick={() => setNowCate(data.newCate)} className='btn rounded-full'>
                                    {data.newCate}
                                </button>
                            ))
                        }
                    </div>
                </fieldset>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 col-span-12 md:col-span-10'>
                {
                    showPro?.map((data, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl shadow-sky-200">
                            <figure className="px-5 pt-5">
                                <img
                                    src={data?.pImage?.[0]}
                                    alt={data?.pName}
                                    className="rounded-xl" />
                            </figure>
                            <div className="card-body p-5">
                                <h2 className="card-title md:text-2xl font-semibold">{data.pName}</h2>
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