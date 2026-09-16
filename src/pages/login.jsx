//teste
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../componentes/sidebar";
import api from "../services/api";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [shake, setShake] = useState (false);
  const {login} = useAuth();
  const navigate = useNavigate();

  async function handleLogin() {
    setErro("");
    try{
      const response = await api.post("/login", { email, senha});
      const {token, usuario} = response.data;
      login(usuario, token);
      navigate("/");
    } catch (error){
      setErro(error.response?.data?.erro ||"Usuário ou senha incorretos");
      setShake(true);
      setTimeout(()=> setShake(false), 500);
    }
    if (email && senha === "1234") {
      login(); 
      navigate("/"); 
      return;
    }
  }

  return (
    
    <div className="login-container">
      <Sidebar/>
      <div className= {`login-card ${shake ? 'shake':''}`}>
        <h1 className="login-logo">TaskFlow</h1>
        <p className="login-subtitulo">Faça login para continuar</p>


        <input
          className="login-input"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          className="login-input"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />


        {erro && <p className="login-erro">{erro}</p>}

        <button className="login-btn" onClick={handleLogin}>
          Entrar
        </button>

        <p className="login-aviso">
          Este login é apenas para fins didáticos. Credenciais reais vêm no
          módulo back-end.
        </p>
      </div>
    </div>
  );
}

export default Login;