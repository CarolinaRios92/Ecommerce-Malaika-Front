import { Schema, model, models } from "mongoose";

const ClientSchema = new Schema({
    clientEmail:{type:String, unique:true, required:true},
    name:String,
    email:String,
    phone:Number
})

export const Client = models?.Client || model("Client", ClientSchema);