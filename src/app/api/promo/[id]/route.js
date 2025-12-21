import clientPromise from "@/lib/mongoDB";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db("familys_clothes_house");
        const collection = db.collection("promo");

        const { id } = await params;

        const result = await collection.findOne({ promoCode: id })

        if (!result) {
            return NextResponse.json(
                { success: false, message: "Promo not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Finded", result })
    } catch (error) {
        return NextResponse.json({ success: false, error }, { status: 500 })
    }
}

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


export async function PUT(req, { params }) {
    const client = await clientPromise;
    const session = client.startSession();

    try {
        const db = client.db("familys_clothes_house");
        const promoCollection = db.collection("promo");
        const userCollection = db.collection("accounts-user");

        // ✅ FIX: params without await
        const { id } = await params;
        const promoCode = id?.toUpperCase();

        const { email, total } = await req.json();

        if (!promoCode) {
            return NextResponse.json(
                { success: false, message: "Promo code missing" },
                { status: 400 }
            );
        }

        const amount = Number(total);

        if (isNaN(amount) || amount <= 0) {
            return NextResponse.json(
                { success: false, message: "Order amount invalid" },
                { status: 400 }
            );
        }

        if (!email) {
            return NextResponse.json(
                { success: false, message: "email missing" },
                { status: 400 }
            );
        }

        let updatedPromo;

        await session.withTransaction(async () => {

            /* =======================
               1️⃣ Find promo
            ======================= */
            const promo = await promoCollection.findOne(
                { promoCode },
                { session }
            );

            if (!promo) {
                throw new Error("PROMO_NOT_FOUND");
            }

            /* =======================
               2️⃣ Check expiry
            ======================= */
            if (promo.expireDate) {
                const today = new Date();
                const [day, month, year] = promo.expireDate.split("/");
                const expireDate = new Date(`${year}-${month}-${day}`);

                if (today > expireDate) {
                    throw new Error("PROMO_EXPIRED");
                }
            }

            /**
             * Check Order Item total Amount
             */

            const minOrder = Number(promo.minOrder || 0);
            const maxOrder = Number(promo.maxOrder || Infinity);
            const amount = Number(total);

            if (amount < minOrder) {
                return NextResponse.json({ success: false, message: `MIN_ORDER_EXCEEDED:${promo.minOrder}` })
            }

            if (amount > maxOrder) {
                return NextResponse.json({ success: false, message: `MAX_ORDER_EXCEEDED:${promo.maxOrder}` })
            }


            /* =======================
               3️⃣ Check usage limit
            ======================= */
            const usedCount = promo.pendingCount || 0;
            const usageLimit = Number(promo.usageLimit || 0);

            if (usageLimit && usedCount >= usageLimit) {
                throw new Error("USAGE_LIMIT_REACHED");
            }

            /* =======================
               4️⃣ Find user
            ======================= */
            const user = await userCollection.findOne(
                { email },
                { session }
            );

            if (!user) {
                throw new Error("USER_NOT_FOUND");
            }

            /* =======================
               5️⃣ Prevent duplicate usage
            ======================= */
            if (user.pendingPromos?.includes(promoCode)) {
                throw new Error("ALREADY_USED");
            }

            /* =======================
               6️⃣ Update promo + user
            ======================= */
            const promoResult = await promoCollection.findOneAndUpdate(
                { promoCode },
                { $inc: { pendingCount: 1 } },
                { returnDocument: "after", session }
            );

            await userCollection.updateOne(
                { email },
                { $addToSet: { pendingPromos: promoCode } },
                { session }
            );

            updatedPromo = promoResult.value;
        });

        return NextResponse.json(
            {
                success: true,
                message: "Promo applied successfully",
                promo: updatedPromo,
            },
            { status: 200 }
        );

    } catch (error) {

        if (error.message === "PROMO_NOT_FOUND") {
            return NextResponse.json(
                { success: false, message: "Promo not found" },
                { status: 404 }
            );
        }

        if (error.message === "PROMO_EXPIRED") {
            return NextResponse.json(
                { success: false, message: "Promo expired" },
                { status: 400 }
            );
        }

        if (error.message === "USAGE_LIMIT_REACHED") {
            return NextResponse.json(
                { success: false, message: "Promo usage limit reached" },
                { status: 400 }
            );
        }

        if (error.message === "ALREADY_USED") {
            return NextResponse.json(
                { success: false, message: "You already used this promo" },
                { status: 400 }
            );
        }

        if (error.message === "USER_NOT_FOUND") {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        if (error.message === "MIN_ORDER_NOT_MET") {
            return NextResponse.json(
                { success: false, message: `Minimum order amount is ${promo?.minOrder}` },
                { status: 400 }
            );
        }

        if (error.message === "MAX_ORDER_EXCEEDED") {
            return NextResponse.json(
                { success: false, message: `Maximum order amount is ${promo?.maxOrder}` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );

    } finally {
        await session.endSession();
    }
}
