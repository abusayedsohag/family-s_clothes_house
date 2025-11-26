"use client"
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const Products = () => {

    const [products, setProducts] = useState([])
    const [currentPro, setCurrentPro] = useState([])
    const [itemCount, setItemCount] = useState(5)

    // Paginition
    const [page, setPage] = useState(1)
    const totalPage = Math.ceil(products.length / itemCount);
    const startPage = (page - 1) * itemCount;
    const endPage = startPage + itemCount;
    const currentPage = products.slice(startPage, endPage)


    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => (
                setProducts(data.products),
                setCurrentPro(data.products)
            ))
    }, [currentPro])

    const handleDelete = async (id) => {

        console.log(id)

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const res = await fetch(`/api/products/?id=${id}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })

                    const data = await res.json()

                    if (data.success) {

                        const filter = currentPro.filter(dt => dt._id !== id)
                        setProducts(filter)

                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    } else {
                        Swal.fire({
                            title: "Error!",
                            text: data.message || "Something went wrong",
                            icon: "error"
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Error!",
                        text: error.message || "Something went wrong",
                        icon: "error"
                    });
                }
            };
        })
    }




    return (
        <div>
            <div className='flex justify-between items-center m-1'>
                <h1 className='md:text-2xl font-semibold'>Products List</h1>
                <div className='flex gap-1'>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-dash btn-xs md:btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
                            Items: {itemCount}</div>
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm">
                            {[10, 20, 50, 100].map((num) => (
                                <li key={num}>
                                    <a onClick={() => setItemCount(num)}>{num}</a>
                                </li>
                            ))}

                        </ul>
                    </div>
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-dash btn-xs md:btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                            Filter</div>
                        <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm">
                            <li><a>A-to-Z</a></li>
                            <li><a>Low-to-High</a></li>
                            <li><a>High-to-Low</a></li>
                        </ul>
                    </div>

                    <a href='/admin/products/add' tabIndex={0} role="button" className="btn btn-xs md:btn-sm btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                        Add
                    </a>
                </div>
            </div>
            <hr />
            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th className="flex items-center gap-3">
                                    <input type="checkbox" className="checkbox checkbox-sm" />
                                    <h1>Product Information</h1>
                                </th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Discount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                currentPage?.map((info, iDx) => (
                                    <tr key={iDx}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" className="checkbox checkbox-sm" />
                                                <div className="avatar">
                                                    <div className="mask mask-squircle h-12 w-12">
                                                        <img
                                                            src={info.pImage[0]}
                                                            alt={info.keyword} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{info.pName}</div>
                                                    <div className="text-sm opacity-50">{info.pCategory}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            ৳ {info.salePrice}
                                        </td>
                                        <td>{info.pStock}</td>
                                        <td>{info.discount} %</td>
                                        <td><p className='badge badge-xs badge-dash'>{info.pstatus}</p></td>

                                        <td className=''>
                                            <div className='flex justify-between items-center'>
                                                <a href={`/admin/products/edit?id=${info._id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </a>
                                                <button onClick={() => handleDelete(info._id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
            <hr />
            <div className="p-2 flex justify-between">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="join-item btn btn-xs md:btn-sm btn-outline">Previous page</button>

                <div className='flex gap-1'>
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className={`btn btn-xs md:btn-sm ${page < 3 && "hidden"}`}
                    >
                        1
                    </button>

                    {page > 3 && <span>…</span>}

                    {page > 1 && (
                        <button
                            onClick={() => setPage(page - 1)}
                            className="btn btn-xs md:btn-sm"
                        >
                            {page - 1}
                        </button>
                    )}

                    <button
                        disabled
                        className="btn btn-xs md:btn-sm bg-blue-500 text-white"
                    >
                        {page}
                    </button>

                    {page < totalPage && (
                        <button
                            onClick={() => setPage(page + 1)}
                            className="btn btn-xs md:btn-sm"
                        >
                            {page + 1}
                        </button>
                    )}

                    {page < totalPage - 2 && <span>…</span>}

                    {totalPage > 1 && (
                        <button
                            onClick={() => setPage(totalPage)}
                            disabled={page === totalPage}
                            className={`btn btn-xs md:btn-sm ${page > totalPage - 2 && "hidden"}`}
                        >
                            {totalPage}
                        </button>
                    )}
                </div>

                <button disabled={page === totalPage} onClick={() => setPage(page + 1)} className="join-item btn btn-xs md:btn-sm btn-outline">Next</button>
            </div>
        </div>
    );
};

export default Products;