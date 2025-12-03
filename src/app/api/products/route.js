export const runtime = "nodejs";

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

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("products");

        const products = await collection.find({}).toArray();
        return NextResponse.json({ success: true, products });


    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
