import { Order } from "@/models/Order";

const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: "TEST-2518688239677103-053110-4948c339e4ef6fcef10c589ccf6f1643-1386243609"
});

const handler = async (req, res) => {
    const {query} = req;

    const topic = query.topic || query.type;

    try {
        if(topic === "payment"){
            const paymentId = query.id || query["data.id"];
            const payment = await mercadopago.payment.findById(paymentId);
            let paymentStatus = payment.body.status;
            let orderId = payment.body.metadata["order_id"];

            if(orderId && paymentStatus === "approved"){
                await Order.findByIdAndUpdate(orderId, {
                    paid: true,
                })
            }
        }
        res.status(200).send("the payment was successful");
    } catch (error) {
        res.status(400).send(error.message)
    }
};

export default handler; 