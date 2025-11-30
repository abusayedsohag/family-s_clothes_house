"use client"
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const ProductsDetails = () => {

    const { id } = useParams();

    const [productInfo, setProductInfo] = useState([]);
    const [selectImg, setSelectImg] = useState()

    useEffect(() => {
        fetch(`/api/products?id=${id}`)
            .then(res => res.json())
            .then(data => setProductInfo(data.product))
    }, [])


    return (

        <div className="p-4 md:w-11/12 mx-auto gap-8 md:flex bg-white">
            <div className="w-full md:w-4/7 flex flex-col gap-1">
                <div className="">
                    <img
                        src={selectImg || productInfo?.pImage?.[0]}
                        alt={productInfo.pName}
                        className='w-full aspect-square rounded-lg'
                    />
                </div>
                <div className='w-full overflow-auto'>
                    <div className='flex gap-2'>
                        {
                            productInfo?.pImage?.filter(img => img && img.trim() !== "")
                                .map((data, iDx) => (
                                    <img
                                        key={iDx}
                                        src={data || null}
                                        alt={`${iDx}`}
                                        className={`w-2/12 aspect-square ${selectImg === data && "border border-sky-300"}`}
                                        onClick={() => setSelectImg(data)}
                                        onMouseEnter={() => setSelectImg(data)}
                                    />
                                ))
                        }
                    </div>
                </div>
            </div>
            <div className="space-y-4 mt-10 md:w-3/5">
                <h1 className="font-semibold text-3xl">{productInfo.pName}</h1>
                <p>{productInfo.pShortDes}</p>
                <h3 className="font-semibold text-xl">Price : {productInfo.salePrice}TK <span className='text-sm badge badge-dash'>-{productInfo.discount}%</span></h3>

                <div className="flex gap-4 items-center">
                    <button className="btn bg-purple-600 text-white rounded-full">Add To Card </button>

                    <button className={`border  rounded-full p-3 flex justify-center items-center `}>
                        <i className="fa-regular fa-heart"></i>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductsDetails;