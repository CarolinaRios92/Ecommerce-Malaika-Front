import { styled } from "styled-components";
import Center from "./Center";
import Button from "./Button";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
    margin:0;
    font-weight:normal;
`;

const Desc = styled.p`
    color: #aaa;
    font-size:.8rem;
`;

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: .8fr 1.2fr;
    gap: 40px;
    img {
        max-width: 100%;
        max-height: 280px;
        margin: auto
    }
`;

const Column = styled.div`
    display:flex;
    align-items:center;
`

export default function Featured(){
    return (
        <Bg>
            <Center>
                <Wrapper>
                    <Column>
                        <div>
                            <Title>Pro anywhere</Title>
                            <Desc>Pellentesque odio libero, posuere ut auctor ut, lacinia ac odio. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean tincidunt justo lectus, et hendrerit lorem aliquam eget. Cras ac vestibulum ipsum. Nullam suscipit dictum purus. Pellentesque sed purus vitae lectus ultricies malesuada.</Desc>
                            <Button>Mas información</Button>
                            <Button size="l">Agregar al carrito</Button>
                        </div>
                    </Column>
                    <Column>
                        <img src="https://ecommerce-woman.s3.us-east-2.amazonaws.com/1684853825438.jpg" alt="imagen del producto" />
                    </Column>
                </Wrapper>
                
            </Center>
        </Bg>
    )
}