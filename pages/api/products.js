import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res){
    await mongooseConnect();
    const {categories, sort, phrase} = req.query;
    let [sortField, sortOrder] = (sort || "_id-desc").split("-");

    let productsQuery = {}

    if(categories){
        productsQuery.category = categories.split(",")
    };

    if(phrase){
        productsQuery["$or"] = [
            {title: {$regex:phrase, $options:"i"}},
            {description: {$regex:phrase, $options:"i"}}
        ]
    }

    const products = await Product.find(
        productsQuery, 
        null, 
        {sort:{[sortField]:sortOrder === "asc" ? 1 : -1}})
    res.json(products);
}