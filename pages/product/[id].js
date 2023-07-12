import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import CartIcon from "@/components/icons/CartIcon";
import {useEffect , useState} from "react";
import FlyingButton from "@/components/FlyingButton";
import WhatsappIcon from "@/components/WhatsappIcon";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Input from "@/components/Input";

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

const Stock = styled.span`
    font-size: 0.7rem;
    color: #444;
`;

const PropertiesTitle = styled.p`
    font-size: 0.95rem;
    margin: 5px;
`;

const Select = styled.select`
    width: 100%;
    padding: 5px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
`;

const SelectOptions = styled.div`
    display: flex;
    gap: 5px;
    margin-bottom: 10px;
`;

const Text = styled.p`
    font-weight: 600;
    font-size: 1.1rem;
`;

export default function ProductPage({product}){
    const [category, setCategory] = useState([]);
    const [productProperty, setproductProperty] = useState(null);
    const [unitsSelected, setUnitsSelected] = useState(null);
    
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
        product.nameProperty = nameProperty;

        for(const property in product.properties[nameProperty]){
            optionProducts.push(property);
            unitsOptionProduct.push(product.properties[nameProperty][property])
        }
    } 

    for(let i = 0; i < unitsOptionProduct.length; i++){
        if(unitsOptionProduct[i] === "0"){
            unitsOptionProduct.splice(i,1);
            optionProducts.splice(i,1);
            i--;
        }
    }

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
                                        {optionProducts.length > 0 && (
                                            <div>
                                                <PropertiesTitle>{category?.properties[0].name}:</PropertiesTitle>
                                                <SelectOptions>
                                                    <Select
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
                                                    </Select>
                                                    <Input
                                                        type="number"
                                                        max={unitsOptionProduct[optionProducts.indexOf(productProperty)]}
                                                        min={1}
                                                        value={unitsSelected}
                                                        onChange={(e) => setUnitsSelected(e.target.value)}/>
                                                    <Stock>(Stock: {unitsOptionProduct[optionProducts.indexOf(productProperty)]} unidades)</Stock>
                                                </SelectOptions>
                                            </div>
                                        )}
                                        {optionProducts.length === 0 && (
                                            <Text>Sin Stock</Text>
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
                                {optionProducts.length > 0 && (
                                    <FlyingButton main 
                                        productId={product._id} 
                                        src={product.images?.[0]} 
                                        property={productProperty} 
                                        units={unitsSelected}
                                        image={product.images[0]}
                                        title={product.title}
                                        price={product.price}
                                        nameProperty={product.nameProperty}>
                                            <CartIcon />
                                            Agregar al carrito
                                    </FlyingButton>
                                )} 
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