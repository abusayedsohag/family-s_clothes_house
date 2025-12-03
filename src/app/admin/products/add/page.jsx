"use client"
import AddCategory from '@/app/admin/Components/AddCategory';
import Spinner from '@/app/admin/Components/Spinner';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AddPro = () => {


    const [images, setImages] = useState(Array(6).fill(""));
    const [loading, setLoading] = useState(null)

    const [reload, getReload] = useState(1)

    const [regular, setRegular] = useState("")
    const [discount, setDiscount] = useState("")

    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState([]);

    const [selectedSizes, setSelectedSizes] = useState([]);

    // Category Modal
    const [cateOpen, setCateOpen] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);


    useEffect(() => {
        fetch("/api/category")
            .then(res => res.json())
            .then(data => setCategory(data.category))
    }, [reload])

    useEffect(() => {
        fetch("/api/brand")
            .then(res => res.json())
            .then(data => setBrand(data.brand))
    }, [reload])

    // Brand Add Form
    const handleAddBrand = async (e) => {
        e.preventDefault()

        const form = e.target;
        const newBrand = form.newBrand.value;

        try {
            const respon = await fetch('/api/brand',
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ newBrand }),

                })

            const data = await respon.json()

            if (data.success) {
                Swal.fire({
                    title: "Successfully!",
                    icon: "success",
                    draggable: true
                });

                setBrandOpen(false)
                getReload(reload + 1)
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

    // Category Add Form
    const handleAddCate = async (e) => {
        e.preventDefault()

        const form = e.target;
        const newCate = form.newCate.value;

        try {
            const respon = await fetch('/api/category',
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ newCate }),

                })

            const data = await respon.json()

            if (data.success) {
                Swal.fire({
                    title: "Successfully!",
                    icon: "success",
                    draggable: true
                });

                setCateOpen(false)
                getReload(reload + 1)
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
                // setError(`Image must be ${fixedWidth}x${fixedHeight}px. Your image is ${width}x${height}px.`);
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

        const pImage = images
        const pName = form.pName.value;
        const pCode = form.pCode.value;
        const pCategory = form.pCategory.value;
        const pBrand = form.pBrand.value;
        const pDes = form.pDes.value;
        const pShortDes = form.pShortDes.value;
        const pKey = form.pKey.value;
        const rPrice = form.rPrice.value;
        const discount = form.discount.value;
        const salePrice = form.salePrice.value;
        const pStock = form.pStock.value;
        const pstatus = form.pstatus.value;
        const sizes = [...form.sizes]
            .filter(input => input.checked)
            .map(input => input.value);

        if (selectedSizes.length === 0) {
            alert("Please select at least one size!");
            return;
        }

        const pData = { pImage, pName, pCode, pCategory, pBrand, pDes, pShortDes, pKey, rPrice, discount, salePrice, pStock, pstatus, sizes }

        console.log(pData)

        try {
            const respon = await fetch('/api/products',
                {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify(pData),

                })

            const rdata = await respon.json()

            if (rdata.success) {
                Swal.fire({
                    title: "Successfully!",
                    icon: "success",
                    draggable: true
                });

                form.reset();
                setImages(Array(6).fill(""));
                setDiscount("")
                setRegular("")
                setSelectedSizes([])
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <desc>
                                Auto Correction Check Streamline Icon: https://streamlinehq.com
                            </desc>
                            <g id="auto-correction-check">
                                <path id="Union" fill="url(#paint0_linear_9371_4771)" fillRule="evenodd" d="M1.23805 7.43663c.01835-.09131.03943-.20243.06344-.32903.03673-.1936.08033-.42344.13156-.67409h2.14712c.05122.25063.09482.48044.13154.67403.02402.1266.04511.23778.06346.32909.06801.33841.39748.55761.73589.4896.33841-.06802.55762-.39749.4896-.7359-.01527-.07601-.03381-.17404-.05567-.28962-.10464-.55328-.28537-1.50881-.54797-2.37675-.15818-.52282-.35885-1.05973-.61507-1.47813-.23205-.37893-.64067-.87249-1.27534-.87249s-1.0433.49356-1.27534.87249c-.256216.4184-.456891.95531-.615072 1.47813-.2626.86794-.443255 1.82312-.5478975 2.3764-.0218814.11569-.0404569.21391-.055744.28997-.0680122.33841.1511895.66788.4896005.7359.338411.06801.667883-.15119.735893-.4896Zm2.04833-2.25312c-.02746-.0998-.05604-.19922-.0858-.29756-.14794-.48899-.31198-.90538-.48464-1.18734-.10201-.16658-.17382-.23444-.20933-.26115-.03551.02671-.10732.09457-.20934.26115-.17265.28196-.33669.69835-.48464 1.18734-.02975.09834-.05834.19776-.08579.29756h1.55954Zm7.16182 2.20968c.4354.39957 1.0126.54553 1.6157.54553.7365 0 1.3892-.25812 1.8138-.82626.2066-.27651.1499-.66816-.1266-.87478-.2765-.20661-.6681-.14996-.8747.12655-.1364.18251-.3741.32449-.8125.32449-.4163 0-.6443-.10067-.7705-.21652-.119-.10914-.2376-.31449-.2594-.72691.0218-.41242.1404-.61776.2594-.72691.1262-.11585.3542-.21652.7705-.21652.4384 0 .6761.14198.8125.32449.2066.27651.5982.33316.8747.12655.2765-.20662.3332-.59827.1266-.87478-.4246-.56814-1.0773-.82626-1.8138-.82626-.6031 0-1.1803.14597-1.6157.54554-.4402.40397-.63723.97647-.66435 1.62163-.00074.0175-.00074.03502 0 .05252.02712.64516.22415 1.21766.66435 1.62164ZM6.50963 2.80205v.92208h.58104c1.16663 0 2.49832.78637 2.44015 2.23877-.04459 1.11337-.95405 1.9222-2.00986 1.97029-.58666.02673-1.14109-.04815-1.78659-.20802-.27887-.06907-.47474-.31936-.47474-.60667V2.80205c0-.34518.27982-.625.625-.625s.625.27982.625.625Zm0 3.81232V4.97413h.58104c.76009 0 1.21009.46598 1.19115.93875-.01635.40841-.35212.7504-.81774.77161-.30354.01382-.60559-.00764-.95445-.07012ZM.197073 9.86877c.13123-.13123.320729-.19689.553598-.19689.23287 0 .422369.06566.553599.19689.13123.13123.19689.32073.19689.55363 0 .2328-.06566.4223-.19689.5536-.13123.1312-.320729.1969-.553599.1969-.232869 0-.422368-.0657-.553598-.1969-.1312294-.1313-.196889866-.3208-.196889866-.5536 0-.2329.065660466-.4224.196889866-.55363Zm3.124997 0c.13123-.13123.32073-.19689.5536-.19689.23287 0 .42237.06566.5536.19689.13123.13123.19689.32073.19689.55363 0 .2328-.06566.4223-.19689.5536-.13123.1312-.32073.1969-.5536.1969-.23287 0-.42237-.0657-.5536-.1969-.13123-.1313-.19689-.3208-.19689-.5536 0-.2329.06566-.4224.19689-.55363Zm3.6786-.19689c-.23287 0-.42237.06566-.5536.19689-.13123.13123-.19689.32073-.19689.55363 0 .2328.06566.4223.19689.5536.13123.1312.32073.1969.5536.1969.23287 0 .42237-.0657.5536-.1969.13123-.1313.19689-.3208.19689-.5536 0-.2329-.06566-.4224-.19689-.55363-.13123-.13123-.32073-.19689-.5536-.19689Zm2.5714.19689c.13123-.13123.32073-.19689.55363-.19689.2328 0 .4223.06566.5536.19689.1312.13123.1968.32073.1968.55363 0 .2328-.0656.4223-.1968.5536-.1313.1312-.3208.1969-.5536.1969-.2329 0-.4224-.0657-.55363-.1969-.13123-.1313-.19689-.3208-.19689-.5536 0-.2329.06566-.4224.19689-.55363Zm3.67863-.19689c-.2329 0-.4224.06566-.5536.19689-.1313.13123-.1969.32073-.1969.55363 0 .2328.0656.4223.1969.5536.1312.1312.3207.1969.5536.1969.2328 0 .4223-.0657.5536-.1969.1312-.1313.1968-.3208.1968-.5536 0-.2329-.0656-.4224-.1968-.55363-.1313-.13123-.3208-.19689-.5536-.19689Z" clipRule="evenodd" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_9371_4771" x1="15.216" x2="2.424" y1="13.079" y2="-1.058" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ffd600" />
                                    <stop offset="1" stopColor="#ff007a" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <input
                            type="text"
                            required
                            className='capitalize'
                            name='pName'
                            placeholder="Product Name or Title"
                            title="Enter your Products Title or Name"
                        />
                    </label>

                    <label className="input w-full validator">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <desc>
                                Browser Hash Streamline Icon: https://streamlinehq.com
                            </desc>
                            <g id="Free Gradient/Programming/browser-hash--window-hash-code-internet-language-browser-web-tag">
                                <path id="Union" fill="url(#paint0_linear_14402_11545)" fillRule="evenodd" d="M2 3.51562v8.31128c0 .0956.07749.1731.17308.1731h9.65382c.0956 0 .1731-.0775.1731-.1731V3.51562H2ZM2.17308.5C1.24906.5.5 1.24906.5 2.17308v9.65382c0 .924.74906 1.6731 1.67308 1.6731h9.65382c.924 0 1.6731-.7491 1.6731-1.6731V2.17308C13.5 1.24906 12.7509.5 11.8269.5H2.17308Zm4.57534 4.0076c.32654.11189.50056.4673.38867.79384l-.18402.53711H8.3568l.32284-.94227c.11189-.32654.4673-.50056.79384-.38868.32655.11189.50056.4673.38868.79384l-.18403.53711h.50107c.3452 0 .625.27982.625.625 0 .34517-.2798.625-.625.625h-.92935l-.50539 1.47503h.98062c.34522 0 .62502.27983.62502.625 0 .34518-.2798.625-.62502.625H8.31617l-.27072.79012c-.11188.3266-.4673.5006-.79384.3887-.32654-.1119-.50056-.4673-.38867-.7938l.1319-.38502H5.59111l-.27073.79012c-.11188.3266-.46729.5006-.79384.3887-.32654-.1119-.50055-.4673-.38867-.7938l.1319-.38502h-.449c-.34518 0-.625-.27982-.625-.625 0-.34517.27982-.625.625-.625h.87729l.50538-1.47503h-.92851c-.34518 0-.625-.27983-.625-.625 0-.34518.27982-.625.625-.625h1.3568l.32285-.94227c.11188-.32654.46729-.50056.79384-.38868Zm-.72903 4.05598h1.40373l.50539-1.47503H6.52478l-.50539 1.47503Z" clipRule="evenodd" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_14402_11545" x1="2.625" x2="13.125" y1="3" y2="8.818" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ffd685" />
                                    <stop offset="1" stopColor="#ff007a" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <input
                            type="text"
                            required
                            name='pCode'
                            placeholder="Product Code"
                            minLength="3"
                            maxLength="6"
                            title="Products Code"
                        />
                    </label>

                    <div className='flex items-center gap-2'>
                        <label className="select w-full select-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                                <path fill="#000000" d="m7.225 9.70005 4.175 -6.675c0.08335 -0.11667 0.175 -0.20417 0.275 -0.2625 0.1 -0.058335 0.21665 -0.0875 0.35 -0.0875 0.13335 0 0.25 0.029165 0.35 0.0875 0.1 0.05833 0.19165 0.14583 0.275 0.2625l4.175 6.675c0.08335 0.13335 0.12085 0.26665 0.1125 0.4 -0.00835 0.13335 -0.04585 0.25835 -0.1125 0.375 -0.06665 0.11665 -0.155 0.20835 -0.265 0.275 -0.11 0.06665 -0.23835 0.1 -0.385 0.1h-8.3c-0.1485 0 -0.2785 -0.0344 -0.39 -0.10325 -0.1115 -0.06865 -0.19815 -0.15925 -0.26 -0.27175 -0.06665 -0.11665 -0.10415 -0.24165 -0.1125 -0.375 -0.00835 -0.13335 0.02915 -0.26665 0.1125 -0.4Zm10.425 12.3c-1.20835 0 -2.2354 -0.4229 -3.08125 -1.26875S13.3 18.8584 13.3 17.65005c0 -1.20835 0.4229 -2.2354 1.26875 -3.08125s1.8729 -1.26875 3.08125 -1.26875c1.20835 0 2.2354 0.4229 3.08125 1.26875S22 16.4417 22 17.65005c0 1.20835 -0.4229 2.2354 -1.26875 3.08125s-1.8729 1.26875 -3.08125 1.26875ZM3 20.62505v-6.1c0 -0.2125 0.071915 -0.39065 0.21575 -0.5345 0.143665 -0.14365 0.32175 -0.2155 0.53425 -0.2155h6.1c0.2125 0 0.39065 0.07185 0.5345 0.2155 0.14365 0.14385 0.2155 0.322 0.2155 0.5345v6.1c0 0.2125 -0.07185 0.3906 -0.2155 0.53425 -0.14385 0.14385 -0.322 0.21575 -0.5345 0.21575H3.75c-0.2125 0 -0.390585 -0.0719 -0.53425 -0.21575C3.071915 21.01565 3 20.83755 3 20.62505Z" strokeWidth="0.5" />
                            </svg>

                            <select name='pCategory' className='p-0 ml-0' defaultValue="" required>
                                <option disabled value="">Select Category</option>
                                {
                                    category?.map((data, inD) => (
                                        <option key={inD}>{data.newCate}</option>
                                    ))
                                }
                            </select>
                        </label>
                        <button onClick={() => setCateOpen(true)} type='button' className='btn btn-warning'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                        </button>
                    </div>

                    <div className='flex items-center gap-2'>
                        <label className="select w-full select-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 14" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <g id="bookmark--bookmarks-tags-favorite">
                                <path id="Vector" fill="#d7e0ff" d="M16.24085357142857 16.832957142857143c-0.04624285714285714 0.6485142857142857 -0.8254071428571429 0.9516 -1.2977249999999998 0.50505L10.706878928571427 13.333180714285714c-0.5369324999999999 -0.5076128571428571 -1.3767975 -0.5076128571428571 -1.91373 -0.00001392857142857143L4.556968928571428 17.338007142857144c-0.47241535714285715 0.44654999999999995 -1.2515239285714286 0.1434642857142857 -1.2978364285714286 -0.50505 -0.31472999999999995 -4.406136428571428 -0.32800392857142857 -8.824850357142857 -0.06656464285714285 -13.231641428571427C3.2783817857142856 2.1550425 4.4894292857142855 1.0446428571428572 5.9382375 1.0446428571428572h7.623552857142857c1.4487524999999999 0 2.6598417857142853 1.1103996428571428 2.7456417857142856 2.556672857142857 0.2614392857142857 4.406791071428572 0.24820714285714285 8.825505 -0.06657857142857143 13.231641428571427Z" strokeWidth="1.5" />
                                <path id="Vector_2" stroke="#4147d5" strokeLinecap="round" strokeLinejoin="round" d="M16.240992857142857 16.832957142857143c-0.04638214285714286 0.6485142857142857 -0.8254071428571429 0.9516 -1.2978642857142857 0.50505L10.706920714285715 13.333180714285714c-0.5369324999999999 -0.5076128571428571 -1.3767975 -0.5076128571428571 -1.91373 -0.00001392857142857143L4.557010714285714 17.338007142857144c-0.47241535714285715 0.44654999999999995 -1.2515239285714286 0.1434642857142857 -1.2978364285714286 -0.50505v0c-0.31472999999999995 -4.406136428571428 -0.32800392857142857 -8.824850357142857 -0.06656464285714285 -13.231641428571427C3.2784235714285717 2.1550425 4.4894710714285715 1.0446428571428572 5.938279285714285 1.0446428571428572H13.561832142857144c1.44885 0 2.6597999999999997 1.1103996428571428 2.7456 2.556672857142857 0.2615785714285714 4.406791071428572 0.24820714285714285 8.825505 -0.06643928571428571 13.231641428571427v0Z" strokeWidth="1.5" />
                            </g>
                        </svg>

                            <select name='pBrand' className='p-0 ml-0' defaultValue="" required>
                                <option disabled value="">Select Brand</option>
                                {
                                    brand?.map((data, inD) => (
                                        <option key={inD}>{data.newBrand}</option>
                                    ))
                                }
                            </select>
                        </label>
                        <button onClick={() => setBrandOpen(true)} type='button' className='btn btn-warning'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                        </button>
                    </div>

                    <label className="input w-full validator">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <g id="key-frame--key-frame-entry-lock-login-pass-unlock-access">
                                <path id="Union" fill="url(#paint0_linear_9371_6698)" fillRule="evenodd" d="M9.86228.253441c-.41234-.039331-.77849.263054-.81782.675396-.03933.412343.26305.778493.67539.817823.45305.04321.90075.09292 1.34125.14612.5514.06662.9874.50389 1.053 1.05821.0502.42419.0976.85576.1393 1.2925.0393.41234.4054.71475.8178.67543.4123-.03931.7147-.40544.6754-.81779-.043-.45074-.0917-.89397-.1429-1.32642-.1466-1.23903-1.1214-2.221139-2.3627-2.3711-.4501-.054366-.9106-.105521-1.37872-.150169ZM4.9556.928837c.03933.412343-.26306.778493-.6754.817823-.45301.04321-.90078.09292-1.34121.14612-.55147.06662-.98747.50389-1.05307 1.05821-.0502.42419-.09762.85576-.13925 1.2925-.03931.41234-.40545.71475-.817796.67543-.412344-.03931-.714748-.40544-.675437-.81779.042971-.45074.091702-.89397.142878-1.32642C.542942 1.53568 1.51773.553571 2.75909.40361c.45004-.054366.91059-.105521 1.37868-.150169.41234-.039331.77849.263054.81783.675396ZM13.0712 9.0812c.4123.03931.7147.40545.6754.81779-.043.45071-.0917.89401-.1429 1.32641-.1466 1.239-1.1214 2.2212-2.3627 2.3711-.4501.0544-.9106.1055-1.37872.1502-.41234.0393-.77849-.2631-.81782-.6754-.03933-.4124.26305-.7785.67539-.8178.45305-.0433.90075-.093 1.34125-.1462.5514-.0666.9874-.5038 1.053-1.0582.0502-.4242.0976-.8557.1393-1.29247.0393-.41234.4054-.71474.8178-.67543Zm-12.142326 0c.412346-.03931.778486.26309.817796.67543.04163.43677.08905.86827.13925 1.29247.0656.5544.5016.9916 1.05307 1.0582.44043.0532.8882.1029 1.34121.1462.41234.0393.71473.4054.6754.8178-.03934.4123-.40549.7147-.81783.6754-.46809-.0447-.92864-.0958-1.37868-.1502-1.24136-.1499-2.216148-1.1321-2.362775-2.3711-.051176-.4324-.099907-.8757-.142878-1.32641-.039311-.41234.263093-.77848.675437-.81779ZM9.01391 5.36243c.09763-.09763.25592-.09763.35355 0l.60266.60266c.29288.29289.76778.29289 1.06068 0 .2929-.2929.2929-.76777 0-1.06066l-.6027-.60266c-.68339-.68341-1.79143-.68342-2.47484 0l-.49577.49576c-.01455.01248-.02873.02561-.04251.03939-.01377.01378-.0269.02795-.03938.0425l-.95472.95471c-.36174-.16302-.76922-.23592-1.19427-.23592-.7051 0-1.36186.20063-1.84162.68039-.47977.47977-.6804 1.13653-.6804 1.84163 0 .7051.20063 1.36186.6804 1.84162.47976.47975 1.13652.68045 1.84162.68045.7051 0 1.36186-.2007 1.84163-.68045.47977-.47976.6804-1.13652.6804-1.84162 0-.44183-.07878-.86468-.25565-1.23689l.45388-.45388.60192.60193c.2929.29289.76777.29289 1.06066 0 .2929-.29289.2929-.76777 0-1.06066l-.60192-.60192.00638-.00638ZM4.44565 7.33926c-.12273.12272-.24106.35197-.24106.78097 0 .42899.11833.65824.24106.78096.12272.12273.35197.24106.78096.24106.429 0 .65825-.11833.78097-.24106.12272-.12272.24106-.35197.24106-.78096 0-.429-.11834-.65825-.24106-.78097-.12272-.12272-.35197-.24105-.78097-.24105-.42899 0-.65824.11833-.78096.24105Z" clipRule="evenodd" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_9371_6698" x1="2.457" x2="13.36" y1="2.846" y2="8.887" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ffd600" />
                                    <stop offset="1" stopColor="#00d078" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <input
                            type="text"
                            required
                            name='pKey'
                            placeholder="Keyword"
                            title="SEO Keywords"
                        />
                    </label>


                    <label className="input w-full validator">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 22c5.5228 0 10 -4.4772 10 -10 0 -5.52285 -4.4772 -10 -10 -10C6.47715 2 2 6.47715 2 12c0 5.5228 4.47715 10 10 10Zm0.75 -16c0 -0.41421 -0.3358 -0.75 -0.75 -0.75s-0.75 0.33579 -0.75 0.75v0.31673c-1.63043 0.29194 -3 1.51688 -3 3.18327 0 1.9172 1.8128 3.25 3.75 3.25 1.3765 0 2.25 0.9057 2.25 1.75s-0.8735 1.75 -2.25 1.75 -2.25 -0.9057 -2.25 -1.75c0 -0.4142 -0.33579 -0.75 -0.75 -0.75s-0.75 0.3358 -0.75 0.75c0 1.6664 1.36957 2.8913 3 3.1833V18c0 0.4142 0.3358 0.75 0.75 0.75s0.75 -0.3358 0.75 -0.75v-0.3167c1.6304 -0.292 3 -1.5169 3 -3.1833 0 -1.9172 -1.8128 -3.25 -3.75 -3.25 -1.3765 0 -2.25 -0.9057 -2.25 -1.75 0 -0.84427 0.8735 -1.75 2.25 -1.75s2.25 0.90573 2.25 1.75c0 0.41421 0.3358 0.75 0.75 0.75s0.75 -0.33579 0.75 -0.75c0 -1.66639 -1.3696 -2.89133 -3 -3.18327V6Z" fill="#000000" strokeWidth="1" />
                        </svg>
                        <input
                            type="number"
                            onChange={(e) => setRegular(e.target.value)}
                            required
                            name='rPrice'
                            placeholder="Regular Price"
                        />
                    </label>

                    <label className="input w-full validator">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Tag-Dollar--Streamline-Ultimate" height="24" width="24">
                            <path d="M22.5 0H14a2.89 2.89 0 0 0 -2.06 0.85L0.5 12.29a1.71 1.71 0 0 0 0 2.42l8.79 8.79a1.71 1.71 0 0 0 2.42 0l11.44 -11.44A2.89 2.89 0 0 0 24 10V1.5A1.5 1.5 0 0 0 22.5 0Zm-8.31 10.71c0.56 2.09 1.09 4.07 0 5.2a2.83 2.83 0 0 1 -4.06 0 0.24 0.24 0 0 0 -0.35 0l-0.78 0.78a1 1 0 0 1 -0.71 0.29 1 1 0 0 1 -0.71 -1.7l0.79 -0.79a0.24 0.24 0 0 0 0 -0.35L7 12.79a1 1 0 0 1 1.41 -1.41l3.12 3.12a0.86 0.86 0 0 0 1.24 0c0.32 -0.32 -0.24 -2.39 -0.47 -3.27 -0.56 -2.09 -1.09 -4.06 0 -5.19a2.72 2.72 0 0 1 4.07 0 0.24 0.24 0 0 0 0.35 0l0.78 -0.78a1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.41l-0.78 0.78a0.24 0.24 0 0 0 0 0.36l1.33 1.34a1 1 0 0 1 0 1.41 1 1 0 0 1 -1.41 0L15 7.45a0.76 0.76 0 0 0 -1.24 0c-0.36 0.32 0.24 2.38 0.43 3.26Z" fill="#000000" strokeWidth="1"></path>
                        </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <path fill="#000000" fillRule="evenodd" d="M22.6765 15.1182c-0.8115 -1.2324 -5.0897 -5.4204 -6.1618 -6.55257 -1.6732 -1.77339 -2.8254 -3.74717 -5.0096 -4.23811 -1.3726 -0.32061 -8.31586 0.54104 -7.21376 1.68322 0.03265 0.03333 0.07163 0.0598 0.11464 0.07787 0.04301 0.01808 0.08919 0.02739 0.13584 0.02739 0.04666 0 0.09284 -0.00931 0.13585 -0.02739 0.04301 -0.01807 0.08198 -0.04454 0.11463 -0.07787 0.48092 -0.4709 3.89746 -0.93178 6.5325 -0.83159 1.2082 0.42441 2.241 1.23862 2.9356 2.31443 1.4528 1.82349 6.6227 7.19372 7.304 8.11552 0.1207 0.1805 0.2247 0.3717 0.3106 0.5711 -1.3685 2.0859 -3.0323 3.9624 -4.9395 5.5707 -0.6519 0.5376 -1.4047 0.9396 -2.2142 1.1822 -1.5206 -1.1457 -2.9694 -2.3838 -4.3383 -3.7071 -1.62798 -1.6277 -3.17289 -3.3365 -4.62886 -5.1198 -0.7063 -1.0243 -1.07737 -2.2425 -1.06203 -3.4866 0 -0.0824 -0.03272 -0.1614 -0.09097 -0.2197 -0.05825 -0.0582 -0.13725 -0.0909 -0.21962 -0.0909 -0.08238 0 -0.16138 0.0327 -0.21963 0.0909 -0.05824 0.0583 -0.09097 0.1373 -0.09097 0.2197 0.13025 2.8254 0.7314 3.5267 2.55489 5.7109 2.01862 2.6099 4.34679 4.9649 6.93329 7.0134 0.2016 0.2791 0.4886 0.4849 0.8177 0.5861 0.3291 0.1012 0.6821 0.0925 1.0058 -0.025 2.615 -0.8016 5.5706 -4.5988 7.0735 -6.5125 0.5611 -0.7314 0.9218 -1.1822 0.2204 -2.2743Z" clipRule="evenodd" strokeWidth="1"></path>
                            <path fill="#000000" fillRule="evenodd" d="M8.71987 9.75791c0.38073 -1.06203 0.49094 -1.64315 -0.37071 -2.31443 -0.23229 -0.19497 -0.50233 -0.33991 -0.7932 -0.42575 -0.29088 -0.08584 -0.59633 -0.11073 -0.89727 -0.07311 -0.30093 0.03762 -0.59087 0.13693 -0.85166 0.29173 -0.2608 0.15479 -0.48684 0.36174 -0.664 0.6079 -0.86982 -0.52542 -1.63704 -1.20437 -2.26433 -2.00384C1.71648 4.53792 0.594329 2.36376 1.89682 1.2316c0.55105 -0.490943 1.52291 -0.23044 2.47473 0.33063 2.1942 1.25239 2.11405 2.56491 2.7152 2.20422 0.84161 -0.51098 -1.76337 -2.76529 -2.86548 -3.316349C1.6263 -0.86241 -0.127051 0.900964 0.163504 3.09516c0.36069 2.6651 2.474736 4.46855 4.819216 5.63077 0.46089 2.94567 3.36644 2.10407 3.73715 1.03198Zm-0.40076 -0.87167c-0.03583 0.30302 -0.17771 0.5836 -0.40053 0.79207 -0.22282 0.20846 -0.51221 0.33139 -0.81694 0.34699 -0.30474 0.0156 -0.60517 -0.07715 -0.8481 -0.26177 -0.24294 -0.18463 -0.41273 -0.44926 -0.4793 -0.74704 0.44084 0.16031 0.84161 0.16031 0.88168 -0.10019 0.04008 -0.2605 -0.52099 -0.54104 -0.91174 -0.75144 1.12215 -1.34257 2.81539 -0.10019 2.57493 0.72138Z" clipRule="evenodd" strokeWidth="1"></path>
                            <path fill="#000000" fillRule="evenodd" d="M23.0874 6.63193c-3.5568 -1.53293 -2.595 -1.11213 -7.5645 -2.46471 -0.0802 0 -0.5911 -0.25048 -0.8717 -0.06012 -0.0453 0.04314 -0.0778 0.09792 -0.094 0.15833 -0.0162 0.06041 -0.0155 0.12411 0.0021 0.18414 0.0176 0.06002 0.0514 0.11404 0.0976 0.15613 0.0463 0.0421 0.1032 0.07065 0.1646 0.08251 0.6833 0.19955 1.3527 0.44387 2.0039 0.7314 1.863 0.86607 3.7808 1.60909 5.741 2.22426 0.8316 0.37071 -0.5511 3.31633 -0.5411 4.00763 0 0.0461 0.0091 0.0917 0.0267 0.1342 0.0176 0.0426 0.0435 0.0812 0.076 0.1138 0.0326 0.0326 0.0713 0.0584 0.1138 0.076 0.0425 0.0176 0.0881 0.0267 0.1342 0.0267 0.046 0 0.0916 -0.0091 0.1342 -0.0267 0.0425 -0.0176 0.0812 -0.0434 0.1138 -0.076 0.0325 -0.0326 0.0584 -0.0712 0.076 -0.1138 0.0176 -0.0425 0.0267 -0.0881 0.0267 -0.1342 0.03 -0.8316 2.2944 -3.95754 0.3607 -5.01957Z" clipRule="evenodd" strokeWidth="1"></path>
                            <path fill="#000000" fillRule="evenodd" d="M9.84202 12.2427c-0.08242 -0.0458 -0.1527 -0.1106 -0.20499 -0.189s-0.08506 -0.1682 -0.09559 -0.2619c0.00882 -0.0531 0.00597 -0.1075 -0.00834 -0.1594 -0.01432 -0.0518 -0.03976 -0.1 -0.07456 -0.141 -0.0348 -0.0411 -0.07813 -0.0741 -0.12696 -0.0967 -0.04884 -0.0226 -0.10201 -0.0344 -0.15583 -0.0344 -0.05383 0 -0.107 0.0118 -0.15584 0.0344 -0.04883 0.0226 -0.09216 0.0556 -0.12696 0.0967 -0.0348 0.041 -0.06024 0.0892 -0.07456 0.141 -0.01431 0.0519 -0.01716 0.1063 -0.00834 0.1594 -0.03048 0.2858 0.02952 0.5739 0.17153 0.8238 0.14201 0.2498 0.35886 0.4488 0.61998 0.5689 0.15127 0.0687 0.31461 0.1068 0.48064 0.1123 0.1661 0.0054 0.3316 -0.022 0.487 -0.0806 0.1554 -0.0586 0.2978 -0.1474 0.4189 -0.2611 0.121 -0.1138 0.2185 -0.2504 0.2867 -0.4018 0.1294 -0.23 0.2016 -0.4877 0.2104 -0.7515 0.005 -0.2286 -0.0324 -0.4562 -0.1102 -0.6713 -0.2505 -0.6913 -0.6112 -1.15218 0.4709 -0.2905 0.0567 0.0531 0.1303 0.0846 0.208 0.0889 0.0776 0.0042 0.1542 -0.019 0.2164 -0.0657 0.0622 -0.0466 0.106 -0.1137 0.1236 -0.1894 0.0177 -0.0757 0.0081 -0.1552 -0.0271 -0.2246 -0.6312 -0.79149 -1.3826 -1.49283 -2.134 -0.67126 -0.1107 0.13973 -0.191 0.30096 -0.23587 0.47346 -0.04485 0.1726 -0.05325 0.3525 -0.02466 0.5285 0 0.3306 0.21043 0.6312 0.26053 1.0019 0.0289 0.0981 0.0289 0.2024 0 0.3006 -0.1102 0.1402 -0.24049 0.2504 -0.39078 0.1603Z" clipRule="evenodd" strokeWidth="1"></path>
                            <path fill="#000000" fillRule="evenodd" d="M13.8397 11.5413c-0.2324 0.0003 -0.4629 0.041 -0.6813 0.1203 -0.3036 0.1125 -0.5825 0.2826 -0.8216 0.5009 -0.2849 0.2808 -0.5526 0.5786 -0.8015 0.8917l-0.4709 0.541 -0.531 0.6413c-0.0439 0.0646 -0.0634 0.1427 -0.0551 0.2204 0.0082 0.0776 0.0437 0.1498 0.1001 0.2039 0.0564 0.054 0.1301 0.0863 0.2081 0.0911 0.0779 0.0049 0.1551 -0.018 0.2178 -0.0646l0.6111 -0.531 0.1403 -0.1102v0.1002c0.0282 0.0672 0.069 0.1285 0.1202 0.1803 0.0465 0.0487 0.1006 0.0893 0.1603 0.1203 0.1603 0.1002 0.3006 0.1302 0.4609 0.2204 -0.2304 0.2304 -0.4709 0.4809 -0.6913 0.6813 -0.0771 0.0624 -0.1262 0.1529 -0.1365 0.2516 -0.0103 0.0986 0.0189 0.1974 0.0814 0.2744 0.0624 0.0771 0.1529 0.1262 0.2516 0.1365 0.0986 0.0103 0.1973 -0.0189 0.2744 -0.0814 0.4509 -0.3206 1.0019 -0.6913 1.4628 -1.1021 0.3409 -0.2953 0.6438 -0.6318 0.9017 -1.0019 0.1983 -0.364 0.2788 -0.7806 0.2305 -1.1923 -0.0124 -0.1764 -0.0594 -0.3487 -0.1385 -0.5069 -0.0791 -0.1581 -0.1887 -0.2991 -0.3224 -0.4149 -0.172 -0.1063 -0.369 -0.165 -0.5711 -0.1703Zm-0.1403 1.7333c-0.1644 0.3138 -0.3662 0.6065 -0.6011 0.8717 -0.0318 -0.1622 -0.0822 -0.3202 -0.1503 -0.4709 -0.0304 -0.0691 -0.071 -0.1332 -0.1203 -0.1904 -0.0459 -0.0546 -0.1 -0.1019 -0.1603 -0.1402 0.1203 -0.1002 0.2405 -0.2004 0.3707 -0.2906 0.1303 -0.0902 1.1823 -0.7614 0.6613 0.2204Z" clipRule="evenodd" strokeWidth="1"></path>
                            <path fill="#000000" fillRule="evenodd" d="m15.3526 14.487 -1.4127 1.0019c-0.2823 0.237 -0.5287 0.5137 -0.7314 0.8215 -0.0844 0.1643 -0.1284 0.3464 -0.1284 0.5311 0 0.1846 0.044 0.3667 0.1284 0.531l0.2304 0.4007 0.3307 0.3908c0.0642 0.0694 0.1527 0.1117 0.2471 0.118 0.0944 0.0064 0.1877 -0.0236 0.2607 -0.0838 0.073 -0.0603 0.1203 -0.1461 0.132 -0.24 0.0118 -0.0939 -0.0128 -0.1888 -0.0688 -0.2651l-0.1302 -0.3206 -0.1002 -0.3407v-0.1002c0 -0.03 0.1403 -0.1302 0.2104 -0.2004l0.4509 -0.4208 1.0019 -1.3726c0.0398 -0.027 0.0733 -0.0623 0.098 -0.1036 0.0248 -0.0412 0.0402 -0.0873 0.0453 -0.1352 0.0051 -0.0478 -0.0003 -0.0962 -0.0159 -0.1417 -0.0155 -0.0455 -0.0408 -0.0871 -0.0741 -0.1219 -0.0332 -0.0347 -0.0737 -0.0618 -0.1185 -0.0793 -0.0448 -0.0175 -0.0929 -0.025 -0.1409 -0.022 -0.048 0.003 -0.0948 0.0164 -0.137 0.0394 -0.0423 0.0229 -0.0791 0.0548 -0.1078 0.0934l0.0301 0.0201Z" clipRule="evenodd" strokeWidth="1"></path>
                            <path fill="#000000" fillRule="evenodd" d="m17.1059 17.3124 0.1503 0.2204c0.0619 0.0653 0.1289 0.1256 0.2004 0.1803 0.8115 0.6413 0.9418 0.5711 1.092 0.4609 0.1503 -0.1102 0.3207 -0.1503 -0.1703 -1.1923 -0.0438 -0.0924 -0.0975 -0.1797 -0.1603 -0.2605 -0.0669 -0.0802 -0.1444 -0.151 -0.2304 -0.2104 -0.8116 -0.541 -1.0019 -0.4308 -2.1642 0.501 -0.1302 0.1002 -0.2204 0.2304 -0.3406 0.3406 -0.1303 0.1303 -0.2705 0.2505 -0.3908 0.3908 -0.1229 0.1668 -0.2302 0.3446 -0.3206 0.531 -0.0885 0.1911 -0.1298 0.4007 -0.1202 0.6112 0.0237 0.2479 0.1099 0.4857 0.2505 0.6913 0.1302 0.1803 0.7915 1.0019 1.1622 0.5811 0.3707 -0.4208 -0.1102 -0.521 -0.3106 -0.9518 -0.0312 -0.1046 -0.0312 -0.216 0 -0.3206l0.2004 -0.2205 0.1002 0.0802c0.8115 0.511 0.9418 0.4208 1.072 0.3006 0.1303 -0.1203 0.2405 -0.2605 -0.2104 -1.1021 -0.0384 -0.0778 -0.0891 -0.1489 -0.1503 -0.2104l0.3808 -0.4609c-0.0081 0.0178 -0.0223 0.032 -0.0401 0.0401Z" clipRule="evenodd" strokeWidth="1"></path>
                        </svg>
                        <input
                            type="number"
                            required
                            name='salePrice'
                            defaultValue={calDiscount(regular, discount)}
                            placeholder="Discount Price"
                        />
                    </label>


                    <label className="input w-full validator">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="24" width="24">
                            <g id="Shopping-Cart-Full--Streamline-Ultimate.svg">
                                <path d="M23 2.13h-2.6a1.49 1.49 0 0 0 -1.46 1.15l-1.12 4.65a0.26 0.26 0 0 1 -0.25 0.2H1.09a1 1 0 0 0 -0.81 0.41 1 1 0 0 0 -0.14 0.9l2.67 8a1 1 0 0 0 0.95 0.69H15.1a0.25 0.25 0 0 1 0.2 0.09 0.26 0.26 0 0 1 0 0.21l-0.11 0.5a0.26 0.26 0 0 1 -0.25 0.2H4.92a2.25 2.25 0 1 0 2.3 2.25 0.25 0.25 0 0 1 0.08 -0.18 0.22 0.22 0 0 1 0.17 -0.07h6a0.25 0.25 0 0 1 0.25 0.25 2.25 2.25 0 1 0 3.57 -1.83 0.22 0.22 0 0 1 -0.09 -0.25l3.52 -15a0.26 0.26 0 0 1 0.28 -0.17h2a1 1 0 0 0 0 -2Z" fill="#000000" strokeWidth="1" />
                                <path d="M9.8 7.13h5.29a1 1 0 0 0 0.91 -0.56 1 1 0 0 0 -0.09 -1.05L13.93 3l-0.09 -0.11a1.62 1.62 0 0 0 -2.29 0L9.08 5.43a1 1 0 0 0 0.72 1.7Z" fill="#000000" strokeWidth="1" />
                                <path d="M1.4 6.53a1 1 0 0 0 0.92 0.6h4.31a1 1 0 0 0 0.83 -0.46 1 1 0 0 0 0.08 -1l-2 -4.42a1.6 1.6 0 0 0 -1 -0.86 1.73 1.73 0 0 0 -1.23 0.16L1 1.61a1.67 1.67 0 0 0 -0.84 2.16Z" fill="#000000" strokeWidth="1" />
                            </g>
                        </svg>
                        <input
                            type="number"
                            required
                            name='pStock'
                            placeholder="Stock Quantity"
                        />
                    </label>


                    <label className="select w-full select-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 30 24" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <g id="shopping-basket-1--shopping-basket">
                                <path id="Vector" stroke="#c71dff" strokeLinecap="round" strokeLinejoin="round" d="M19.50121875 11.65284375c-0.204984375 1.749328125 -0.594609375 4.527328125 -1.2433125 7.2477656249999995 -0.24979687500000003 1.0475625 -1.118765625 1.8187499999999999 -2.18953125 1.9338281249999998 -1.179046875 0.12674999999999997 -2.87259375 0.25846875 -4.818609375 0.25846875 -1.9459687499999998 0 -3.639515625 -0.13171875000000002 -4.8185625000000005 -0.25846875 -1.0708125000000002 -0.115078125 -1.9397671874999998 -0.8862656250000001 -2.1895640625 -1.9338281249999998 -0.6486890624999999 -2.7204375 -1.0383328125 -5.4984375000000005 -1.2432890625000002 -7.2477656249999995" strokeWidth="1.5" />
                                <path id="Vector_2" stroke="#000cfe" strokeLinecap="round" strokeLinejoin="round" d="m7.5 14.53125 0.46875 3.28125" strokeWidth="1.5" />
                                <path id="Vector_3" stroke="#000cfe" strokeLinecap="round" strokeLinejoin="round" d="m15 14.53125 -0.46875 3.28125" strokeWidth="1.5" />
                                <path id="Vector_4" stroke="#000cfe" strokeLinecap="round" strokeLinejoin="round" d="m11.25 14.53125 0 3.28125" strokeWidth="1.5" />
                                <path id="Vector_5" stroke="#c71dff" strokeLinecap="round" strokeLinejoin="round" d="M8.437875 2.8125h-1.367484375c-0.611859375 0 -1.184671875 0.29746875 -1.5104531250000002 0.8153859375 -0.58059375 0.9231234375 -1.5850078125 2.5943953124999997 -2.33728125 4.3998328125" strokeWidth="1.5" />
                                <path id="Vector_6" stroke="#c71dff" strokeLinecap="round" strokeLinejoin="round" d="M14.0625 2.8125h1.36753125c0.6118125 0 1.184671875 0.29746875 1.51040625 0.8153859375 0.58059375 0.9231234375 1.5850312500000001 2.5943953124999997 2.33728125 4.3998328125" strokeWidth="1.5" />
                                <path id="Vector_7" stroke="#000cfe" strokeLinecap="round" strokeLinejoin="round" d="M1.4528156250000002 10.495171875c0.116090625 0.771234375 0.864271875 1.1476875 1.644065625 1.1622656249999999C4.4940140625 11.683640625 7.13465625 11.71875 11.25 11.71875c4.11534375 0 6.756 -0.035109375 8.153109375 -0.0613125 0.7798125 -0.014578124999999999 1.527984375 -0.39103125000000005 1.6440937500000001 -1.1622656249999999C21.075890625 10.304343750000001 21.09375 10.087640624999999 21.09375 9.84375s-0.017859375 -0.46059375 -0.046546875 -0.6514218749999999c-0.116109375 -0.771234375 -0.86428125 -1.147640625 -1.6440937500000001 -1.1622656249999999C18.006 8.003859375 15.365343750000001 7.96875 11.25 7.96875s-6.7559859375 0.035109375 -8.153118749999999 0.0613125c-0.7797890625 0.014578124999999999 -1.5279749999999999 0.39103125000000005 -1.644065625 1.1622656249999999C1.4240953125 9.383156249999999 1.40625 9.599859375000001 1.40625 9.84375s0.0178453125 0.46059375 0.046565625 0.6514218749999999Z" strokeWidth="1.5" />
                                <path id="Vector_8" stroke="#000cfe" strokeLinecap="round" strokeLinejoin="round" d="M14.06184375 2.926115625c-0.008953125 0.75 -0.618375 1.2599156249999999 -1.368234375 1.2773015625C12.310171875 4.2123046875 11.831625 4.21875 11.25 4.21875s-1.060171875 -0.0064453125 -1.4436093749999999 -0.015332812500000001c-0.749859375 -0.0173859375 -1.35928125 -0.527296875 -1.368234375 -1.277296875C8.437734375 2.889159375 8.4375 2.8512890625 8.4375 2.8125c0 -0.038784374999999996 0.000234375 -0.0766546875 0.00065625 -0.1136203125 0.008953125 -0.7499953125000001 0.618375 -1.2599109375 1.368234375 -1.277296875C10.189828125 1.4126953125 10.668375 1.40625 11.25 1.40625s1.060171875 0.0064453125 1.4436093749999999 0.015332812500000001c0.749859375 0.0173859375 1.35928125 0.5273015625 1.368234375 1.2773015625C14.062265625 2.7358453125 14.0625 2.773715625 14.0625 2.8125c0 0.038784374999999996 -0.000234375 0.0766546875 -0.00065625 0.11361562500000001Z" strokeWidth="1.5" />
                            </g>
                        </svg>
                        <select required name='pstatus' defaultValue="">
                            <option disabled value="">Select Status</option>
                            <option>In Stock</option>
                            <option>Out of Stock</option>
                            <option>Pre-order</option>
                        </select>
                    </label>

                    <label className="textarea w-full flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <g id="description">
                                <path id="Subtract" fill="url(#paint0_linear_7979_361)" fillRule="evenodd" d="M24 1.5c-7.4065 0-12.5956.23225-15.85917.45358-3.25939.22105-5.8649 2.67028-6.15906 5.97124C1.73587 10.6843 1.5 14.8132 1.5 20.5s.23586 9.8157.48177 12.5752c.29416 3.3009 2.89966 5.7502 6.15905 5.9712 1.50205.1019 3.41188.2061 5.75798.2888v3.6601c0 3.0212 3.5706 4.623 5.8272 2.6142l6.8741-6.1193c6.038-.0464 10.3917-.2493 13.2591-.4438 3.2594-.221 5.8649-2.6703 6.159-5.9712.2459-2.7595.4818-6.8884.4818-12.5752 0-5.6868-.2359-9.8157-.4818-12.57518-.2941-3.30095-2.8996-5.75019-6.159-5.97124C36.5956 1.73225 31.4065 1.5 24 1.5Zm-7.5802 20.5723c-.1778 2.2921-1.3198 3.6421-3.5378 4.8795-.4803.2679-.6854.8593-.3899 1.3231.2748.4314.6501.9491 1.088 1.3676.3774.3607.9281.4344 1.4271.2809 3.5452-1.0907 6.6737-3.6143 6.9699-7.8499H22v-5.029c-.0002-1.1466-.0149-2.0457-.035-2.7405-.0362-1.2529-.939-2.2035-2.1914-2.2549C19.0786 12.0205 18.1717 12 17 12s-2.0786.0205-2.7737.0491c-1.2523.0515-2.155 1.0019-2.1913 2.2547-.0203.7005-.035 1.6086-.035 2.7687 0 1.0744.0126 1.9327.0306 2.6101.0353 1.3302 1.0308 2.3282 2.361 2.362.5468.0139 1.2154.0243 2.0282.0277Zm10.4622 4.8795c2.218-1.2374 3.36-2.5874 3.5378-4.8795-.8128-.0034-1.4814-.0138-2.0282-.0277-1.3302-.0338-2.3257-1.0318-2.361-2.362-.018-.6774-.0306-1.5357-.0306-2.6101 0-1.1601.0147-2.0682.035-2.7687.0363-1.2528.939-2.2032 2.1913-2.2547C28.9214 12.0205 29.8283 12 31 12c1.1717 0 2.0786.0205 2.7736.0491 1.2524.0514 2.1552 1.002 2.1914 2.2549.0201.6948.0348 1.5939.035 2.7405v5.029h-.0229c-.2962 4.2356-3.4247 6.7592-6.9699 7.8499-.499.1535-1.0497.0798-1.4271-.2809-.4379-.4185-.8132-.9362-1.088-1.3676-.2955-.4638-.0904-1.0552.3899-1.3231Z" clipRule="evenodd" />
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_7979_361" x1="8.856" x2="45.202" y1="10.154" y2="30.291" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#ffd600" />
                                    <stop offset="1" stopColor="#00d078" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <textarea required name='pDes' className="pl-2 w-full" placeholder="Description" ></textarea>
                    </label>

                    <label className="textarea w-full flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Auto-Correction-Check--Streamline-Flex-Gradient" height="24" width="24">
                            <path d="M22.86 6.855h-1.1475V4.5675h-1.1400000000000001V3.4275H19.424999999999997V2.2874999999999996h-2.2800000000000002V1.1400000000000001h-2.2874999999999996V0h-5.715v1.1400000000000001H6.855v1.1475H4.5675v1.1400000000000001H3.4275v1.1400000000000001H2.2874999999999996v2.2874999999999996H1.1400000000000001v2.2874999999999996H0v5.715h1.1400000000000001v2.2874999999999996h1.1475v2.2800000000000002h1.1400000000000001v1.1475h1.1400000000000001v1.1400000000000001h2.2874999999999996v1.1475h2.2874999999999996V24h5.715v-1.1400000000000001h2.2874999999999996v-1.1475h2.2800000000000002v-1.1400000000000001h1.1475V19.424999999999997h1.1400000000000001v-2.2800000000000002h1.1475v-2.2874999999999996H24v-5.715h-1.1400000000000001ZM9.1425 4.5675h1.1400000000000001V3.4275h3.435v1.1400000000000001h1.1400000000000001v3.435h-1.1400000000000001v1.1400000000000001h-3.435v-1.1400000000000001h-1.1400000000000001ZM17.145 19.424999999999997h-1.1475v1.1475h-5.715V19.424999999999997h-1.1400000000000001V11.43h1.1400000000000001v-1.1475h3.435v1.1475h1.1400000000000001v5.715h1.1400000000000001v1.1400000000000001h1.1475Z" fill="#000000" strokeWidth="0.75" />
                        </svg>
                        <textarea required name='pShortDes' className="pl-2 w-full" placeholder="Short Description"></textarea>
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

            <AddCategory open={cateOpen} onClose={() => setCateOpen(false)}>
                <h2 className="text-xl text-center font-semibold m-4">Add Products Category</h2>

                <form onSubmit={(e) => handleAddCate(e)} className="space-y-3">
                    <div>
                        <label className="font-medium">Products Category</label>
                        <input
                            type="text"
                            name="newCate"
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <input type="submit" className='btn btn-warning w-full' value="Add" />
                </form>
            </AddCategory>
            <AddCategory open={brandOpen} onClose={() => setBrandOpen(false)}>
                <h2 className="text-xl text-center font-semibold m-4">Add Products Brand</h2>

                <form onSubmit={(e) => handleAddBrand(e)} className="space-y-3">
                    <div>
                        <label className="font-medium">Products Brand</label>
                        <input
                            type="text"
                            name="newBrand"
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

export default AddPro;