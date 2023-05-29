import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";

const StyleHeader = styled.header`
    background-color: #222;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration:none;
    position:relative;
    z-index: 3;
`;

const Wrapper = styled.div`
    display:flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    display: flex;
    gap: 15px;
`;

const NavLink = styled(Link)`
    color: #aaa;
    text-decoration:none;
`;

export default function Header(){
    return(
        <StyleHeader>
            <Center>
                <Wrapper>
                    <Logo href={"/"}>
                        Malaika
                    </Logo>

                    <StyledNav>
                        <NavLink href={"/"}>Home</NavLink>
                        <NavLink href={"/products"}>Productos</NavLink>
                        <NavLink href={"/categories"}>Categorias</NavLink>
                        <NavLink href={"/account"}>Tu Cuenta</NavLink>
                        <NavLink href={"/cart"}>Carrito</NavLink>
                    </StyledNav>
                </Wrapper>
                
            </Center>
            
        </StyleHeader>
    )
}