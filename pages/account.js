import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import {useSession, signOut, signIn} from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useState } from "react";
import styled from "styled-components";
import Input from "@/components/Input";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin: 40px 0;
`;

export default function AccountPage () {
    const {data:session} = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

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
        axios.put("/api/user", data)
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
                            </WhiteBox>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <WhiteBox>
                                <h2>Datos Cuenta</h2>
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
                                        Login
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