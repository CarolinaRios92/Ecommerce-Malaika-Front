import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if(method === "GET"){
        const {id} = req.query;
        console.log(id);

        try {
            if(id){
                const category = await Category.findOne({_id: id});
                res.json(category);
            } else {
                const categories = await Category.find();
                res.json(categories);
            }
        } catch (error) {
            console.log(error.message)
        }        
    }
}