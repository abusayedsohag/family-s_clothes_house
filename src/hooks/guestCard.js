"use client";

import { useState, useEffect } from "react";

export default function useGuestCart() {

    const [guestId, setGuestId] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("guestId");
        if (stored) {
            setGuestId(stored);
        }
    }, []);

    const createGuestCart = async () => {
        const res = await fetch("/api/card/guest", { method: "POST" });
        const data = await res.json();

        localStorage.setItem("guestId", data.guestId);
        setGuestId(data.guestId);

        return data.guestId;
    };

    const addToCart = async (product) => {

        let gId = guestId;

        if (!gId) {
            gId = await createGuestCart();
        }

        await fetch("/api/card/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                guestId: gId,
                productID: product._id,
                qty: 1,
                price: product.salePrice,
            }),
        });
    };

    return { addToCart, guestId };
}
