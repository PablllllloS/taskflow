//passo 1
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null)

//passo 2
export function AuthProvider({children}){
    const[logado, setLogado] = useState(false);
    function login(){setLogado(true);}
    function logout(){setLogado(false);}
    return(
        <AuthContext.Provider value={{logado, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

//passo 3
export function useAuth(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth deve ser usado dentro do AuthProvider');
    }
    return context;
}