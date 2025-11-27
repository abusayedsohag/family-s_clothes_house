export const runtime = "nodejs";

import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("brand");

        const body = await req.json();

        const existing = await collection.findOne({
            newBrand: body.newBrand,
        });


        if (existing) {
            return NextResponse.json({
                success: false,
                message: "Duplicate Brand found!",
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
        const collection = db.collection("brand");

        const data = await collection.find({}).toArray();

        return NextResponse.json({ success: true, brand: data });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}