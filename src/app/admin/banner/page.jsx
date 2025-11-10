"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Swal from 'sweetalert2';

const Banner = () => {

    const [image, setImage] = useState(null)
    const [imagebb, setImagebb] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState();
    const [expireDate, setExpireDate] = useState();

    const [bannerData, setBannerData] = useState([]);
    const [bannerInfo, setBannerInfo] = useState([]);

    useEffect(() => {
        fetch('/api/bannerDB')
            .then(res => res.json())
            .then(data => {
                setBannerData(data.bannersall);
                setBannerInfo(data.bannersall)
            })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.target;
        const image = imagebb;
        const title = form.title.value;
        const sdate = startDate.toLocaleDateString("en-GB");
        const edate = expireDate.toLocaleDateString("en-GB");

        console.log(image, title, sdate, edate)

        const data = { image, title, startDate: sdate, expireDate: edate };

        try {
            const res = await fetch("/api/bannerDB", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const rdata = await res.json()

            if (rdata.success) {
                setBannerInfo([...bannerInfo, data])
                Swal.fire({
                    title: "successfully!",
                    icon: "success",
                    draggable: true
                });

                form.reset();
                setStartDate(null);
                setExpireDate(null);
                setImagebb("");
                setImage(null)

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

    const handleImgUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            const width = img.width;
            const height = img.height;

            const fixedWidth = 1080;
            const fixedHeight = 360;

            if (width === fixedWidth && height === fixedHeight) {
                setImage(URL.createObjectURL(file));
                setError("");

                const formData = new FormData();
                formData.append('image', file)

                try {
                    const apiKey = "45ce3159de1f777d258c50e7e7bb2056";
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();

                    if (data.success) {
                        setImagebb(data.data.url);
                    } else {
                        alert("Image upload failed!");
                    }
                } catch (err) {
                    alert("Error uploading image!");
                } finally {
                    setLoading(false);
                }
            } else {
                setError(`Image must be ${fixedWidth}x${fixedHeight}px. Your image is ${width}x${height}px.`);
                setImage(null);
            }
        };

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
                    console.error(err);
                }
            }
        });
    }

    return (
        <div>
            <h1 className='text-center text-2xl font-semibold'>Banner Section</h1>
            <hr className='' />

            <div className='grid md:grid-cols-2 p-2 md:p-10 gap-10'>
                <form onSubmit={handleSubmit} className=' flex flex-col gap-3'>
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                        onChange={handleImgUpload}
                        type="file"
                        accept='image/*'
                        required
                        className="file-input file-input-info w-full"
                    />
                    <input type="url" required value={imagebb} name="imageLink" readOnly placeholder='Auto Image Link' className='input w-full input-info outline-0' />

                    <input type="text" required name="title" className='input input-info w-full outline-0' placeholder='Type Your Banner Title' />

                    <DatePicker
                        onChange={(date) => setStartDate(date)}
                        selected={startDate}
                        dateFormat="dd-MM-YYYY"
                        minDate={new Date()}
                        required
                        className='input input-info w-full outline-0'
                        placeholderText='Start Date ( Optional )'
                    />

                    <DatePicker
                        onChange={(date) => setExpireDate(date)}
                        selected={expireDate}
                        dateFormat="dd-MM-yyyy"
                        minDate={startDate}
                        required
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
                                alt="Banner Image Privew"
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
            {
                bannerInfo.length > 0 && (
                    <div className='border p-1 md:p-4 rounded-md md:rounded-lg flex flex-col gap-5'>
                        <h1 className='text-center text-2xl font-semibold border-b pb-2'>Uploaded Banner's</h1>
                        {
                            bannerInfo?.map((banner, iDx) => (
                                <div key={iDx} className='flex flex-col md:flex-row md:gap-1' >
                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        className='md:w-1/2 rounded-b-lg md:rounded-bl-none md:rounded-r-lg'
                                    />

                                    <div className='flex justify-between w-full bg-sky-300 p-2 rounded-t-lg md:rounded-t-none md:rounded-l-lg'>
                                        <div className='flex justify-between flex-col'>
                                            <h1><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> {banner.title}</h1>
                                            <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> {banner.startDate}</h2>
                                            <h2><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> {banner.expireDate}</h2>
                                        </div>

                                        <div className='flex flex-col justify-between'>
                                            <button onClick={() => handleDelete(banner._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                            </button>
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block size-4 my-1.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Banner;