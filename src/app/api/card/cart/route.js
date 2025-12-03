import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("shopping-carts");

        const { guestId, productID, qty = 1, price} = await req.json();

        if (!guestId || !productID) {
            return NextResponse.json({ error: "No guest id or No ProductsInfo" }, { status: 400 });
        }

        let cart = await collection.findOne({ guestId });

        if (!cart) {
            await collection.insertOne({ guestId, items: [{ productID, qty, price }], createdAt: new Date(), updatedAt: new Date() });
        } else {
            const itemIndex = cart.items.findIndex(i => i.productID === productID);
            if (itemIndex > -1) {
                cart.items[itemIndex].qty += qty;
            } else {
                cart.items.push({ productID, qty, price });
            }

            await collection.updateOne(
                { guestId },
                { $set: { items: cart.items, updatedAt: new Date() } }
            );
        }

        return NextResponse.json({ message: "Added to cart" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("shopping-carts");

        const carts = await collection.find({}).toArray();

        return NextResponse.json({ carts: carts });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
