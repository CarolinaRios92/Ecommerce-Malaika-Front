import Link from "next/link";

export default function Header(){
    return(
        <header>
            <Link href={"/"}>
                Malaika
            </Link>
            <nav>
                <Link href={"/"}>Home</Link>
                <Link href={"/products"}>Productos</Link>
                <Link href={"/categories"}>Categorias</Link>
                <Link href={"/account"}>Tu Cuenta</Link>
                <Link href={"/cart"}>Carrito</Link>
            </nav>
        </header>
    )
}