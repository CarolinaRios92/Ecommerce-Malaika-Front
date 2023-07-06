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

    const URL = "https://1fb8-2800-2246-6000-3ed-b86b-9127-539c-60b7.ngrok-free.app"
    
    const {name, email, phone, cartProducts} = req.body;

    await mongooseConnect();

    let line_items = [];
    for (const product of cartProducts){
        line_items.push({
            title: product.title + " - " + product.property,
            unit_price: product.price,
            quantity: parseInt(product.units),
        });
    }

    const session = await getServerSession(req, res, authOptions);

    try {
        const orderDoc = await Order.create({
            line_items, 
            name, 
            email,
            phone,
            paid:false,
            delivered:false,
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

        for(let i = 0; i < cartProducts.length; i++){
            const idProduct = cartProducts[i].productId;
            const originalProduct = await Product.findOne({_id: idProduct});
            const stock = parseInt(originalProduct.properties[cartProducts[i].nameProperty][cartProducts[i].property]) - cartProducts[i].units;
            originalProduct.properties[cartProducts[i].nameProperty][cartProducts[i].property] = stock.toString();
            const properties = originalProduct.properties;
            await Product.updateOne({_id: idProduct}, {properties});
        }

        res.status(200).send({url: result.body.init_point});
    } catch (error) {
        res.status(400).send(error.message);
    }
    
}