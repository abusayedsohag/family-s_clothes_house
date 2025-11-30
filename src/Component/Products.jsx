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
        <div className='grid md:grid-cols-12 gap-4 w-11/12 mx-auto'>
            <div className='md:hidden col-span-12 flex gap-1 overflow-scroll'
                style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                }}>
                <button onClick={() => setNowCate(null)} className={`rounded-sm p-1 btn btn-xs`}>All Products</button>
                {
                    category?.map((data, iDx) => (
                        <button key={iDx} onClick={() => setNowCate(data.newCate)} className='rounded-sm p-1 btn btn-xs'>
                            {data.newCate}
                        </button>
                    ))
                }
            </div>
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
                    showPro.length === 0 ? (
                        <div className='col-span-2 md:col-span-3 flex justify-center items-center'>
                            <img
                                src="/no_pro.jpg"
                                alt="No Products Found"
                                className='w-1/2'
                            />
                        </div>
                    ) : (

                        showPro?.map((data, index) => (
                            <a href={`/products/${data._id}`} key={index} className="card border border-amber-300 bg-base-100 shadow-xl shadow-sky-200 transition-transform duration-75 md:duration-400 hover:scale-105 active:scale-105">
                                <figure className="px-2 pt-2 lg:px-5 lg:pt-5">
                                    <div className='relative'>
                                        <img
                                            src={data?.pImage?.[0]}
                                            alt={data?.pName}
                                            className="rounded-xl"
                                        />
                                        <div className='absolute top-2 right-0 rounded-l-full bg-blue-700 w-1/3'>
                                            {
                                                data.discount !== 0 && (
                                                    <h1 className='text-white text-center'>-{data.discount}%</h1>
                                                )
                                            }
                                        </div>
                                    </div>

                                </figure>
                                <div className="card-body p-2 lg:p-5">
                                    <h2 className="card-title text-sm lg:text-lg font-semibold line-clamp-2">{data.pName}</h2>
                                    <p className="text-start text-lg font-semibold">৳{data.salePrice}
                                        {
                                            data.discount !== 0 && (
                                                <span className='text-sm px-2 line-through text-gray-500'>৳{data.rPrice}</span>
                                            )
                                        }
                                    </p>
                                    <div className='flex justify-between'>
                                        <button className='w-1/2 bg-blue-300 rounded-r-full text-xs font-semibold py-2 md:py-3'>Add Card</button>
                                        <button className='w-1/2 bg-amber-300 rounded-l-full text-xs font-semibold py-2 md:py-3'>Buy</button>
                                    </div>
                                </div>

                            </a>
                        ))

                    )
                }
            </div>
        </div>
    );
};

export default Products;