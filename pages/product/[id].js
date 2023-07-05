import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import { useContext, useEffect , useState} from "react";
import { CartContext } from "@/components/CartContext";
import FlyingButton from "@/components/FlyingButton";
import WhatsappIcon from "@/components/WhatsappIcon";
import axios from "axios";
import Spinner from "@/components/Spinner";

const ColWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px){
        grid-template-columns: 1fr 1fr;
    }
    gap: 40px;
    margin: 40px 0;
`;

const PriceRow = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Price = styled.span`
    font-size: 1.4rem;
`;

export default function ProductPage({product}){
    const [category, setCategory] = useState([]);
    const [productProperty, setproductProperty] = useState(null);
    const [unitsSelected, setUnitsSelected] = useState(1);
    
    useEffect(() => {
        axios.get("/api/categories?id="+product.category)
            .then(result => {
                setCategory(result.data);
            })
    }, []);



    const optionProducts = [];
    const unitsOptionProduct = [];

    if(product.properties !== null && Object.keys(category).length > 0){
        const nameProperty = category?.properties[0].name;

        for(const property in product.properties[nameProperty]){
            optionProducts.push(property);
            unitsOptionProduct.push(product.properties[nameProperty][property])
        }
    } 

        console.log(optionProducts.indexOf(productProperty));

    return (
        <>
            <Header />
            <Center>
                <ColWrapper>
                    <WhiteBox>
                        <ProductImages images={product.images} />
                    </WhiteBox>
                    <div>
                        <Title>
                            {product.title}
                        </Title>
                        <p>{product.description}</p>

                        {Object.keys(category).length > 0 
                            ? (
                                <div>
                                    <p>{category?.properties[0].name}</p>
                                    
                                        {optionProducts.length > 0 && (
                                            <div>
                                            <select
                                                required
                                                defaultValue="default"
                                                onClick={(e) => setproductProperty(e.target.value)}>
                                                <option
                                                    disabled
                                                    value="default">
                                                    Selecciona
                                                </option>
                                                {optionProducts.map(optionSelect => (
                                                        <option
                                                            key={optionSelect}
                                                            value={optionSelect}>
                                                                {optionSelect}
                                                            </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                max={unitsOptionProduct[optionProducts.indexOf(productProperty)]}
                                                min={1}
                                                value={unitsSelected}
                                                onChange={(e) => setUnitsSelected(e.target.value)}/>
                                            </div>
                                        )}
                                </div>) 
                            : 
                                <Spinner fullWidth={false}/>
                        }

                        <PriceRow>
                            <div>
                                <Price>$ {product.price}</Price>
                            </div>
                            <div>
                                <FlyingButton main 
                                    _id={product._id} 
                                    src={product.images?.[0]} 
                                    property={productProperty} 
                                    units={unitsSelected}>
                                        <CartIcon />
                                        Agregar al carrito
                                </FlyingButton>
                            </div>
                        </PriceRow>
                    </div>   
                </ColWrapper>
                <WhatsappIcon />
            </Center>
        </>
    )
}

export async function getServerSideProps(context){
    await mongooseConnect();
    const id = context.query.id;
    const product = await Product.findById(id);
    return {
        props: {
            product: JSON.parse(JSON.stringify(product))
        }
    }
}