'use client'
import useGuestCart from '@/hooks/guestCard';
import React, { useEffect, useState } from 'react';

const ShoppingCard = () => {

    const { guestId } = useGuestCart();
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([])
    const [cartitems, setCartItems] = useState([])

    console.log(items);
    

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
        setCartItems(selectedProducts);
    }, [products, items]);






    return (
        <div className='w-11/12 mx-auto border rounded-lg my-10'>
            <div className='flex justify-between'>
                <div className='w-3/4'>
                    <h1>Shopping Card</h1>
                    <div>
                        {
                            cartitems?.map((data, iDx) => (
                                <div key={iDx} className='flex justify-between'>
                                    <h1>{items[iDx].productID}</h1>
                                    <h1>{data._id}</h1>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='w-1/4'>
                    <h1>Checkout</h1>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCard;