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

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px){
        grid-template-columns: 1.3fr .7fr;
    }
    gap: 40px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 30px 20px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
`;

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 70px;
    height: 80px;
    padding: 2px;
    border: 1px solid rgba(0,0,0,.1);
    display:flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    margin-bottom: 5px;
    img{
        max-width: 60px;
        max-height: 60px;
    }
    @media screen and (min-width: 768px){
        padding: 10px;
        width: 100px;
        height: 100px;
        img {
            max-width: 90px;
            max-height: 90px;
        }
    }
`;

const QuantityLabel = styled.span`
    padding: 0 3px;
    display: block;
    @media screen and (min-width: 768px){
        display: inline-block;
        padding: 0 10px;
    }
`;

const Total = styled.td`
    padding-top: 10px;
    font-weight: 500;
`


export default function CartPage(){
    const {cartProducts, addProduct, removeProduct, clearCart} = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if(cartProducts?.length > 0){
            axios.post("api/cart", {ids:cartProducts})
            .then(response => {
                setProducts(response.data);
            })
        } else {
            setProducts([]);
        }
    }, [cartProducts]);

    useEffect(() => {
        if(typeof window === "undefined"){
            return;
        }
        if(window?.location.href.includes("approved")){
            setIsSuccess(true);
            clearCart();
        }
    }, []);

    function moreOfThisProduct(id){
        addProduct(id);
    }

    function lessOfThisProduct(id){
        removeProduct(id);
    }

    let total = 0;
    for(const productId of cartProducts){
        const price = products.find(product => product._id === productId)?.price || 0;
        total += price;
    }

    async function goToPayment(){
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

    if(isSuccess){
        return (
            <>
                <Header />
                    <Center>
                        <ColumnsWrapper>
                            <Box>
                                <h1>Gracias por tu compra!</h1>
                                <p>Te enviaremos por email los datos de tu compra</p>
                            </Box>
                        </ColumnsWrapper>
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
                            {products?.length > 0 && (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products?.map(product => (
                                        <tr key={product._id}>
                                            <ProductInfoCell>
                                                <ProductImageBox>
                                                    <img src={product.images[0]} alt={product.title}/>
                                                </ProductImageBox>
                                                {product.title}
                                            </ProductInfoCell>
                                            <td>
                                                <Button 
                                                    onClick={() => lessOfThisProduct(product._id)}>
                                                    -
                                                </Button>
                                                <QuantityLabel>
                                                    {cartProducts.filter(id => id === product._id).length}
                                                </QuantityLabel>
                                                <Button 
                                                    onClick={() => moreOfThisProduct(product._id)}>
                                                        +
                                                </Button>
                                            </td>
                                            <td>
                                                $ {cartProducts.filter(id => id === product._id).length * product.price}
                                            </td>    
                                        </tr>
                                            ))}
                                        <tr>
                                            <td></td>
                                            <td></td>
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
                                <Input 
                                    type="text" 
                                    value={name} 
                                    name="name"
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"/>

                                <Input 
                                    type="text" 
                                    value={email} 
                                    name="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"/>
                                    
                                <Input 
                                    type="tel" 
                                    value={phone} 
                                    name="phone"
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="Telefono"/>

                                <Button 
                                    black={1}  
                                    b
                                    onClick={goToPayment}>
                                        Comprar Ahora
                                </Button>
                            </Box>
                        </RevealWrapper>
                        
                    )}
                </ColumnsWrapper>
            </Center> 
        </>
    )
}