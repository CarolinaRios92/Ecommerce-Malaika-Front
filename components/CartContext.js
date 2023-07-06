import { property } from "lodash";
import { createContext, useEffect } from "react";
import { useState } from "react";

export const CartContext = createContext({});

export function CartContextProvider({children}){
    const ls = typeof window !== "undefined" ? window.localStorage : null;
    const [cartProducts, setCartProducts] = useState([]);

    useEffect(() => {
        if(cartProducts?.length > 0){
            ls?.setItem("cart", JSON.stringify(cartProducts));
        }
    }, [cartProducts]);
    
    useEffect(() => {
        if(ls && ls.getItem("cart")){
            setCartProducts(JSON.parse(ls.getItem("cart")))
        }
    }, []);
    
    function addProduct(property, units, image, title, price, productId, nameProperty){
        for(let i = 0; i < cartProducts.length; i++){
            if((cartProducts[i].productId === productId) && (cartProducts[i].property === property)){
                cartProducts[i].units = parseInt(cartProducts[i].units) + 1;
                setCartProducts([...cartProducts]);
                return;
            }
        }
        setCartProducts(prev => [...prev, {property, units, image, title, price, productId, nameProperty}]);
    }

    function removeProduct(productId, property){
        for(let i = 0; i < cartProducts.length; i++){
            if((cartProducts[i].productId === productId) && (cartProducts[i].property === property)){
                    cartProducts[i].units = parseInt(cartProducts[i].units) - 1;
                    setCartProducts([...cartProducts]);
                    if(cartProducts[i].units <= 0){
                        cartProducts.splice(i, 1)
                        setCartProducts([...cartProducts]);
                        return
                }
            }
        }
    }

    function clearCart(){
        setCartProducts([]);
    }

    return (
        <CartContext.Provider value={{
                cartProducts, 
                setCartProducts, 
                addProduct,
                removeProduct,
                clearCart}}>
            {children}
        </CartContext.Provider>
    )
}