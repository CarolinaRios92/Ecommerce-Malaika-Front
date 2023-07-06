import styled from "styled-components";

const StyledOrder = styled.div`
    margin: 10px 0;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
    display: flex;
    gap: 20px;
    time{
        font-size: .9rem;
        font-weight: 500;
    }
`;

const Quantity = styled.span`
    color: #aaa;
    font-size: 0.9rem;
    flex-basis: 10%
`;

const Data = styled.div`
    font-size: .8rem;
    line-height: 1rem;
    margin-top: 5px;
    color: #888;
`;

const OrderData = styled.div`
    display: flex;
`;

const Price = styled.span`
    flex-basis: 25%;
    font-size: 0.9rem;
`;

const Description = styled.p`
    flex-basis: 65%;
    font-size: 0.9rem;
`;

export default function SingleOrder({line_items,createdAt,...rest}){
    return (
        <StyledOrder>
            <div>
                <time>{(new Date(createdAt).toLocaleString())}</time>
                <Data>
                    {rest.name} <br />
                    {rest.email} <br />
                    {rest.phone} <br />
                </Data>
            </div>
            <div>
                {line_items.map(product => (
                    <OrderData key={product.title}>
                        <Quantity>{product.quantity} x </Quantity>
                        <Description>{product.title}</Description>
                        <Price>$ {product.unit_price * product.quantity}</Price>
                    </OrderData>
            ))}
            </div>
        </StyledOrder>
    );
}