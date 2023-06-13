import styled from "styled-components"
import Button from "./Button";
import Link from "next/link";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";


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
    justify-content: space-between;
    margin-top: 2px;
`;

const Price = styled.div`
    font-size: 1rem;
    font-weight: 400;
    text-align: right;
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
    svg{
        width: 18px;
    }
`;

export default function ProductBox({_id, title, price, images}){
    const url = "/product/"+_id;
    return (
        <ProductWrapper>
            <WhiteBox href={url}>
                <div>
                    <WishlistButton>
                        <HeartOutlineIcon />
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
                    <FlyingButton _id={_id} src={images?.[0]}>
                        Agregar
                    </FlyingButton>
                </PriceRow>
            </ProductInfoBox>
        </ProductWrapper>
    )
}