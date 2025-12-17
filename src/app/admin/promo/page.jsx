"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';
import AddCategory from '../Components/AddCategory';

const Promo = () => {

    const [image, setImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState();
    const [expireDate, setExpireDate] = useState();

    const [bannerData, setBannerData] = useState([]);
    const [bannerInfo, setBannerInfo] = useState([]);

    // Modal
    const [typeOpen, setTypeOpen] = useState(false);


    const [edit, setEdit] = useState(null);

    // useEffect(() => {
    //     fetch('/api/bannerDB')
    //         .then(res => res.json())
    //         .then(data => {
    //             setBannerData(data.bannersall);
    //             setBannerInfo(data.bannersall)
    //         })
    // }, [bannerInfo])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const form = e.target;
        const promoCode = form.promoCode.value;
        const type = form.type.value;
        const promoValue = form.promoValue.value;
        const minOrder = form.minOrder.value;
        const maxOrder = form.maxOrder.value;
        const usageLimit = form.usageLimit.value;
        const userLimit = form.userLimit.value;
        const sdate = startDate?.toLocaleDateString("en-GB");
        const edate = expireDate?.toLocaleDateString("en-GB");
        const today = new Date();
        const todate = today.toLocaleDateString("en-GB")

        const data = { promoCode, type, promoValue, minOrder, maxOrder, usageLimit, userLimit, startDate: sdate || todate, expireDate: edate || null };

        // try {
        //     const res = await fetch("/api/bannerDB", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify(data),
        //     });

        //     const rdata = await res.json()

        //     if (rdata.success) {
        //         setBannerInfo([...bannerInfo, data])
        //         Swal.fire({
        //             title: "Successfully!",
        //             icon: "success",
        //             draggable: true
        //         });

        //         form.reset();
        //         setStartDate(null);
        //         setExpireDate(null);
        //         setImagebb("");
        //         setImage(null)

        //     } else {
        //         Swal.fire({
        //             icon: "error",
        //             title: "Oops...",
        //             text: "Something went wrong!",
        //         });
        //     }
        // } catch (err) {
        //     Swal.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: { err },
        //     });
        // }

        console.log(data)
    }

    const handleDelete = async (id) => {

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
                    const res = await fetch(`/api/bannerDB?id=${id}`, {
                        method: "DELETE",
                    });

                    const data = await res.json()

                    if (data.success) {

                        const filterData = bannerData.filter(dt => dt._id !== id)
                        setBannerInfo(filterData)

                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    }

                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: { err },
                    });
                }
            }
        });
    }

    const handleEdit = (id) => {
        const findEdit = bannerInfo.find(dt => dt._id === id)
        setEdit(findEdit)
    }

    const handleUpdate = async (e, id) => {
        e.preventDefault()
        const form = e.target;
        const title = form.title.value;
        const sdate = startDate?.toLocaleDateString("en-GB");
        const edate = expireDate?.toLocaleDateString("en-GB");
        const today = new Date();
        const todate = today.toLocaleDateString("en-GB")

        const data = { title, startDate: sdate || todate, expireDate: edate || null };

        try {
            const res = await fetch(`/api/bannerDB?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const rdata = await res.json()

            if (rdata.success) {
                setBannerInfo([...bannerInfo, data])
                Swal.fire({
                    title: "Update Successfully!",
                    icon: "success",
                    draggable: true
                });

                setStartDate(null);
                setExpireDate(null);

                setEdit(null)

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!",
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: { err },
            });
        }
    }

    return (
        <div>
            <div className=''>
                <h1 className='text-center text-2xl font-semibold'>Promo Section</h1>
                <hr />
                <div className='px-0 p-2 md:p-10 gap-10'>
                    <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-3'>
                        <input type="text" name="promoCode" className='input input-info w-full outline-0 uppercase' placeholder='Type Your Promo or Voucher' required />

                        <div className='flex items-center gap-2'>
                            <label className="select w-full select-warning">
                                <select name='type' className='p-0 ml-0' defaultValue="" required>
                                    <option disabled value="">Select Type</option>
                                    <option>Select Type</option>
                                    {/* {
                                        category?.map((data, inD) => (
                                            <option key={inD}>{data.newCate}</option>
                                        ))
                                    } */}
                                </select>
                            </label>
                            <button onClick={() => setTypeOpen(true)} type='button' className='btn btn-warning'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                            </button>
                        </div>

                        <input type="number" name="promoValue" className='input input-info w-full outline-0 uppercase' placeholder='Enter Promo Value' required />

                        <input type="number" name="minOrder" className='input input-info w-full outline-0' placeholder='Enter Min-Order' required />

                        <input type="number" name="maxOrder" className='input input-info w-full outline-0' placeholder='Enter Max-Order' required />

                        <input type="number" name="usageLimit" className='input input-info w-full outline-0' placeholder='Enter Usege Limit' required />

                        <input type="number" name="userLimit" className='input input-info w-full outline-0' placeholder='Enter User Limit' required />

                        <DatePicker
                            onChange={(date) => setStartDate(date)}
                            selected={startDate}
                            dateFormat="dd-MM-YYYY"
                            minDate={new Date()}
                            className='input input-info w-full outline-0'
                            placeholderText='Start Date ( Optional )'
                        />

                        <DatePicker
                            onChange={(date) => setExpireDate(date)}
                            selected={expireDate}
                            dateFormat="dd-MM-yyyy"
                            minDate={startDate}
                            className='input input-info w-full outline-0'
                            placeholderText='Expire Date ( Optional )'
                        />

                        <input type="submit" value="Upload" className='btn btn-accent' />
                    </form>

                    {
                        edit && (
                            <form onSubmit={(e) => handleUpdate(e, edit._id)} className=' flex flex-col gap-3'>

                                <Image
                                    src={edit.image}
                                    alt={edit.title}
                                    width={1080}
                                    height={360}
                                    sizes="100vw"
                                    unoptimized
                                    style={{ width: "100%", aspectRatio: "3 / 1" }}
                                />


                                <input type="text" required name="title" className='input input-info w-full outline-0' defaultValue={edit.title} placeholder='Type Your Promo Title' />

                                <DatePicker
                                    onChange={(date) => setStartDate(date)}
                                    selected={startDate}
                                    dateFormat="dd-MM-YYYY"
                                    minDate={new Date()}
                                    className='input input-info w-full outline-0'
                                    placeholderText='Start Date ( Optional )'
                                />

                                <DatePicker
                                    onChange={(date) => setExpireDate(date)}
                                    selected={expireDate}
                                    dateFormat="dd-MM-yyyy"
                                    minDate={startDate}
                                    className='input input-info w-full outline-0'
                                    placeholderText='Expire Date ( Optional )'
                                />

                                <input type="submit" value="Update" className='btn btn-accent' />
                            </form>
                        )
                    }


                    {
                        image && (
                            <div className="relative w-full">
                                <Image
                                    src={image}
                                    alt="Promo Image Privew"
                                    width={1080}
                                    height={360}
                                    sizes="100vw"
                                    unoptimized
                                    style={{ width: "100%", aspectRatio: "3 / 1" }}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
            {
                bannerInfo?.length > 0 && (
                    <div className='border p-1 md:p-4 rounded-md md:rounded-lg flex flex-col gap-5'>
                        <h1 className='text-center text-2xl font-semibold border-b pb-2'>Uploaded Promo's</h1>
                        <div className='grid lg:grid-cols-2 gap-3'>
                            {
                                bannerInfo?.map((banner, iDx) => (
                                    <div key={iDx} className='flex flex-col md:flex-row md:gap-1' >
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className='md:w-1/2 rounded-b-lg md:rounded-bl-none md:rounded-r-lg'
                                        />

                                        <div className='flex justify-between w-full bg-sky-300 rounded-t-lg md:rounded-t-none md:rounded-l-lg'>
                                            <div className='flex justify-between flex-col p-2'>
                                                <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> {banner.title}
                                                </div>

                                                <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> {
                                                    banner.startDate ? (banner.startDate) : "Undefined"
                                                }</div>

                                                <div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> {
                                                    banner.expireDate ? (banner.expireDate) : "Undefined"
                                                }</div>
                                            </div>

                                            <div className='flex flex-col justify-between'>
                                                <button
                                                    onClick={() => handleDelete(banner._id)}
                                                    className='h-full p-1 rounded-b-full bg-red-400'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(banner._id)}
                                                    className='h-full p-1 rounded-t-full bg-blue-400'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }

            <AddCategory open={typeOpen} onClose={() => setTypeOpen(false)}>
                <h2 className="text-xl text-center font-semibold m-4">Add Promo Type</h2>

                <form onSubmit={(e) => handleAddCate(e)} className="space-y-3">
                    <div>
                        <label className="font-medium">Promo Type</label>
                        <input
                            type="text"
                            name="type"
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <input type="submit" className='btn btn-warning w-full' value="Add" />
                </form>
            </AddCategory>
        </div>
    );
};

export default Promo;