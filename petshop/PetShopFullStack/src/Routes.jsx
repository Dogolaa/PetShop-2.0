import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Screens/Homer'
import Clientes from './Screens/clientes'
import Produtos from './Screens/Produtos'
import Servicos from './Screens/servicos'
import Vendas from './Screens/Vendas'
import Atendimentos from './Screens/Atendimentos'

const AppRoutes = () => {

    return(
        <>
            <Router>
                    <Routes>
                        <Route path='/' element = {<Home />}/>
                        <Route path='/Home' element = {<Home />}/>
                        <Route path='/Clientes' element = {<Clientes />}/>
                        <Route path='/Servicos' element = {<Servicos />}/>
                        <Route path='/produtos' element = {<Produtos />}/>
                        <Route path='/Vendas' element = {<Vendas />}/>
                        <Route path='/Atendimentos' element = {<Atendimentos />}/>
                    </Routes>
            </Router>
        </>
    )
}

export default AppRoutes;
