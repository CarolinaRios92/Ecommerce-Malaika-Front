import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Title from "@/components/Title";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function ProductsPage({products, wishedProducts}) {
    return (
        <>
            <Header />
            <Center>
                <Title>Todos los Productos</Title>
                <ProductsGrid products={products} wishedProducts={wishedProducts}/>
            </Center>
        </>
    )
};

export async function getServerSideProps(contex){
    await mongooseConnect();
    const products = await Product.find({}, null, {sort: {"_id": -1}});
    const {user} = await getServerSession(contex.req, contex.res, authOptions);
    const wishedProducts = await WishedProduct.find({
    userEmail: user.email, 
    product: products.map(product => product._id.toString())
  });
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
            wishedProducts: wishedProducts.map(i => i.product.toString()),
        }
    }
}