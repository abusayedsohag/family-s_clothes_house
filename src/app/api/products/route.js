export const runtime = "nodejs";

import Products from "@/app/admin/products/page";
import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("products");

        const body = await req.json();

        const cleanImages = (body.pImage || []).filter(img => img && img.trim() !== "");

        let imgDub = null;
        if (cleanImages.length > 0) {
            imgDub = await collection.findOne({
                pImage: { $in: cleanImages }
            });
        }

        if (imgDub) {
            return NextResponse.json({
                success: false,
                type: "image",
                message: "Image already exists"
            });
        }

        const codeDub = await collection.findOne({
            pCode: body.pCode
        });

        if (codeDub) {
            return NextResponse.json({
                success: false,
                type: "code",
                message: "Product code already exists"
            });
        }

        const result = await collection.insertOne(body);

        return NextResponse.json({
            success: true,
            insertedId: result.insertedId
        });

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("products");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const product = await collection.findOne({ _id: new ObjectId(id) });
            return NextResponse.json({ success: true, product });
        } else {
            const products = await collection.find({}).toArray();
            return NextResponse.json({ success: true, products });
        }

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}


export async function DELETE(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("products");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Missing Product ID" }, { status: 400 });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("products");

        const { id, pData } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "Missing Product ID" }, { status: 400 });
        }

        const cleanImages = (pData.pImage || []).filter(img => img && img.trim() !== "");

        let imgDub = null;
        if (cleanImages.length > 0) {
            imgDub = await collection.findOne({
                _id: { $ne: new ObjectId(id) },
                pImage: { $in: cleanImages }
            });
        }

        if (imgDub) {
            return NextResponse.json({
                success: false,
                type: "image",
                message: "Image already exists"
            });
        }

        const codeDub = await collection.findOne({
            _id: { $ne: new ObjectId(id) },
            pCode: pData.pCode
        });

        if (codeDub) {
            return NextResponse.json({
                success: false,
                type: "code",
                message: "Product code already exists"
            });
        }


        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: pData }
        )

        if (result.modifiedCount === 0) {
            return NextResponse.json({ success: false, message: "No Changed", result: result }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Products Update successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
