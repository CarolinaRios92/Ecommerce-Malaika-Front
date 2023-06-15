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
`;

const Data = styled.div`
    font-size: .8rem;
    line-height: 1rem;
    margin-top: 5px;
    color: #888;
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
                    <div key={product.title}>
                        <Quantity>{product.quantity} x </Quantity>
                        <span>{product.title}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>$ {product.unit_price * product.quantity}</span>
                    </div>
            ))}
            </div>
        </StyledOrder>
    );
}