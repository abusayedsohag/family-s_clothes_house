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
    const [reload, setReload] = useState(0)

    const [startDate, setStartDate] = useState();
    const [expireDate, setExpireDate] = useState();

    const [promoType, setPromoType] = useState([]);
    // Promo card
    const [promo, setPromo] = useState([]);

    // Modal
    const [typeOpen, setTypeOpen] = useState(false);

    useEffect(() => {
        fetch('/api/promo/type')
            .then(res => res.json())
            .then(data => {
                setPromoType(data.result);
            })
    }, [reload])

    useEffect(() => {
        fetch('/api/promo/add')
            .then(res => res.json())
            .then(data => {
                setPromo(data.result);
            })
    }, [reload])

    const handlePromoType = async (e) => {
        e.preventDefault()

        const form = e.target;
        const type = form.type.value;

        try {
            const respon = await fetch('/api/promo/type',
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ type }),

                })

            const data = await respon.json()

            if (data.success) {
                Swal.fire({
                    title: "Successfully!",
                    icon: "success",
                    draggable: true
                });

                setTypeOpen(false)
                setReload(reload + 1)
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
            });
        }
    }

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

        const data = { promoCode, type, promoValue, minOrder: minOrder || null, maxOrder: maxOrder || null, usageLimit: usageLimit || null, userLimit: userLimit || null, startDate: sdate || todate, expireDate: edate || null };

        try {
            const res = await fetch("/api/promo/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const rdata = await res.json()

            if (rdata.success) {
                setPromo([...promo, data])
                Swal.fire({
                    title: "Successfully!",
                    icon: "success",
                    draggable: true
                });

                setReload(reload + 1)

                form.reset();
                setStartDate(null);
                setExpireDate(null);
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
                    const res = await fetch(`/api/promo/${id}`, {
                        method: "DELETE",
                    });

                    const data = await res.json()

                    if (data.success) {

                        const filterData = promo.filter(dt => dt._id !== id)
                        setPromo(filterData)

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

    // const handleUpdate = async (e, id) => {
    //     e.preventDefault()
    //     const form = e.target;
    //     const title = form.title.value;
    //     const sdate = startDate?.toLocaleDateString("en-GB");
    //     const edate = expireDate?.toLocaleDateString("en-GB");
    //     const today = new Date();
    //     const todate = today.toLocaleDateString("en-GB")

    //     const data = { title, startDate: sdate || todate, expireDate: edate || null };

    //     try {
    //         const res = await fetch(`/api/bannerDB?id=${id}`, {
    //             method: "PUT",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(data),
    //         });

    //         const rdata = await res.json()

    //         if (rdata.success) {
    //             setBannerInfo([...bannerInfo, data])
    //             Swal.fire({
    //                 title: "Update Successfully!",
    //                 icon: "success",
    //                 draggable: true
    //             });

    //             setStartDate(null);
    //             setExpireDate(null);
    //         } else {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Oops...",
    //                 text: "Something went wrong!",
    //             });
    //         }
    //     } catch (err) {
    //         Swal.fire({
    //             icon: "error",
    //             title: "Oops...",
    //             text: { err },
    //         });
    //     }
    // }

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
                                    {
                                        promoType?.map((data, inD) => (
                                            <option key={inD}>{data.type}</option>
                                        ))
                                    }
                                </select>
                            </label>
                            <button onClick={() => setTypeOpen(true)} type='button' className='btn btn-warning'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                            </button>
                        </div>

                        <input type="number" name="promoValue" className='input input-info w-full outline-0 uppercase' placeholder='Enter Promo Value' required />

                        <input type="number" name="minOrder" className='input input-info w-full outline-0' placeholder='Enter Min-Order' />

                        <input type="number" name="maxOrder" className='input input-info w-full outline-0' placeholder='Enter Max-Order' />

                        <input type="number" name="usageLimit" className='input input-info w-full outline-0' placeholder='Enter Usege Limit' />

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
                promo?.length > 0 && (
                    <div className='border p-1 md:p-4 rounded-md md:rounded-lg flex flex-col gap-5'>
                        <h1 className='text-center text-2xl font-semibold border-b pb-2'>Added Promo's</h1>
                        <div className='overflow-scroll'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <td>Promo</td>
                                        <td>Type</td>
                                        <td>Value</td>
                                        <td>Min-Order</td>
                                        <td>Max-Order</td>
                                        <td>Use Limit</td>
                                        <td>Used</td>
                                        <td>Per Limit</td>
                                        <td>S-Date</td>
                                        <td>E-Date</td>
                                        <td>Action</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        promo?.map((data, idX) => (
                                            <tr key={idX}>
                                                <td>{data.promoCode}</td>
                                                <td>{data.type}</td>
                                                <td className='text-center'>{data.promoValue}</td>
                                                <td className='text-center'>{data.minOrder || "-"}</td>
                                                <td className='text-center'>{data.maxOrder || "-"}</td>
                                                <td className='text-center'>{data.usageLimit || "-"}</td>
                                                <td className='text-center'>{data.used || "-"}</td>
                                                <td className='text-center'>{data.userLimit || "-"}</td>
                                                <td className='text-center'>{data.startDate || "-"}</td>
                                                <td className='text-center'>{data.expireDate || "-"}</td>
                                                <td className='flex justify-between'>
                                                    <button
                                                        // onClick={() => handleEdit(data._id)}
                                                        className='h-full'
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(data._id)}
                                                        className='h-full'
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>

                        </div>
                    </div>
                )
            }

            <AddCategory open={typeOpen} onClose={() => setTypeOpen(false)}>
                <h2 className="text-xl text-center font-semibold m-4">Add Promo Type</h2>

                <form onSubmit={(e) => handlePromoType(e)} className="space-y-3">
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