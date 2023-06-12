import Center from "@/components/Center";
import Header from "@/components/Header";
import styled from "styled-components";
import Input from "@/components/Input";
import { useState, useEffect } from "react";
import axios from "axios";

const SearchInput = styled(Input)`
    padding: 5px 10px;
    border-radius: 5px;
    margin: 30px 0 30px;
    font-size: 1.3rem;
`;

export default function SearchPage(){
    const [phrase, setPhrase] = useState("");

    useEffect(() => {
        if(phrase.length > 0){
            axios.get("/api/products?phrase="+encodeURIComponent(phrase))
                .then(response => {
                    console.log(response.data)
                })
        }
    }, [phrase]);

    return (
        <>
            <Header />
            <Center>
                <SearchInput 
                    value={phrase}
                    onChange={e => setPhrase(e.target.value)}
                    autoFocus
                    placeholder="Buscar..."/>
            </Center>
        </>
    )
}