import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("promo");

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, message: "ID parameter is missing" }, { status: 400 });
        }

        const findPromo = await collection.findOne({ _id: new ObjectId(id) })

        if (!findPromo) {
            return NextResponse.json({ success: false, message: "Promo Not Found" })
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: "Promo Not Found (ID may be incorrect or already deleted)" }, { status: 404 });
        }

        return NextResponse.json({ success: true, result }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 })
    }
}