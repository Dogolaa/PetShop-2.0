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

const Servicos = () => {
  useEffect(() => {
    const getServicos = async () => {
      const responseServicos = await Api.get("/buscarServicos");
      setServicos(responseServicos.data);
    };
    getServicos();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);

  const [servicos, setServicos] = useState([]);

  const [NewServiceName, setNewServiceName] = useState("");
  const [NewServicePreco, setNewServicePreco] = useState("");
  const [Editdata, setEditData] = useState([]);

  const handleModal = () => {
    setShowModal(true);
  };

  const handleModalEdit = () => {
    setShowModalEdit(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setNewServiceName("");
    setNewServicePreco("");
    
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteService = async (id) => {
    console.log("Deletando servico com o id: ", id);

    try {
      const response = await Api.delete(`DeletarServico/${id}`);

      if (response.status === 200) {
        setServicos((prevServicos) =>
          prevServicos.filter((servico) => servico.id !== id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditService = async (id) => {
    handleModalEdit();
    console.log("Editando servico: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      NewServiceName == null ||
      NewServiceName == undefined ||
      NewServiceName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    const newService = {
      nome: NewServiceName,
      preco: NewServicePreco,
    };

    const response = await Api.post(
      "/NovoServico",
      JSON.stringify(newService),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(response.data.insertId);

    setServicos([
      ...servicos,
      {
        id: response.data.insertId,
        nome: NewServiceName,
        preco: NewServicePreco,
      },
    ]);

    handleClose();

    setNewServiceName("");
    setNewServicePreco("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      NewServiceName == null ||
      NewServiceName == undefined ||
      NewServiceName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    const EditedService = {};
    EditedService.id = Editdata.id;

   
      EditedService.nome = NewServiceName;
    

   
      EditedService.preco = NewServicePreco;
  
    

    const response = await Api.put(
     "/EditarServico",
     JSON.stringify(EditedService),
     {
       headers: { "Content-Type": "application/json" },
      }
    );

    setServicos((servicos) => {
      return servicos.map((servico) => {
        if (servico.id === Editdata.id) {
          return {
            ...servico,
            nome: NewServiceName,
            preco: NewServicePreco,
          };
        }
        return servico;
      });
    });

    handleCloseEdit();

    setNewServiceName("");
    setNewServicePreco("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1>Lista de Servicos</h1>

      <Button variant="primary" onClick={handleModal}>
        Cadastrar novo servico
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de novo Servico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Nome do Servico"
                onChange={(e) => setNewServiceName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPreco">
              <Form.Label>Preco</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Preco do Servico"
                onChange={(e) => setNewServicePreco(e.target.value)}
              />
            </Form.Group>


            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModalEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edicao de Servico</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewServiceName(e.target.value)}
                defaultValue={Editdata.nome}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPreco">
              <Form.Label>Preco</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewServicePreco(e.target.value)}
                defaultValue={Editdata.preco}
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
            <th>Preco</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((service) => (
            <tr key={service.id}>
              <td>{service.id}</td>
              <td>{service.nome}</td>
              <td>{service.preco}</td>
              

              <td>
                <Button
                  onClick={() => {
                    handleDeleteService(service.id);
                  }}style={{marginRight: 10}}
                >
                  <BsTrash />
                </Button>
                <Button
                  onClick={() => {
                    setEditData(service),
                      handleEditService(service.id),
                      setNewServiceName(service.nome),
                      setNewServicePreco(service.preco);
                      
                      
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

export default Servicos;
