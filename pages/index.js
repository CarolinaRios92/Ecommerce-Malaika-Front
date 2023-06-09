import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import WhatsappIcon from "@/components/WhatsappIcon";
import styled from "styled-components";

const General = styled.div`
  margin-bottom: 100px;
`;

export default function HomePage({featuredProduct, newProducts, wishedNewProducts}){
  return (
      <General>
        <Header />
        <Featured product={featuredProduct}/>
        <NewProducts products={newProducts} wishedProducts={wishedNewProducts}/>
        <WhatsappIcon />        
      </General>
  )
}

export async function getServerSideProps(contex){
  await mongooseConnect();
  const featuredProductSetting = await Setting.findOne({name: "featuredProductId"})
  const featuredProductId = featuredProductSetting.value;
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({},null, {sort: {"_id": -1}, limit: 10});
  const session = await getServerSession(contex.req, contex.res, authOptions);
  const wishedNewProducts = session?.user 
    ? await WishedProduct.find({
    userEmail: session.user.email, 
    product: newProducts.map(product => product._id.toString())
  }) 
    : [];
  return {
    props: {
    featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
    newProducts: JSON.parse(JSON.stringify(newProducts)),
    wishedNewProducts: wishedNewProducts.map(i => i.product.toString()),
  }
  }
}