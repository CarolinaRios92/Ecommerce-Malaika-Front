import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import {useSession, signOut, signIn} from "next-auth/react";
import {useRouter} from "next/router";

export default function AccountPage () {
    const {data:session} = useSession();
    const router = useRouter();
    console.log(session);

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
                <Title>Tu Cuenta</Title>
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