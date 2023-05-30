import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 40px;
    margin-top: 40px;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
`;

export default function CartPage(){
    const {cartProducts} = useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if(cartProducts?.length > 0){
            axios.post("api/cart", {ids:cartProducts})
            .then(response => {
                setProducts(response.data);
            })
        }
    }, [cartProducts]);

    return (
        <>
            <Header />
            <Center>
                <ColumnsWrapper>
                    <Box>
                        <h2>Carrito</h2>
                        {!cartProducts?.length && (
                            <div>El carrito esta vacio!</div>
                        )}
                        {products?.length > 0 && (
                        <table>
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
                                        <td>{product.title}</td>
                                        <td>{cartProducts.filter(id => id === product._id).length}</td>
                                        <td>{product.price}</td>    
                                    </tr>
                                        ))}
                            </tbody>
                        </table>
                         )}
                    </Box>
                    {!!cartProducts?.length && (
                        <Box>
                        <h2>Información de la Compra</h2>
                        <Button black={1} block={1}>Comprar Ahora</Button>
                    </Box>
                    )}
                </ColumnsWrapper>
            </Center> 
        </>
    )
}