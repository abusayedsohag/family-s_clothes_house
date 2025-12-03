import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("shopping-carts");

        const { guestId } = await params;
        const cart = await collection.findOne({ guestId });

        return NextResponse.json({ cart: cart });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}