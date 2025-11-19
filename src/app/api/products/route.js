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

        console.log(imgDub, body.pImage)

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

        const data = await collection.find({}).toArray();

        return NextResponse.json({ success: true, products: data });
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

// export async function PUT(req) {
//     try {
//         const client = await clientPromise;
//         const db = client.db("familys_clothes_house");
//         const collection = db.collection("banner_info");

//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get("id");

//         if (!id) {
//             return NextResponse.json({ success: false, message: "Missing banner ID" }, { status: 400 });
//         }

//         const body = await req.json();


//         const result = await collection.updateOne({ _id: new ObjectId(id) }, {
//             $set: {
//                 ...body
//             }
//         })

//         if (result.modifiedCount === 0) {
//             return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
//         }

//         return NextResponse.json({ success: true, message: "Banner Update successfully" });
//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//     }
// }
