import styled from "styled-components";

const ButtonWhatsappIcon = styled.button`
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

export default function WhatsappIcon(){
    
  function whatsapp(){
    window.location.href = `https://wa.me/541140944120`;
  }

    return (
        <ButtonWhatsappIcon
          onClick={whatsapp}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/479px-WhatsApp_icon.png"/>
        </ButtonWhatsappIcon> 
    )
}