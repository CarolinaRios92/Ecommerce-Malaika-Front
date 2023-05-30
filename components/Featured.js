import styled from "styled-components";
import Center from "./Center";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
    margin:0;
    font-weight:normal;
    font-size: 3rem;
`;

const Desc = styled.p`
    color: #aaa;
    font-size:.8rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    img {
        max-width: 100%;
        max-height: 280px;
        margin: auto
    }
`;

const Column = styled.div`
    display:flex;
    align-items:center;
`

const ButtonsWrapper = styled.div`
    display:flex;
    gap: 10px;
    margin-top: 25px;
` 

export default function Featured({product}){
    const {addProduct} = useContext(CartContext);

    function addFeaturedToCart(){
        addProduct(product._id);
    }

    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <Title>{product.title}</Title>
                            <Desc>{product.description}</Desc>

                            <ButtonsWrapper>
                                <ButtonLink 
                                    href={"/products/"+product._id} 
                                    outline={1} 
                                    white={1}>
                                    Mas información
                                </ButtonLink>
                                <Button white={1} onClick={addFeaturedToCart}>
                                    <CartIcon />
                                    Agregar
                                </Button>
                            </ButtonsWrapper>
                        </div>
                    </Column>
                    <Column>
                        <img src="https://ecommerce-woman.s3.us-east-2.amazonaws.com/1684853825438.jpg" alt="imagen del producto" />
                    </Column>
                </ColumnsWrapper>
                
            </Center>
        </Bg>
    )
}