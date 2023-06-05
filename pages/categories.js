import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import styled from "styled-components";
import Link from "next/link";

const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;

const CategoryTitle = styled.h2`
    margin-top: 40px;
    margin-bottom: 10px;
`;

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`;

export default function CategoriesPage({mainCategories, categoriesProducts}){

    return (
        <>
            <Header />
            <Center>
                {mainCategories?.map(categorie => (
                    <CategoryWrapper key={categorie._id}>
                        <CategoryTitle>{categorie.name}</CategoryTitle>
                        <Link href={"/category/"+categorie._id}>Ver Todos</Link>
                        <CategoryGrid>
                            {categoriesProducts[categorie._id].map((product) => (
                                <ProductBox  key={product._id} {...product}/>
                            ))}
                        </CategoryGrid>
                    </CategoryWrapper>
                ))
                }
            </Center>
        </>
    )
}

export async function getServerSideProps () {
    const categories = await Category.find();
    const mainCategories = categories.filter(cat => !cat.parent)
    const categoriesProducts = {}; 
    for (const mainCat of mainCategories){
        const mainCatId = mainCat._id.toString();
        const childCatIds = categories
            .filter(cat => cat?.parent?.toString() === mainCatId)
            .map(cat => cat._id.toString());
        const categoriesId = [mainCatId, ...childCatIds];
        const products = await Product.find({category: categoriesId}, null, 
            {limit:4, sort:{"_id" : -1}});
        categoriesProducts[mainCat._id] = products;
    }
    return {
        props: {
            mainCategories: JSON.parse
                (JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(
                JSON.stringify(categoriesProducts)),
        }
    }
}