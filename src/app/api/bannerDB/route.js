export const runtime = "nodejs";

import clientPromise from "@/lib/mongoDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("banner_info");

        const body = await req.json();

        const existing = await collection.findOne({
            image: body.image,
        });


        if (existing) {
            return NextResponse.json({
                success: false,
                message: "Duplicate banner found!",
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
        const collection = db.collection("banner_info");

        const data = await collection.find({}).toArray();

        const availableBanners = data.filter(banner => {
            const [sDay, sMonth, sYear] = banner.startDate.split("/").map(Number);
            const [eDay, eMonth, eYear] = banner.expireDate.split("/").map(Number);

            const todayUTC = new Date();
            todayUTC.setHours(todayUTC.getHours() + 6);

            const dateOnly = new Date(Date.UTC(
                todayUTC.getUTCFullYear(),
                todayUTC.getUTCMonth(),
                todayUTC.getUTCDate()
            ));

            const startDateUTC = new Date(Date.UTC(sYear, sMonth - 1, sDay));
            const expireDateUTC = new Date(Date.UTC(eYear, eMonth - 1, eDay));

            console.log(startDateUTC, expireDateUTC, dateOnly)

            return dateOnly >= startDateUTC && dateOnly <= expireDateUTC;

        });

        return NextResponse.json({ success: true, bannersall: data, banners: availableBanners });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("banner_info");

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Missing banner ID" }, { status: 400 });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
