"use client"
import Image from 'next/image';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Banner = () => {

    const [image, setImage] = useState(null)
    const [imagebb, setImagebb] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const [startDate, setStartDate] = useState();
    const [expireDate, setExpireDate] = useState();

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

            const result = await res.json();
            console.log(result);
            alert("Banner saved successfully!");
        } catch (err) {
            console.error("Error saving banner:", err);
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
                        <div className="relative w-full border">
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
        </div>
    );
};

export default Banner;