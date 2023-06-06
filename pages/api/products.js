import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res){
    await mongooseConnect();
    const {categories} = req.query;

    const products = await Product.find({category: categories.split(",")})
    res.json(products);
}