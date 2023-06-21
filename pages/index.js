import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
import styled from "styled-components";

const WhatsappIcon = styled.button`
  height: 60px;
  width: 60px;
  border: none;
  border-radius: 50%;
  cursor:pointer;
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  background: transparent;
  img{
    height: 100%;
  }
`
export default function HomePage({featuredProduct, newProducts, wishedNewProducts}){

  function whatsapp(){
    window.location.href = `https://wa.me/541140944120`;
  }

  return (
      <div>
        <Header />
        <Featured product={featuredProduct}/>
        <NewProducts products={newProducts} wishedProducts={wishedNewProducts}/>
        <WhatsappIcon
          onClick={whatsapp}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png"/>
        </WhatsappIcon>         
      </div>
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