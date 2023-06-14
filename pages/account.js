import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import {useSession, signOut, signIn} from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import Spinner from "@/components/Spinner";
import ProductBox from "@/components/ProductBox";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.3fr .7fr;
    gap: 40px;
    margin: 40px 0;
    p {
        margin: 0 0 10px 0;
    }
`;

const WishedProductsGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
`

export default function AccountPage () {
    const {data:session} = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [dataLoaded, setDataLoaded] = useState(true);
    const [wishlistLoaded, setWishlistLoaded] = useState(true);
    const [wishedProducts, setWishedProducts] = useState([]);

    async function logout(){
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL
        });
    }

    async function login(){
        await signIn("google");
    }

    function saveInfo(){
        const data = {name, email, phone};
        axios.put("/api/client", data)
    }

    useEffect(() => {
        if(!session){
            return;
        }
        setDataLoaded(false);
        setWishlistLoaded(false);
        axios.get("/api/client").then(response => {
            setName(response.data.name);
            setEmail(response.data.email);
            setPhone(response.data.phone);
            setDataLoaded(true);
        });
        axios.get("/api/wishlist").then(response => {
            setWishedProducts(response.data.map(wp => wp.product));
            setWishlistLoaded(true);
        });
    },[session]);

    function productRemovedFromWishlist(idToRemove){
        setWishedProducts(products => {
            return [...products.filter(p => p._id.toString() !== idToRemove)]
        })
    }

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <WhiteBox>
                                <h2>Favoritos</h2>
                                {!wishlistLoaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {wishlistLoaded && (
                                    <>
                                        <WishedProductsGrid>
                                            {wishedProducts.length > 0 && wishedProducts.map(wp => (
                                                <ProductBox key={wp._id} {...wp} wished={true} onRemoveFromWishList={productRemovedFromWishlist} />
                                            ))}
                                        </WishedProductsGrid>
                                        {wishedProducts.length === 0 && (
                                                <>
                                                    {session && (
                                                        <p>Tu lista de favoritos esta vacia!</p>
                                                    )}
                                                    {!session && (
                                                        <p>Registrate para agregar productos a tu lista de favoritos!</p>
                                                    )}
                                                </>
                                                
                                            )}
                                    </>
                                    
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <h2>{session ? "Datos Cuenta" : "Login"}</h2>
                                {!dataLoaded && (
                                    <Spinner fullWidth={true} />
                                )}
                                {dataLoaded && session && (
                                    <>
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
                                            block={1}
                                            onClick={saveInfo}>
                                                Guardar Cambios
                                        </Button>

                                        <hr/>
                                    </>
                                )}
                                
                                {session && (
                                    <Button 
                                        primary={1}
                                        onClick={logout}>
                                            Logout
                                    </Button>
                                )}
                                {!session && (
                                    <Button
                                        primary={1}
                                        onClick={login}>
                                        Login con Google
                                    </Button>
                                )}
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
                
                
            </Center>
        </>
    )
}