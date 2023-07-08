import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import styled from "styled-components";
import Link from "next/link";
import { RevealWrapper } from "next-reveal";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import WhatsappIcon from "@/components/WhatsappIcon";

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
    margin-top: 10px;
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
    background-color: rgb(224, 122, 95, 0.3);
    height: 160px;
    border-radius: 10px;
    align-items: center;
    display: flex;
    justify-content: center;
    color: #555;
    text-decoration: none;
`;

export default function CategoriesPage({mainCategories, categoriesProducts, wishedProducts=[]}){

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
                            {categoriesProducts[categorie._id].map((product, index) => (
                                <RevealWrapper key={product._id} delay={index * 50}>
                                    <ProductBox {...product} wished={wishedProducts.includes(product._id)}/>
                                </RevealWrapper>
                            ))}
                            <RevealWrapper delay={categoriesProducts[categorie._id].length * 50}>
                                <ShowAllSquare href={"/category/"+categorie._id}>
                                    Ver todos &rarr;
                                </ShowAllSquare>
                            </RevealWrapper>
                        </CategoryGrid>
                    </CategoryWrapper>
                ))
                }
                <WhatsappIcon />
            </Center>
        </>
    )
}

export async function getServerSideProps (contex) {
    const categories = await Category.find();
    const mainCategories = categories.filter(cat => !cat.parent)
    const categoriesProducts = {}; 
    const allFetchedProductsId = [];
    for (const mainCat of mainCategories){
        const mainCatId = mainCat._id.toString();
        const childCatIds = categories
            .filter(cat => cat?.parent?.toString() === mainCatId)
            .map(cat => cat._id.toString());
        const categoriesId = [mainCatId, ...childCatIds];
        const products = await Product.find({category: categoriesId}, null, 
            {limit:3, sort:{"_id" : -1}});
        allFetchedProductsId.push(...products.map(p => p._id.toString()));
        categoriesProducts[mainCat._id] = products;
    }
    const session = await getServerSession(contex.req, contex.res, authOptions);
    const wishedProducts = session?.user
        ? await WishedProduct.find({
        userEmail: session.user.email, 
        product: allFetchedProductsId.map(product => product.toString())
            })
        : [];

    return {
        props: {
            mainCategories: JSON.parse
                (JSON.stringify(mainCategories)),
            categoriesProducts: JSON.parse(
                JSON.stringify(categoriesProducts)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        }
    }
}