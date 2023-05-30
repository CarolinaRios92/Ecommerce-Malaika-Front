import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";


export default async function handler(req, res){
    if(req.method !== "POST"){
        res.json("should be a POST request");
        return
    }
    
    const {name, email, products} = req.body;

    await mongooseConnect();
    const productsIds = products.split(",");
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({_id: uniqueIds});

    let line_items = [];
    for (const productId of uniqueIds){
        const productInfo = productsInfos.find(product => product._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;
        if(quantity > 0 && productInfo){
            line_items.push({
                quantity,
                price_data: {
                    currency: "PESOS",
                    product_data: productInfo.title,
                    unit_amount: quantity * productInfo.price,
                    price: productInfo.price,
                },
        });
        }
        
    }
    res.json({line_items})
}