import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";

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

const ProductInfoCell = styled.td`
    padding: 10px 0;
`;

const ProductImageBox = styled.div`
    width: 100px;
    height: 100px;
    padding: 10px;
    border: 1px solid rgba(0,0,0,.1);
    display:flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
        img{
        max-width: 80px;
        max-height: 80px;
    }
`;

const QuantityLabel = styled.span`
    padding: 0 3px;
`;


export default function CartPage(){
    const {cartProducts, addProduct, removeProduct} = useContext(CartContext);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if(cartProducts?.length > 0){
            axios.post("api/cart", {ids:cartProducts})
            .then(response => {
                setProducts(response.data);
            })
        }
    }, [cartProducts]);

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
                                            <Button onClick={() => lessOfThisProduct(product._id)}>-</Button>
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
                                        <td>${total}</td>
                                    </tr>
                            </tbody>
                        </Table>
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