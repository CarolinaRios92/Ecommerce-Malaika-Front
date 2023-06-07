import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res){
    await mongooseConnect();
    const {categories, ...filters} = req.query;

    const productsQuery = {
        category: categories.split(","),
    }

    if(Object.keys(filters).length > 0){
        Object.keys(filters).forEach(filterName => {
            const value = filters[filterName];
            productsQuery["properties."+filterName] = value;
        })
    };
    const products = await Product.find(productsQuery)
    res.json(products);
}