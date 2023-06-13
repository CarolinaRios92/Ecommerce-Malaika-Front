import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import {useSession, signOut, signIn} from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import { useState } from "react";
import styled from "styled-components";

const ColsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1.2fr .8fr;
    gap: 40px;
    margin: 40px 0;
`;

const Box = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 10px 30px 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 5px;
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

    return (
        <>
            <Header />
            <Center>
                <ColsWrapper>
                    <div>
                        <RevealWrapper delay={0}>
                            <Box>
                                <h2>Favoritos</h2>
                            </Box>
                        </RevealWrapper>
                    </div>
                    <div>
                        <RevealWrapper delay={100}>
                            <Box>
                                <h2>Datos Cuenta</h2>
                            </Box>
                        </RevealWrapper>
                    </div>
                </ColsWrapper>
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
                
            </Center>
        </>
    )
}