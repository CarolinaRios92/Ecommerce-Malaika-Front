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

const CategoryTitle = styled.div`
    display: flex;
    margin-top: 40px;
    margin-bottom: 0px;
    align-items: center;
    gap: 15px;
    h2{
        margin-bottom: 10px;
        margin-top: 10px;
    }
    a {
        color: #555;
    }
`;

const CategoryWrapper = styled.div`
    margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
    background-color: #ddd;
    height: 160px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: #555;
    text-decoration: none;
`;

export default function CategoriesPage({mainCategories, categoriesProducts}){

    return (
        <>
            <Header />
            <Center>
                {mainCategories?.map(categorie => (
                    <CategoryWrapper key={categorie._id}>
                        <CategoryTitle>
                            <h2>{categorie.name}</h2>
                            <Link href={"/category/"+categorie._id}>
                                Ver Todos
                            </Link>
                        </CategoryTitle>
                        
                        <CategoryGrid>
                            {categoriesProducts[categorie._id].map((product) => (
                                <ProductBox  key={product._id} {...product}/>
                            ))}
                            <ShowAllSquare href={"/category/"+categorie._id}>
                                Ver todos &rarr;
                            </ShowAllSquare>
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
            {limit:3, sort:{"_id" : -1}});
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