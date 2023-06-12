import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Input from "@/components/Input";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductsGrid from "@/components/ProductsGrid";
import { debounce } from "lodash";
import Spinner from "@/components/Spinner";

const SearchInput = styled(Input)`
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 1.3rem;
`;

const InputWrapper = styled.div`
    position: sticky;
    top:68px;
    margin: 25px 0;
    padding: 5px 0;
    background-color: #eee;
`;

export default function SearchPage(){
    const [phrase, setPhrase] = useState("");
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedSearch = useCallback(
        debounce(searchProducts, 500), []);

    useEffect(() => {
        if(phrase.length > 0){
            setIsLoading(true);
           debouncedSearch(phrase);
        } else {
            setProducts([]);
        }
    }, [phrase]);

    console.log(phrase);

    function searchProducts(phrase){
         axios.get("/api/products?phrase="+encodeURIComponent(phrase))
                .then(response => {
                    setProducts(response.data);
                    setIsLoading(false)
                })
    }

    return (
        <>
            <Header />
            <Center>
                <InputWrapper>
                    <SearchInput 
                    value={phrase}
                    onChange={e => setPhrase(e.target.value)}
                    autoFocus
                    placeholder="Buscar..."/>
                </InputWrapper>
                
                {!isLoading && phrase !== "" && products.length === 0 && (
                    <h2>No se encontraron productos para la busqueda &quot;{phrase}&quot;</h2>
                )}
                {isLoading && (
                    <Spinner fullWidth={true} />
                )}
                {!isLoading && products.length > 0 && phrase !== "" && (
                    <ProductsGrid products={products} />
                )}
            </Center>
        </>
    )
}