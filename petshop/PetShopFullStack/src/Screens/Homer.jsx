import React, { useEffect, useState } from "react";
import Header from "../Components/header";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import Api from "../Api.jsx";

import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const Home = () => {
  const [faturamentos, setFaturamentos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await Api.get("/infohome");
      setFaturamentos(response.data);
    }

    getData();
  }, []);

  const data = {
    labels: ['Produtos', 'Serviços'],
    datasets: [
      {
        data: [faturamentos.valorProdutos, faturamentos.valorServicos],
        backgroundColor: [
          '#FF6384',
          '#36A2EB'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB'
        ],
      },
    ],
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="row w-100">
        <div className="col-lg-6 d-flex justify-content-center">
          <div style={{ width: "70%" }}>
            <div className="card h-100">
              <div className="card-body" style={{ position: 'relative' }}>
                <h5 className="card-title">Faturamento</h5>
                <Doughnut data={data} />
                <div
                  style={{
                    position: 'absolute',
                    top: '54%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    width: '100%',
                    fontSize: 30
                  }}
                >
                  {faturamentos.valorProdutos + faturamentos.valorServicos}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-flex justify-content-center">
          <div style={{ width: "70%" }}>
            <div className="card h-100">
              <div className="card-body" style={{ position: 'absolute', top: '30%' }}>
                <h3>Atalhos</h3>
                <div className="d-flex flex-column align-items-center">
                  <Link to="/vendas">
                    <button className="btn btn-primary btn-lg mb-2"> Nova Venda</button>
                  </Link>
                  <div className="d-flex"> {/* Abertura da div aqui */}
                    <Link to="/produtos">
                      <button className="btn btn-secondary btn-sm mr-2 me-2"> Novo Produto</button>
                    </Link>
                    <Link to="/servicos">
                      <button className="btn btn-secondary btn-sm mr-2 me-2"> Novo Serviço</button>
                    </Link>
                    <Link to="/clientes">
                      <button className="btn btn-secondary btn-sm mr-2 me-2"> Novo Cliente</button>
                    </Link>
                  </div> {/* Fechamento da div aqui */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Header />
    </div>
  );
};

export default Home;
