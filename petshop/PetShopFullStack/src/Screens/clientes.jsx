import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  Form,
  Table,
  ModalBody,
  FormGroup,
  Col,
} from "react-bootstrap";
import Api from "../Api.jsx";
import { BsTrash } from "react-icons/bs";
import Header from "../Components/header.jsx";
import { AiOutlineEdit } from "react-icons/ai";

const Clientes = () => {
  const [criterio, setCriterio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const rotularClientesPremium = async () => {
    try {
      // Fazer uma chamada à API para rotular clientes premium
      const response = await Api.post("/RotularClientesPremium");
      console.log("Clientes rotulados como Premium:", response.data);
    } catch (error) {
      console.error("Erro ao rotular clientes premium:", error);
    }
  };

  useEffect(() => {
    const getClientes = async () => {
      const responseClientes = await Api.get(
        `/BuscarClientes?criterio=${criterio}&termo=${searchTerm}`
      );
      setClientes(responseClientes.data);
      setAllClientes(responseClientes.data);
    };
    getClientes();
    // Chamar a função RotularClientesPremium após obter a lista de clientes
    rotularClientesPremium();
  }, [criterio, searchTerm]);




  const [allClientes, setAllClientes] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [clientes, setClientes] = useState([]);

  const [newClientesName, setNewClienteName] = useState("");
  const [newClientesEmail, setNewClienteEmail] = useState("");
  const [newClientesTelefone, setNewClienteTelefone] = useState("");
  const [newClientesEndereco, setNewClienteEndereco] = useState("");

  const [newClientesTipo, setNewClienteTipo] = useState("");

  const [Editdata, setEditData] = useState([]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredClientes = allClientes.filter((cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm)
    );
    setClientes(filteredClientes);
  };

  const handleSort = async (e) => {
    const selectedCriterio = e.target.value;
    setCriterio(selectedCriterio);

    try {
      const responseClientes = await Api.get(
        `/BuscarClientes?criterio=${selectedCriterio}`
      );
      setClientes(responseClientes.data);
      setAllClientes(responseClientes.data);
    } catch (error) {
      console.error("Error sorting products:", error);
    }
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleModalEdit = () => {
    setShowModalEdit(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setNewClienteName("");
    setNewClienteEmail("");
    setNewClienteTelefone("");
    setNewClienteEndereco("");
    setNewClienteTipo("");
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteClient = async (id) => {
    console.log("Deletando cliente com o id: ", id);

    try {
      const response = await Api.delete(`DeletarCliente/${id}`);

      if (response.status === 200) {
        setClientes((prevClientes) =>
          prevClientes.filter((cliente) => cliente.id !== id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditClient = async (id) => {
    handleModalEdit();
    console.log("Editando cliente: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      newClientesName == null ||
      newClientesName == undefined ||
      newClientesName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    const newCliente = {
      nome: newClientesName,
      email: newClientesEmail,
      telefone: newClientesTelefone,
      endereco: newClientesEndereco,
      tipo: newClientesTipo,
    };

    const response = await Api.post(
      "/NovoCliente",
      JSON.stringify(newCliente),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(response.data.insertId);

    setClientes([
      ...clientes,
      {
        id: response.data.insertId,
        nome: newClientesName,
        email: newClientesEmail,
        telefone: newClientesTelefone,
        endereco: newClientesEndereco,
        tipo: newClientesTipo,
      },
    ]);

    handleClose();

    setNewClienteEmail("");
    setNewClienteName("");
    setNewClienteTelefone("");
    setNewClienteEndereco("");
    setNewClienteTipo("");
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

    const EditedClient = {};
    EditedClient.id = Editdata.id;

    EditedClient.nome = newClientesName;

    EditedClient.email = newClientesEmail;

    EditedClient.telefone = newClientesTelefone;

    EditedClient.endereco = newClientesEndereco;

    const response = await Api.put(
      "/EditarCliente",
      JSON.stringify(EditedClient),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setClientes((cliente) => {
      return clientes.map((cliente) => {
        if (cliente.id === Editdata.id) {
          return {
            ...cliente,
            nome: newClientesName,
            email: newClientesEmail,
            telefone: newClientesTelefone,
            endereco: newClientesEndereco,
            tipo: newClientesTipo,
          };
        }
        return cliente;
      });
    });

    handleCloseEdit();

    setNewClienteName("");
    setNewClienteEmail("");
    setNewClienteEndereco("");
    setNewClienteTelefone("");
    setNewClienteTipo("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1>Lista de Clientes</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="primary"
          onClick={handleModal}
          style={{ marginRight: "10px" }}
        >
          Cadastrar Novo Produto
        </Button>
        <Form>
          <Form.Group controlId="formBasicSort" style={{ marginRight: 10 }} >
            <Form.Control as="select" value={criterio} onChange={handleSort}>
              <option value="">Sem Ordenação</option>
              <option value="nome">Nome</option>
              <option value="telefone">Telefone</option>
              <option value="endereco">Endereco</option>
              {/* Adicione mais opções conforme necessário */}
            </Form.Control>
          </Form.Group>
        </Form>
        <Form>
          <Form.Group controlId="formBasicSearch">
            <Form.Control
              type="text"
              placeholder="Pesquisar por nome"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e);
              }}
            />
          </Form.Group>
        </Form>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de novo Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Nome do Cliente"
                onChange={(e) => setNewClienteName(e.target.value)}
              />
            </Form.Group>

            <FormGroup controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite o email do Cliente"
                onChange={(e) => setNewClienteEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Digite o telefone do Cliente"
                onChange={(e) => setNewClienteTelefone(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicAddress">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do Cliente"
                onChange={(e) => setNewClienteEndereco(e.target.value)}
              />
            </FormGroup>

            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showModalEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edicao de Cliente</Modal.Title>
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

            <FormGroup controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Digite o telefone do Cliente"
                onChange={(e) => setNewClienteTelefone(e.target.value)}
                defaultValue={Editdata.telefone}
              />
            </FormGroup>

            <FormGroup controlId="formBasicAddress">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do Cliente"
                onChange={(e) => setNewClienteEndereco(e.target.value)}
                defaultValue={Editdata.endereco}
              />
            </FormGroup>

            <Button variant="primary" type="submit">
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
            <th>Email</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Tipo</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nome}</td>
              <td>{client.email}</td>
              <td>{client.telefone}</td>
              <td>{client.endereco}</td>
              <td>{client.tipo}</td>

              <td>
                <Button
                  onClick={() => {
                    handleDeleteClient(client.id);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <BsTrash />
                </Button>
                <Button
                  onClick={() => {
                    setEditData(client);
                    handleEditClient(client.id);
                    setNewClienteName(client.nome);
                    setNewClienteEmail(client.email);
                    setNewClienteTelefone(client.telefone);
                    setNewClienteEndereco(client.endereco);
                    setNewClienteTipo(client.tipo);
                  }}
                >
                  <AiOutlineEdit />
                </Button>
              </td>
            </tr>
          ))}
          {clientes.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Clientes;
