import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import mercadopago, { preferences } from "mercadopago";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

mercadopago.configure({
    access_token: "TEST-2518688239677103-053110-4948c339e4ef6fcef10c589ccf6f1643-1386243609"
})

export default async function handler(req, res){
    if(req.method !== "POST"){
        res.json("should be a POST request");
        return
    }

    const URL = "https://7187-2800-2246-6000-3ed-8c4c-4d59-7424-733c.ngrok-free.app"
    
    const {name, email, phone, cartProducts} = req.body;

    await mongooseConnect();
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id: uniqueIds});

    let line_items = [];
    for (const productId of uniqueIds){
        const productInfo = productsInfos.find(product => product._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;
        if(quantity > 0 && productInfo){
            line_items.push({
                title: productInfo.title,
                unit_price: productInfo.price,
                quantity: quantity,
        });
        }
    }

    const session = await getServerSession(req, res, authOptions);

    try {
        const orderDoc = await Order.create({
            line_items, 
            name, 
            email,
            phone,
            paid:false,
            userEmail: session?.user?.email,
    });
    
        const result = await mercadopago.preferences.create({
            items: line_items,
            auto_return: "approved",
            back_urls: {
                success: `${URL}/cart`,
                failure: `${URL}/cart`,
            },
            notification_url: `${URL}/api/notify`,
            metadata: {orderId: orderDoc._id.toString(), test:"ok"},
        });

        res.status(200).send({url: result.body.init_point});
    } catch (error) {
        res.status(400).send(error.message);
    }
    
}