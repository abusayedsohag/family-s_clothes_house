'use client'
import useGuestCart from '@/hooks/guestCard';
import React, { useEffect, useState } from 'react';

const ShoppingCard = () => {

    const { guestId } = useGuestCart();
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([])
    const [cartitems, setCartItems] = useState([])
    const [subTotal, setSubTotal] = useState([])

    useEffect(() => {
        fetch(`/api/card/cart/${guestId}`)
            .then(res => res.json())
            .then(data => setItems(data?.cart?.items))
    }, [guestId])

    useEffect(() => {
        fetch(`/api/products`)
            .then(res => res.json())
            .then(data => setProducts(data.products))
    }, [items])

    useEffect(() => {
        if (!products?.length || !items?.length) return;

        const selectedProducts = products.filter(p =>
            items.some(item => item.productID === p._id)
        );
        setCartItems({ selectedProducts, items });
    }, [products, items]);

    useEffect(() => {
        if (!items?.length) return;
        const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0)
        setSubTotal(subtotal)
        console.log(subtotal);

    }, [items])

    return (
        <div className='w-11/12 mx-auto border rounded-lg my-10'>
            <div className='flex justify-between p-4'>
                <div className='w-3/4'>
                    <h1 className='text-2xl font-bold'>Shopping Card</h1>
                    <div className='py-4'>
                        {
                            cartitems?.selectedProducts?.map((card, iDx) => (
                                <div key={iDx} className=''>
                                    <div className='grid grid-cols-10 gap-2'>
                                        <img src={card.pImage[0]} alt={card.pName} className='rounded-xl w-full aspect-square col-span-2' />
                                        <div className='flex flex-col col-span-3'>
                                            <h1 className='font-semibold text-xl'>{card.pName}</h1>
                                            <p className='label text-sm'>#{card.pCode}</p>
                                        </div>
                                        <div className='flex gap-2 justify-between items-center col-span-2'>
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            </button>

                                            <input
                                                type="number"
                                                name="qty"
                                                className='input w-16 '
                                                defaultValue={cartitems?.items[iDx].qty}
                                                style={{ textAlign: "center" }}

                                            />
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            </button>
                                        </div>
                                        <div className='flex justify-center items-center col-span-2'>
                                            <h2>{card.salePrice} TK</h2>
                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <button>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <hr className='my-4' />
                                </div>
                            ))
                        }

                    </div>
                </div>
                <div className='w-1/4'>
                    <h1 className='text-2xl font-semibold'>Checkout</h1>
                    <div className='p-4'>
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
                                            <h3 className='text-end'>{cartitems?.items[iDx].qty * card.salePrice}</h3>
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
                                <h2>70</h2>
                            </div>
                            <div className='flex py-2'>
                                <input type="text" name='Promo' className='input p-1' placeholder='Voucher or Promo' />
                                <button className='btn btn-info'>APPLY</button>
                            </div>
                            <hr />
                            <div className='flex justify-between'>
                                <h1>Total:</h1>
                                <h2>{subTotal + 70}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCard;