import styled from "styled-components"
import Button from "./Button";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";


const ProductWrapper = styled.div`
    button{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
`;

const WhiteBox = styled(Link)`
    background-color: #fff;
    padding: 20px;
    height: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    position: relative;
    ${props => props.stock 
        ? `opacity: 1`
        : `opacity: 0.4`};
    svg{
        width: 18px;
    }
    img{
        max-width: 100%;
        max-height: 110px
    }
`;

const Title = styled(Link)`
    font-weight: normal;
    font-size: 1rem;
    margin: 0;
    color: inherit;
    text-decoration: none;
`;

const ProductInfoBox = styled.div`
    margin-top: 5px;
`;

const PriceRow = styled.div`
    display: block;
    @media screen and (min-width: 768px) {
        display: flex;
        gap: 5px;
    }
    align-items: center;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 400;
    text-align: right;
    margin-top:0;
    padding-top:0;
    @media screen and (min-width: 768px) {
        font-size: 1.2rem;
        font-weight: 600;
        text-align: left;
    }
`;

const WishlistButton = styled.button`
    border: 0;
    width: 40px !important;
    height: 40px;
    padding: 10px;
    position: absolute;
    top:0;
    right: 0;
    background: transparent;
    cursor: pointer;
    ${props => props.wished 
        ? `color: red`
        : `color: black`};
    svg{
        width: 18px;
    }
`;

const WithoutStock = styled.p`
    color: rgb(185 28 28);
    font-size: 0.8rem;
    font-weight: 600;
`

export default function ProductBox({_id, title, price, images, properties, wished=false, onRemoveFromWishList=() =>{}}){
    const [isWhished, setIsWished] = useState(wished);
    const url = "/product/"+_id;

    let unitStock = [];

    for(const property in properties[Object.keys(properties)[0]]){
        console.log()
        if(parseInt(properties[Object.keys(properties)[0]][property]) > 0){
            unitStock.push(property);
        }
    }

    function addToWishlist(e){
        e.preventDefault();
        const nextValue = !isWhished;
        if(nextValue === false && onRemoveFromWishList){
            onRemoveFromWishList(_id);
        }
        axios.post("/api/wishlist", {
            product: _id,
        }).then(() => {});
        setIsWished(nextValue);
    }

    return (
        <ProductWrapper>
            <WhiteBox stock={unitStock.length > 0} href={url}>
                <div>
                    <WishlistButton 
                        wished={isWhished} 
                        onClick={addToWishlist}>
                        {isWhished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
                    </WishlistButton>
                    <img src={images[0]} alt={title}/>
                </div>
            </WhiteBox>
            <ProductInfoBox>
                <Title href={url}>
                    {title}
                </Title>
                <PriceRow>
                    <Price>
                        $ {price}
                    </Price>
                    {unitStock.length === 0 && (
                        <WithoutStock>(Sin Stock)</WithoutStock>
                    )}
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}