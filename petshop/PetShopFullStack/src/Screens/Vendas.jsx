import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Table,
  ModalBody,
  FormGroup,
} from "react-bootstrap";
import Api from "../Api.jsx";
import { BsTrash } from "react-icons/bs";
import Header from "../Components/header.jsx";
import Select from "react-select";

const Vendas = () => {
  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [vendas, setVendas] = useState([]);

  const [datasVendas, setDatasVendas] = useState([]);

  const [newClientesName, setNewClienteName] = useState("");
  const [newClientesEmail, setNewClienteEmail] = useState("");
  const [Editdata, setEditData] = useState([]);

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);

  const [clienteSelecionado, setClienteSelecionado] = useState();
  const [produtosSelecionados, setProdutosSelecionados] = useState();
  const [servicosSelecionados, setServicosSelecionados] = useState();

  useEffect(() => {
    const getData = async () => {
      const responseVendas = await Api.get("/buscarVendas");
      setVendas(responseVendas.data);

      const responseClientes = await Api.get("/buscarClientes");

      const clientesFormatados = responseClientes.data.map((cliente) => ({
        value: cliente.id,
        label: cliente.nome,
      })); 
      setClientes(clientesFormatados);

      const datas = responseVendas.data.map((venda) => venda.data);
      setDatasVendas(datas);

      const responseProdutos = await Api.get("/buscarProdutos");

      const produtosFormatados = responseProdutos.data.map((produto) => ({
        value: produto.id,
        label: produto.nome,
        preco: produto.preco,
      }));
      setProdutos(produtosFormatados);

      const responseServicos = await Api.get("/buscarServicos");

      const servicosFormatados = responseServicos.data.map((servico) => ({
        value: servico.id,
        label: servico.nome,
        preco: servico.preco,
      }));
      setServicos(servicosFormatados);
    };

    getData();
  }, []);

  const handleModal = () => {
    setShowModal(true);
  };

  const formatarData = (data) => {
    try {
      const dataFormatada = new Date(data).toLocaleDateString("pt-BR"); // or use another desired format
      return dataFormatada !== "Invalid Date" ? dataFormatada : data;
    } catch (error) {
      console.error("Erro ao formatar a data:", error);
      return data;
    }
  };

  const handleModalEdit = () => {
    setShowModalEdit(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setNewClienteName("");
    setNewClienteEmail("");
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteVenda = async (id) => {
    try {
      const response = await Api.delete(`DeletarVenda/${id}`);

      if (response.status === 200) {
        const updatedVendas = vendas.filter((venda) => venda.id !== id);
        setVendas(updatedVendas);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClient = async (id) => {
    handleModalEdit();
    console.log("Editando venda: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const IDsProdutos = produtosSelecionados
      ? produtosSelecionados.map((item) => item.value)
      : [];
    const IDsServicos = servicosSelecionados
      ? servicosSelecionados.map((item) => item.value)
      : [];

    if (
      clienteSelecionado == null ||
      clienteSelecionado == undefined ||
      clienteSelecionado == ""
    ) {
      alert("Cliente não pode ser nulo!");
      return;
    }

    const newVenda = {
      cliente: clienteSelecionado.value,
      produtos: IDsProdutos,
      servicos: IDsServicos,
    };

    const response = await Api.post("/NovaVenda", JSON.stringify(newVenda), {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      window.location.reload();
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      newClientesName == null ||
      newClientesName == undefined ||
      newClientesName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    const EditedVenda = {};
    EditedVenda.id = Editdata.id;

    EditedVenda.nome = newClientesName;

    EditedVenda.email = newClientesEmail;

    const response = await Api.put(
      "/EditarVenda",
      JSON.stringify(EditedVenda),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setVendas((venda) => {
      return vendas.map((venda) => {
        if (venda.id === Editdata.id) {
          return {
            ...venda,
            nome: newClientesName,
            email: newClientesEmail,
          };
        }
        return venda;
      });
    });

    handleCloseEdit();

    setNewClienteName("");
    setNewClienteEmail("");
  };

  const calculaPreco = (listaProdutos, listaServicos) => {
    const idsSelecionados = listaProdutos
      .split(",")
      .map((id) => parseInt(id.trim()));

    let total = 0;

    idsSelecionados.forEach((id) => {
      const produto = produtos.find((produto) => produto.value == id);

      if (produto) {
        total += Number(produto.preco);
      } else {
        console.warn(`Produto com id ${id} não encontrado`);
      }
    });

    const idsSelecionadosServicos = listaServicos
      .split(",")
      .map((id) => parseInt(id.trim()));

    idsSelecionadosServicos.forEach((id) => {
      const servico = servicos.find((servico) => servico.value == id);

      if (servico) {
        total += Number(servico.preco);
      } else {
        console.warn(`Servico com id ${id} não encontrado`);
      }
    });

    return total;
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1 style={{ marginTop: "2em", color: "#2d2d2d" }}>Lista de Vendas</h1>
      <Button
        className="nova-venda-btn"
        variant="primary"
        onClick={handleModal}
        style={{ marginTop: "16px", marginBottom: "40px " }}
      >
        Cadastrar novo venda
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de nova Venda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Selecione o cliente</Form.Label>
              <Select
                options={clientes}
                onChange={(selected) => setClienteSelecionado(selected)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicName">
              <Form.Label>Selecione os produtos</Form.Label>
              <Select
                options={produtos}
                onChange={(selected) => setProdutosSelecionados(selected)}
                isMulti
              />
            </Form.Group>

            <Form.Group controlId="formBasicName">
              <Form.Label>Selecione os servicos</Form.Label>
              <Select
                options={servicos}
                onChange={(selected) => setServicosSelecionados(selected)}
                isMulti
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="nova-venda-btn"
              style={{
                marginTop: "24px",
                width: "120px",
                paddingTop: "6px",
                zIndex: "0",
              }}
            >
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModalEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edicao de Venda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewClienteName(e.target.value)}
                defaultValue={Editdata.nome}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPreco">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewClienteEmail(e.target.value)}
                defaultValue={Editdata.email}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="nova-venda-btn">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Data</th>
            <th>Produtos</th>
            <th>Servicos</th>
            <th>Preco</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda, index) => (
            <tr key={venda.id}>
              <td>{venda.id}</td>
              <td>
                {
                  clientes.find(
                    (clientes) => clientes.value === venda.id_cliente
                  )?.label
                }
              </td>
              <td>{formatarData(datasVendas[index])}</td>
              <td>
                {venda.id_produto
                  .split(",")
                  .map(
                    (id) =>
                      produtos.find((produto) => produto.value == id)?.label
                  )
                  .join(",")}
              </td>
              <td>
                {venda.id_servico
                  .split(",")
                  .map(
                    (id) =>
                      servicos.find((servico) => servico.value == id)?.label
                  )
                  .join(",")}
              </td>
              <td>{calculaPreco(venda.id_produto, venda.id_servico)}</td>
              <td>
                <Button
                  onClick={() => {
                    handleDeleteVenda(venda.id);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <BsTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Vendas;
