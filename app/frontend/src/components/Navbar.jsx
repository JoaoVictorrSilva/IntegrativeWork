import {Link} from "react-router-dom";

function Navbar() {
  return (
    <div>
      <ul>
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/cadastro/livro">CADASTRO LIVRO</Link></li>
        <li><Link to="/cadastro/aluno">CADASTRO ALUNO</Link></li>
      </ul>
    </div>
  );
}

export default Navbar;