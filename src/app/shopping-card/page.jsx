'use client'
import useGuestCart from '@/hooks/guestCard';
import React, { useEffect, useState } from 'react';
import Spinner from '../admin/Components/Spinner';
import Swal from 'sweetalert2';

const ShoppingCard = () => {

    const { guestId } = useGuestCart();
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([])
    const [cartitems, setCartItems] = useState([])
    const [subTotal, setSubTotal] = useState([])
    const [reload, setReload] = useState(true)
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        fetch(`/api/card/cart/${guestId}`)
            .then(res => res.json())
            .then(data => setItems(data?.cart?.items))
    }, [guestId, reload])

    useEffect(() => {
        fetch(`/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))
    }, [items, reload])

    useEffect(() => {
        if (!products?.length || !items?.length) return;

        const selectedProducts = items.map(item => {
            const product = products.find(p => p._id === item.productID);
            if (!product) return null;
            return {
                ...product,
                qty: item.qty,
                price: item.price
            };
        }).filter(Boolean);

        setCartItems({ selectedProducts, items });
    }, [products, items, reload]);


    useEffect(() => {
        if (!items?.length) return;
        const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2)
        setSubTotal(subtotal)
    }, [items, reload])

    const handleQty = async (productID, direction) => {
        setSpinner(true)
        try {
            const res = await fetch(`/api/card/cart/${guestId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productID, direction
                })
            })

            const data = await res.json();

            if (data.success) {
                setReload(!reload)
            }

            if (data.checkConfirmDelete) {
                Swal.fire({
                    title: "Are you sure?",
                    text: "DO you want to remove this item?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const deleteRes = await fetch(`/api/card/cart/${guestId}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ productID })
                        })

                        const cData = await deleteRes.json();

                        if (cData.success) {
                            setReload(!reload)
                            Swal.fire({
                                title: "Removed!",
                                text: "Item removed from cart",
                                icon: "success"
                            });
                        }
                    }
                });
            }

            if (data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Stock limit reached!",
                });
            }

        } catch {
            alert("somthing Wrong")
        } finally {
            setSpinner(false)
        }

    }
    const handleDelete = async (productID) => {
        setSpinner(true)
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "DO you want to remove this item?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const deleteRes = await fetch(`/api/card/cart/${guestId}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productID })
                    })

                    const cData = await deleteRes.json();

                    if (cData.success) {
                        setReload(!reload)
                        Swal.fire({
                            title: "Removed!",
                            text: "Item removed from cart",
                            icon: "success"
                        });
                    }
                }
            });

        } catch {
            alert("Something Error")
        } finally {
            setSpinner(false)
        }
    }

    return (
        <div className={`w-11/12 mx-auto border rounded-lg my-10 relative`}>
            <div className='flex justify-between'>
                <div className='w-3/4 mr-2 p-4'>
                    <h1 className='text-2xl font-bold'>Shopping Card</h1>
                    <div className='pt-4'>
                        {
                            cartitems?.selectedProducts?.map((card, iDx) => (
                                <div key={iDx} className=''>
                                    <div className='grid grid-cols-10 gap-2'>
                                        <img src={card.pImage[0]} alt={card.pName} className='rounded-xl w-full aspect-square col-span-2' />
                                        <div className='flex flex-col col-span-3'>
                                            <h1 className='font-semibold text-xl'>{card.pName}</h1>
                                            <p className='label text-sm'><span>#</span>{card.pCode}</p>
                                            <h1>{card.pStock} left</h1>
                                        </div>
                                        <div className='flex gap-2 justify-between items-center col-span-2'>
                                            <button
                                                onClick={() => handleQty(card._id, "decrease")}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            </button>

                                            <input
                                                type="number"
                                                name="qty"
                                                readOnly
                                                className='input w-16 '
                                                value={cartitems?.items[iDx].qty}
                                                style={{ textAlign: "center" }}

                                            />
                                            <button
                                                onClick={() => handleQty(card._id, "increase")}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-center items-center col-span-2'>
                                            <h2>{card.salePrice} TK</h2>
                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <button onClick={() => handleDelete(card._id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <hr className={`my-4 ${iDx === items.length - 1 && "hidden"}`} />
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className='w-1/4 bg-sky-200 p-4 rounded-lg'>
                    <h1 className='text-2xl font-semibold'>Checkout</h1>
                    <div className='flex flex-col justify-between pt-4'>
                        <div className=''>
                            <div className='grid grid-cols-3'>
                                <h1>Items</h1>
                                <h2 className='text-center'>Qty</h2>
                                <h3 className='text-end'>Price</h3>
                            </div>
                            <hr />
                            <div className='py-2'>
                                {
                                    cartitems?.selectedProducts?.map((card, iDx) => (
                                        <div key={iDx} className='grid grid-cols-3'>
                                            <h1>{card.pCode}</h1>
                                            <h2 className='text-center'>{cartitems?.items[iDx].qty}</h2>
                                            <h3 className='text-end'>{(cartitems?.items[iDx].qty * card.salePrice).toFixed(2)}</h3>
                                        </div>
                                    ))
                                }
                            </div>
                            <hr />
                            <div className='flex justify-between'>
                                <h1>Subtotal:</h1>
                                <h2>{subTotal}</h2>
                            </div>
                            <div className='flex justify-between'>
                                <h1>Shipping Fee:</h1>
                                <h2>70.00</h2>
                            </div>
                            <div className='flex py-2'>
                                <input type="text" name='Promo' className='input p-1' placeholder='Voucher or Promo' />
                                <button className='btn btn-info'>APPLY</button>
                            </div>
                            <hr />
                            <div className='flex justify-between'>
                                <h1>Total:</h1>
                                <h2>{(Number(subTotal) + 70).toFixed(2)}</h2>
                            </div>
                        </div>
                        <div className='flex justify-end mt-4'>
                            <button className='btn btn-success'>Checkout <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></button>
                        </div>
                    </div>
                </div>
            </div>
            {
                spinner && (
                    <div className='border p-10 backdrop-blur-2xl absolute top-1/2 left-1/2'>
                        <Spinner></Spinner>
                    </div>
                )
            }
        </div>
    );
};

export default ShoppingCard;