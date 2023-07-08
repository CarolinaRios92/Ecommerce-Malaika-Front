import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import { useContext, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/BarsIcon";
import SearchIcon from "./icons/SearchIcon";
import { secondary } from "@/lib/colors";

const StyleHeader = styled.header`
    background-color: ${secondary};
    position: sticky;
    top:0;
    z-index: 10;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration:none;
    position:relative;
    z-index: 3;
    font-size: 1.8rem;
`;

const Wrapper = styled.div`
    display:flex;
    justify-content: space-between;
    padding: 20px 0;
    align-items: center;
`;

const StyledNav = styled.nav`
    ${props => props.mobileNavActive 
        ? `display: block;` 
        : `display: none;`}
    gap: 20px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 70px 20px 20px;
    background-color: ${secondary};
    @media screen and (min-width: 768px){
        display: flex;
        position: static;
        padding: 0;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration:none;
    padding: 10px 0;
    min-width: 30px;
    svg{
        height: 20px;
    }
    @media screen and (min-width: 768px){
        padding: 0;
    }
`;

const NavButton = styled.button`
    background-color: transparent;
    width: 40px;
    height: 40px;
    border: 0;
    color: white;
    cursor: pointer;
    position:relative;
    z-index: 3;
    @media screen and (min-width: 768px){
        display: none;
    }
`;

const SideIcons = styled.div`
    display: flex;
    align-items: center;
    a {
        display: inline-block;
        min-width: 20px;
        color: white;
        svg {
            width: 20px;
            height: 20px;
        }
    }
`;

export default function Header(){
    const {cartProducts} = useContext(CartContext)
    const [mobileNavActive, setMobileNavActive] = useState(false);

    let total = 0;

    const totalProducts = cartProducts.map(product => (
        total = total + parseInt(product.units)
    ))

    return(
        <StyleHeader>
            <Center>
                <Wrapper>
                    <Logo href={"/"}>
                        Malaika
                    </Logo>
                    
                    <StyledNav mobileNavActive={mobileNavActive}>
                        <NavLink href={"/"}>Home</NavLink>
                        <NavLink href={"/products"}>Productos</NavLink>
                        <NavLink href={"/categories"}>Categorias</NavLink>
                        <NavLink href={"/account"}>Tu Cuenta</NavLink>
                        <NavLink href={"/cart"}>Carrito ({total})</NavLink>
                    </StyledNav>
                    <SideIcons>
                        <Link href={"/search"}><SearchIcon /></Link>
                        <NavButton onClick={() => setMobileNavActive(prev => !prev)}>
                            <BarsIcon />
                        </NavButton>
                    </SideIcons>
                </Wrapper>
                
            </Center>
            
        </StyleHeader>
    )
}