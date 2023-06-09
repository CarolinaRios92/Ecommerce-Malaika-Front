import { CartContextProvider } from "@/components/CartContext"
import "../styles/styles.css"
import {SessionProvider} from "next-auth/react";

export default function App({ Component, 
  pageProps: {session, ...pageProps} }) {
  return (
    <>
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  )
}
