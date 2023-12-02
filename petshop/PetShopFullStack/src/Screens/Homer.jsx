import React, { useEffect, useState } from "react";
import Header from "../Components/header";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import Api from "../Api.jsx";

import { Chart, ArcElement } from "chart.js";
Chart.register(ArcElement);

const Home = () => {
  const [faturamentos, setFaturamentos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await Api.get("/infohome");
      setFaturamentos(response.data);
    };

    getData();
  }, []);

  const data = {
    labels: ["Produtos", "Serviços"],
    datasets: [
      {
        data: [faturamentos.valorProdutos, faturamentos.valorServicos],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "calc(100vh - 120px)", marginTop: "56px" }}
    >
      <div className="row w-100">
        <div className="col-lg-6 d-flex justify-content-center">
          <div style={{ width: "70%" }}>
            <div className="card h-100 card-home">
              <div className="card-body" style={{ position: "relative" }}>
                <h5 className="card-title">Faturamento</h5>
                <Doughnut data={data} />
                <div
                  className="valor"
                  style={{
                    position: "absolute",
                    top: "54%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    width: "100%",
                    fontSize: 30,
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
            <div className="card h-100 card-home">
              <div className="card-body">
                <h3 className="card-title">Atalhos</h3>
                <div
                  className="d-flex flex-column align-items-center atalhos-card"
                  style={{
                    position: "absolute",
                    top: "54%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    fontSize: 30,
                  }}
                >
                  <Link to="/vendas">
                    <button className="nova-venda-btn"> Nova Venda</button>
                  </Link>
                  <div className="d-flex actions-buttons">
                    {" "}
                    {/* Abertura da div aqui */}
                    <Link to="/produtos">
                      <button className="nova-venda-btn other-btn">
                        {" "}
                        Novo Produto
                      </button>
                    </Link>
                    <Link to="/atendimentos">
                      <button className="nova-venda-btn other-btn">
                        {" "}
                        Novo Atendimento
                      </button>
                    </Link>
                    <Link to="/servicos">
                      <button className="nova-venda-btn other-btn">
                        {" "}
                        Novo Serviço
                      </button>
                    </Link>
                    <Link to="/clientes">
                      <button className="nova-venda-btn other-btn">
                        {" "}
                        Novo Cliente
                      </button>
                    </Link>
                  </div>{" "}
                  {/* Fechamento da div aqui */}
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
