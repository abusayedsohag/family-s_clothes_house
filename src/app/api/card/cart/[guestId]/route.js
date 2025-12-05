import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

export async function PUT(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house")
        const collection = db.collection("shopping-carts")
        const proCollection = db.collection("products")

        const { guestId } = await params;
        const { productID, direction } = await req.json();

        const cart = await collection.findOne({ guestId })

        if (!cart) {
            return NextResponse.json({ error: "Cart not Found" })
        }

        const itemIndex = cart.items.findIndex(item => item.productID === productID);

        console.log(itemIndex);
        

        if (itemIndex === -1) {
            return NextResponse.json({ error: "Item not found" });
        }

        const product = await proCollection.findOne({ _id: new ObjectId(productID) })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        let currentQty = cart.items[itemIndex].qty;
        const stockQty = product.pStock

        if (direction === "increase") {
            if (currentQty >= stockQty) {
                return NextResponse.json({
                    error: "Stock Limited",
                    maxStock: stockQty
                });
            }
            cart.items[itemIndex].qty += 1;
        } else if (direction === "decrease") {
            if (cart.items[itemIndex].qty === 1) {
                return NextResponse.json({
                    checkConfirmDelete: true
                })
            }

            cart.items[itemIndex].qty = Math.max(1, cart.items[itemIndex].qty - 1);
        }

        await collection.updateOne(
            { guestId },
            { $set: { items: cart.items, updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true, items: currentQty })
    } catch (err) {
        console.log("🔥 Server Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("shopping-carts");

        const { guestId } = await params;
        const { productID } = await req.json();

        if (!productID) {
            return NextResponse.json({ error: "productID is required" }, { status: 400 });
        }

        const cart = await collection.findOne({ guestId })

        if (!cart) {
            return NextResponse.json({ error: "Cart not Found" }, { status: 400 })
        }

        const itemIndex = cart.items.findIndex(item => item.productID === productID);

        if (itemIndex === -1) {
            return NextResponse.json({ error: "Item not found" });
        }

        const updatedItems = cart.items.filter(item => item.productID !== productID);

        const result = await collection.updateOne(
            { guestId },
            { $set: { items: updatedItems, updatedAt: new Date() } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Item deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}