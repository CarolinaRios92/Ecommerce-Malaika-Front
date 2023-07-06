import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";
import WhatsappIcon from "@/components/WhatsappIcon";
import Swal from "sweetalert2";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px){
        grid-template-columns: 1.2fr .8fr;
    }
    gap: 40px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
    button{padding:0 !important;}
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 100px;
    padding: 2px;
    border: 1px solid rgba(0,0,0,.1);
    display:flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px){
        padding: 10px;
        width: 100px;
        height: 100px;
        img {
            max-width: 80px;
            max-height: 80px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 15px;
    display: block;
    @media screen and (min-width: 768px){
        display: inline-block;
        padding: 0 6px;
    }
`;

const Total = styled.td`
    padding-top: 10px;
    font-weight: 500;
`

const ProductDescription = styled.p`
    font-size: 0.75rem;
    margin-top: 0px;
`;

const ProductTitle = styled.p`
    margin-bottom: 0px;
`;

const ButtonWhatsapp = styled.button`
    width: 160px;
    border: none;
    cursor: pointer;
    background: transparent;
    margin: auto;
    display: flex;
    img {
        height: 100%;
        width: 100%;
    }
`;


export default function CartPage(){
    const {data:session} = useSession();
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [stockProducts, setStockProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const idsProduct = cartProducts.map(product => (
        product.productId
    ));

    useEffect(() => {
        if(cartProducts?.length > 0){
            axios.post("/api/cart", {ids: idsProduct})
                .then(response => {
                    setStockProducts(response.data)
                })
        } else {
            setStockProducts([]);
        }
    }, [cartProducts])

    useEffect(() => {
        axios.get("/api/categories").then(response => {
                setCategories(response.data)
            })
    }, [cartProducts])

    useEffect(() => {
        if(typeof window === "undefined"){
            return;
        }
        if(window?.location.href.includes("approved")){
            setIsSuccess(true);
            clearCart();
        }
    }, []);

    console.log(cartProducts);

    useEffect(() => {
        if(!session){
            return;
        }
        axios.get("/api/client").then(response => {
            setName(response.data.name);
            setEmail(response.data.email);
            setPhone(response.data.phone);
        })
    }, [session]);

    function moreOfThisProduct(property, units, image, title, price, productId, nameProperty){
        for(let i = 0; i < stockProducts.length; i++){
            if(stockProducts[i]._id === productId){
                const stock = stockProducts[i].properties[nameProperty][property];
                if(parseInt(stock) <= units){
                    Swal.fire({
                        title: "No hay mas unidades en stock de este producto",
                        icon: "warning"
                    })
                    return;
                }
            }
        }
        addProduct(property, units, image, title, price, productId);
    }

    function lessOfThisProduct(id, property){
        removeProduct(id, property);
    }

    let total = 0;

    for(const product of cartProducts){
        const price = parseInt(product.units) * parseInt(product.price);
        total += price;
    }

    async function goToPayment(e){
        e.preventDefault()
        const response = await axios.post("/api/checkout", {
            name, 
            email,
            phone,
            cartProducts,
        });
        if(response.data.url){
            window.location = response.data.url;
        }
    }

    function whatsapp(){
        window.location.href = "https://wa.me/541140944120";
    }

    if(isSuccess){
        return (
            <>
                <Header />
                    <Center>
                        <ColumnsWrapper>
                            <Box>
                                <h1>Gracias por tu compra!</h1>
                                <p>Te podes comunicar para poder retirar tu compra al número: 1140944120</p>
                                <p>Nuestro local esta ubicado en Av. Santa fe 4549</p>
                                <p>Horario de Atención: 
                                <br></br>
                                Lunea a Viernes de 10:00 a 19:00hs
                                <br></br>
                                Sábados de 10:30 a 15:00hs</p>
                                <p>En la sección <strong>Tu Cuenta → Ordenes</strong> podes visualizar tu orden, cualquier consulta comunicate con nosotros</p>
                                <ButtonWhatsapp
                                    onClick={whatsapp}>
                                        <img src="https://www.candy-ink.com/wp-content/uploads/2020/09/boton-whatsapp.png"/>

                                </ButtonWhatsapp>
                            </Box>
                        </ColumnsWrapper>
                        <WhatsappIcon />
                    </Center>
            </>
        )
    }

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <RevealWrapper delay={0}>
                        <Box>
                            <h2>Carrito</h2>
                            {!cartProducts?.length && (
                                <div>El carrito esta vacio!</div>
                            )}
                            {cartProducts?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartProducts?.map((product, index) => (
                                        <tr key={product.productId}>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.image} alt={product.title}/>
                                                </ProductImageBox>

                                                <ProductTitle>{product.title}</ProductTitle>
                                                <ProductDescription>{product.property}</ProductDescription>

                                            </ProductInfoCell>
                                            <td>
                                                <Button 
                                                    onClick={() => lessOfThisProduct(product.productId, product.property)}>
                                                    -
                                                </Button>
                                                <QuantityLabel>
                                                    {product.units}    
                                                </QuantityLabel>
                                                <Button 
                                                    onClick={() => moreOfThisProduct(product.property, product.units, product.image, product.title, product.price, product.productId, product.nameProperty)}>
                                                        +
                                                </Button>
                                            </td>
                                            <td>
                                                $ {product.units * product.price}
                                            </td>    
                                        </tr>
                                            ))}
                                        <tr>
                                            <td></td>
                                            <Total>Total de la compra: </Total>
                                            <Total>${total}</Total>
                                        </tr>
                                </tbody>
                            </Table>
                            )}
                        </Box>
                    </RevealWrapper>
                    
                    {!!cartProducts?.length && (
                        <RevealWrapper delay={100}>
                            <Box>
                                <h2>Información para la Compra</h2>
                                <form onSubmit={goToPayment}>
                                    <Input 
                                        type="text" 
                                        value={name} 
                                        required
                                        name="name"
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"/>

                                    <Input 
                                        type="text" 
                                        required
                                        value={email} 
                                        name="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email"/>
                                        
                                    <Input 
                                        type="tel"
                                        required 
                                        value={phone} 
                                        name="phone"
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Telefono"/>

                                    <Button 
                                        black={1}
                                        block={1}
                                        disable={!phone || !email || !name}
                                        type="submit">
                                            Comprar Ahora
                                    </Button>
                                </form>
                                
                            </Box>
                        </RevealWrapper>
                        
                    )}
                </ColumnsWrapper>
                <WhatsappIcon />
            </Center> 
        </>
    )
}