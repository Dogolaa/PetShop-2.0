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
import { AiOutlineEdit } from "react-icons/ai";

const Clientes = () => {
  useEffect(() => {
    const getClientes = async () => {
      const responseClientes = await Api.get("/buscarClientes");
      setClientes(responseClientes.data);
    };
    getClientes();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [clientes, setClientes] = useState([]);

  const [newClientesName, setNewClienteName] = useState("");
  const [newClientesEmail, setNewClienteEmail] = useState("");
  const [Editdata, setEditData] = useState([]);

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
    };

   const response = await Api.post("/NovoCliente", JSON.stringify(newCliente), {
      headers: { "Content-Type": "application/json" },
    });

    console.log(response.data.insertId)
    
    setClientes([...clientes, {id: response.data.insertId ,nome : newClientesName,email: newClientesEmail }]);

    handleClose();

    setNewClienteEmail("");
    setNewClienteName("");
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

          };
        }
        return cliente;
      });
    });

    handleCloseEdit();

    setNewClienteName("");
    setNewClienteEmail("");
  };








  return (
    <Container style ={{marginTop: 20}}>
      <Header />
      <h1>Lista de Clientes</h1>

      <Button variant="primary" onClick={handleModal}>
        Cadastrar novo cliente
      </Button>
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
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.nome}</td>
              <td>{client.email}</td>
              <td>
                <Button
                  onClick={() => {
                    handleDeleteClient(client.id);
                  }}style={{marginRight: 10}}
                >
                  <BsTrash />
                </Button>
                <Button
                  onClick={() => {
                    setEditData(client),
                      handleEditClient(client.id),
                      setNewClienteName(client.nome),
                      setNewClienteEmail(client.email);
                      
                  }}
                >
                  <AiOutlineEdit />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Clientes;
