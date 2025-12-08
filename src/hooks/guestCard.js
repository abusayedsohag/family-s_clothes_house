"use client";

import { MainContext } from "@/context/MainContext";
import { useState, useEffect, useContext } from "react";

export default function useGuestCart() {

    const [guestId, setGuestId] = useState(null);
    const { setReload, reload } = useContext(MainContext)

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

        const res = await fetch("/api/card/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                guestId: gId,
                productID: product._id,
                qty: 1,
                price: product.salePrice,
            }),
        });

        const data = await res.json()        

        if (data.success) {
            setReload(!reload)
        }

        return data
    };

    return { addToCart, guestId };
}
