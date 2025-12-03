"use client"
import Spinner from '@/app/admin/Components/Spinner';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const EditPro = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [mainPro, setMainPro] = useState([])
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);

    const [images, setImages] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(null)

    const [regular, setRegular] = useState("")
    const [discount, setDiscount] = useState("")

    const [selectedSizes, setSelectedSizes] = useState([]);

    useEffect(() => {
        fetch(`/api/products?id=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setMainPro(data.product);
                setImages(data.product?.pImage || Array(6).fill(""));
                setRegular(data.product?.rPrice || "");
                setDiscount(data.product?.discount || "");
                setSelectedSizes(data.product?.sizes || []);
            });
    }, [id]);

    useEffect(() => {
        fetch("/api/category")
            .then(res => res.json())
            .then(data => setCategory(data.category))
    }, [])

    useEffect(() => {
        fetch("/api/brand")
            .then(res => res.json())
            .then(data => setBrand(data.brand))
    }, [])


    const handleImgUpload = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(index)

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        img.onload = async () => {
            const width = img.width;
            const height = img.height;

            if (width === height) {
                const formData = new FormData();
                formData.append('image', file)

                try {
                    const apiKey = "be11c4ec521ea545fa7a526e92d4ac66";
                    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                        method: "POST",
                        body: formData,
                    });

                    const data = await res.json();

                    if (data.success) {
                        const imageURL = data.data.url;

                        if (images.includes(imageURL)) {
                            alert("dublicate")
                            return;
                        }

                        const fullUpdate = [...images]
                        fullUpdate[index] = data.data.url;
                        setImages(fullUpdate);
                    } else {
                        alert("Image upload failed!");
                    }
                } catch (err) {
                    alert("Error uploading image!");
                } finally {
                    setLoading(null);
                }
            } else {
                alert("size error")
                setLoading(null);
            }
        };
    }

    const calDiscount = (price, discount) => {
        const salePrice = price - (price * (discount / 100))
        return salePrice;
    }

    const handleSizeChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;

        if (value === "ALL") {
            if (checked) {
                setSelectedSizes(["ALL"]);
            } else {
                setSelectedSizes([]);
            }
            return;
        }

        let newSizes = selectedSizes.filter(s => s !== "ALL");

        if (checked) {
            newSizes.push(value);
        } else {
            newSizes = newSizes.filter(s => s !== value);
        }

        setSelectedSizes(newSizes);
    };

    const handleDeleteImage = (index) => {
        const updated = [...images];
        updated[index] = "";
        setImages(updated);
    };

    const handleSUbmit = async (e) => {
        e.preventDefault()
        const form = e.target;

        if (selectedSizes.length === 0) {
            alert("Please select at least one size!");
            return;
        }

        const pData = {
            pImage: images,
            pName: form.pName.value,
            pCode: form.pCode.value,
            pCategory: form.pCategory.value,
            pBrand: form.pBrand.value,
            pDes: form.pDes.value,
            pShortDes: form.pShortDes.value,
            pKey: form.pKey.value,
            rPrice: regular,
            discount,
            salePrice: calDiscount(regular, discount),
            pStock: form.pStock.value,
            pstatus: form.pstatus.value,
            sizes: selectedSizes,
        };

        try {
            const respon = await fetch('/api/products',
                {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ id, pData }),

                })

            const rdata = await respon.json()

            console.log(rdata)

            if (rdata.success) {
                Swal.fire({
                    title: "Updated!",
                    icon: "success",
                    draggable: true
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: rdata.message,
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


    return (
        <div>
            <h1 className='text-2xl font-semibold text-center'>Products Information</h1>

            <hr />
            <form onSubmit={handleSUbmit} className='grid grid-cols-1 lg:grid-cols-3 gap-5 py-5'>

                <div className='grid grid-cols-3 gap-0.5 md:gap-2 grid-rows-3'>
                    {images.map((img, index) => (
                        <div key={index} className={`cursor-pointer relative group flex items-center justify-center border aspect-square rounded border-neutral-300 bg-base-300 ${index === 0 ? "col-span-2 row-span-2" : ""
                            }`} >
                            {img ? (loading === index ? (
                                <Spinner></Spinner>
                            ) :
                                (<>
                                    <img
                                        src={img}
                                        alt={`img-${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Hover delete */}
                                    <div className="absolute bottom-0 right-0 md:opacity-0
                                    md:translate-x-10 group-hover:opacity-100 group-hover:translate-0 transition-all ease-in-out duration-500 bg-white flex py-1 gap-5 px-2 rounded-l-2xl">

                                        <label
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name={`image${index}`}
                                                className="sr-only"
                                                onChange={(e) => handleImgUpload(index, e)}
                                            />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </label>
                                        <button
                                            type="button"

                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                        </button>

                                    </div>
                                </>)
                            ) : (
                                loading === index ? (
                                    <Spinner></Spinner>
                                ) : (
                                    <label className="w-full h-full flex items-center justify-center cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            name={`image${index}`}
                                            className="sr-only"
                                            required={index === 0}
                                            onChange={(e) => handleImgUpload(index, e)}
                                        />
                                    </label>
                                )
                            )}
                        </div>
                    ))}
                </div>

                <div className='lg:col-span-2 gap-5 grid lg:grid-cols-2'>
                    <label className="input w-full validator">

                        <input
                            type="text"
                            defaultValue={mainPro.pName}
                            required
                            className='capitalize'
                            name='pName'
                            placeholder="Product Name or Title"
                            title="Enter your Products Title or Name"
                        />
                    </label>

                    <label className="input w-full validator">

                        <input
                            type="text"
                            defaultValue={mainPro.pCode}
                            required
                            name='pCode'
                            placeholder="Product Code"
                            minLength="3"
                            maxLength="6"
                            title="Products Code"
                        />
                    </label>

                    <label className="select w-full select-warning">
                        <select name='pCategory' className='p-0 ml-0' required>
                            {
                                category?.map((data, indeX) => (
                                    <option key={indeX} selected={mainPro.pCategory === data.newCate}>{data.newCate}</option>
                                ))
                            }
                        </select>
                    </label>

                    <label className="select w-full select-warning">
                        <select name='pBrand' className='p-0 ml-0' required>
                            {
                                brand?.map((data, indeX) => (
                                    <option key={indeX} selected={mainPro.pBrand === data.newBrand}>{data.newBrand}</option>
                                ))
                            }
                        </select>
                    </label>

                    <label className="input w-full validator">

                        <input
                            type="text"
                            defaultValue={mainPro.pKey}
                            required
                            name='pKey'
                            placeholder="Keyword"
                            title="SEO Keywords"
                        />
                    </label>


                    <label className="input w-full validator">

                        <input
                            type="number"
                            value={regular}
                            onChange={(e) => setRegular(e.target.value)}
                            required
                            name='rPrice'
                            placeholder="Regular Price"
                        />
                    </label>

                    <label className="input w-full validator">

                        <input
                            type="number"
                            required
                            value={discount}
                            onChange={(e) => {
                                let value = Number(e.target.value);

                                if (value < 0) return value = 0;
                                if (value > 100) return value = 100;

                                e.target.value = value;
                                setDiscount(value);
                            }}
                            name='discount'
                            placeholder="Discount (%)"
                        />
                    </label>

                    <label className="input w-full validator">

                        <input
                            type="number"
                            required
                            name='salePrice'
                            defaultValue={calDiscount(regular, discount)}
                            readOnly
                            placeholder="Discount Price"
                        />
                    </label>


                    <label className="input w-full validator">

                        <input
                            type="number"
                            defaultValue={mainPro.pStock}
                            required
                            name='pStock'
                            placeholder="Stock Quantity"
                        />
                    </label>


                    <label className="select w-full select-warning">

                        <select required name='pstatus' defaultValue={mainPro.pstatus}>
                            <option disabled value="">Select Status</option>
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                            <option>Pre-order</option>
                        </select>
                    </label>

                    <label className="textarea w-full flex">

                        <textarea required name='pDes' defaultValue={mainPro.pDes} className="pl-2 w-full" placeholder="Description" ></textarea>
                    </label>

                    <label className="textarea w-full flex">

                        <textarea required name='pShortDes' defaultValue={mainPro.pShortDes} className="pl-2 w-full" placeholder="Short Description"></textarea>
                    </label>

                    <div className='input py-6 md:py-0 w-full flex gap-5 outline-0 items-center'>
                        <h1>Size:</h1>
                        <ul className='flex gap-3'>
                            {["ALL", "XS", "S", "M", "L", "XL", "XXL"].map(size => (
                                <li key={size} className='list-none flex flex-col md:flex-row justify-center items-center gap-1'>
                                    <input
                                        type="checkbox"
                                        name="sizes"
                                        value={size}
                                        checked={selectedSizes.includes(size)}
                                        onChange={handleSizeChange}
                                        className="checkbox checkbox-xs checkbox-warning"
                                    />
                                    {size}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <input type="submit" value="Upload" className='btn btn-primary' />
                </div>
            </form>
        </div>
    );
};

export default EditPro;