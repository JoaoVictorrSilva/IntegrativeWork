import imagem from "../components/Imagens/logo6.png";
import React from 'react';
import './StyleHeader.css';

function Header(){
    return(
            <header className='geral'>
                <img className='logo' src={imagem}/>
                <h1 className='T1'>Sistema de Biblioteca</h1>
                <h3 className='T2'>Escola de Ensino Básico Druziana Sartori</h3>
            </header>   
    )
}

export default Header;