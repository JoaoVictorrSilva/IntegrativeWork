import React from 'react';

function barra_lateral() {
    return (
        <form>
            <section>
                <div className="btn-group-vertical btn-group-sm text-align" style={{ border: '50px', margin: '50px', height: '50px', width: '350px' }}>
                    <div className="row text-center">
                        <a className="btn botao1" href="Index.html" role="button">Inicio</a>
                        <a className="btn botao1" href="Cadastro.html" role="button">Cadastro de Livros</a>
                        <a className="btn botao1" href="AlterarDados.html" role="button">Alterar Dados</a>
                        <a className="btn botao1" href="BuscaLivro.html" role="button">Busca de Livro</a>
                        <a className="btn botao1" href="Emprestimo.html" role="button">Emprestimo</a>
                        <a className="btn botao1" href="Devolucao.html" role="button">Devolução</a>
                    </div>
                </div>
            </section>
        </form>
    );
}

export default barra_lateral;
