import styled from "styled-components";
import Center from "./Center";
import ButtonLink from "./ButtonLink";
import { RevealWrapper } from "next-reveal";
import { secondary } from "@/lib/colors";

const Bg = styled.div`
  background-color: ${secondary};
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
    margin:0;
    font-weight:normal;
    font-size: 1.2rem;
    padding-top: 10px;
    @media screen and (min-width: 768px) {
        font-size: 3rem;
        padding-top: 0px;
    }
`;

const Desc = styled.p`
    color: #aaa;
    font-size:.9rem;
`;

const ColumnsWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    padding: 0px 60px;
    gap: 5px;
    img.main {
        max-width: 100%;
        max-height: 280px;
        display:block;
        margin: 0 auto;
    }
    div:nth-child(1){
        order: 2;
        margin-left:auto;
        margin-right: auto;
    }
    @media screen and (min-width: 768px){
        grid-template-columns: 1.1fr 0.9fr;
        & > div:nth-child(1){
        order: 0;
        }
        img {
            max-width: 100%;
        }
    }
`;

const Column = styled.div`
    display:flex;
    align-items:center;
`

const ButtonsWrapper = styled.div`
    display:flex;
    gap: 10px;
    margin-top: 25px;
`;

const CenterImage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const ImgColumn = styled(Column)`
    & > div{
        width: 100%;
    }
`;

export default function Featured({product}){
    return (
        <Bg>
            <Center>
                <ColumnsWrapper>
                    <Column>
                        <div>
                            <RevealWrapper origin={"left"}>
                                <div>
                                    <Title>{product.title}</Title>
                                    <Desc>{product.description}</Desc>
                                    <ButtonsWrapper>
                                        <ButtonLink 
                                            href={"/product/"+product._id} 
                                            white={1}>
                                            Mas información
                                        </ButtonLink>
                                    </ButtonsWrapper>
                                </div>
                            </RevealWrapper>
                        </div>
                    </Column>
                    <ImgColumn>
                        <RevealWrapper>
                            <CenterImage>
                                <img className="main" src={product.images?.[0]} alt="imagen del producto" />
                            </CenterImage>
                        </RevealWrapper>
                    </ImgColumn>
                </ColumnsWrapper>
            </Center>
        </Bg>
    )
}