import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import {useSession, signOut} from "next-auth/react";
import {useRouter} from "next/router";

export default function AccountPage () {
    const session = useSession();
    const router = useRouter();

    async function logout(){
        await router.push("/");
        await signOut({
            callbackUrl: process.env.NEXT_PUBLIC_URL
        });
    }

    return (
        <>
            <Header />
            {process.env.NEXT_PUBLIC_URL}
            <Center>
                
                <Title>Tu Cuenta</Title>
                {session && (
                    <Button 
                        primary={1}
                        onClick={logout}>
                            Logout
                    </Button>
                )}
                
            </Center>
        </>
    )
}