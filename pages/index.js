import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function HomePage({featuredProduct, newProducts, wishedNewProducts}){
  return (
      <div>
        <Header />
        <Featured product={featuredProduct}/>
        <NewProducts products={newProducts} wishedProducts={wishedNewProducts}/>
      </div>
  )
}

export async function getServerSideProps(contex){
  const featuredProductId = "646cd447c141d6f9749989b2";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({},null, {sort: {"_id": -1}, limit: 10});
  const {user} = await getServerSession(contex.req, contex.res, authOptions);
  const wishedNewProducts = await WishedProduct.find({
    userEmail: user.email, 
    products: newProducts.map(product => product._id).toString()
  });
  return {
    props: {featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
    newProducts: JSON.parse(JSON.stringify(newProducts)),
    wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
  }
  }
}