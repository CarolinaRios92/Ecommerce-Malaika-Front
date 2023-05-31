const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: "TEST-2518688239677103-053110-4948c339e4ef6fcef10c589ccf6f1643-1386243609"
});

const handler = async (req, res) => {
    const {query} = req;

    const topic = query.topic || query.type;

    console.log({query, topic});
};

export default handler; 