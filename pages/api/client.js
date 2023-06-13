import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Client } from "@/models/Client";

export default async function handle(req, res){
    await mongooseConnect();
    const {user} = await getServerSession(req, res, authOptions);
    const existingClient = await Client.findOne({clientEmail: user.email});

    if(req.method === "PUT"){
        if(existingClient){
            const updateClient = await Client.findByIdAndUpdate(existingClient._id, req.body);
            res.json(updateClient);
        } else {
            const newClient = await Client.create({clientEmail: user.email, ...req.body});
            res.json(newClient);
        }
    }
    
    if(req.method === "GET"){
        res.json(existingClient);
    }
}