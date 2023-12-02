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

const Atendimentos = () => {
  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [atendimentos, setAtendimentos] = useState([]);

  const [newProfissionalName, setNewProfissionalName] = useState("");

  const [Editdata, setEditData] = useState([]);

  const [profissional, setProfissionais] = useState([]);

  const [profissionalSelecionado, setProfissionalSelecionado] = useState();

  const [newDataInicio, setNewDataInicio] = useState("");
  const [newDataFim, setNewDataFim] = useState("");

  useEffect(() => {
    const getData = async () => {
      const responseAtendimentos = await Api.get("/BuscarAtendimentos");
      setAtendimentos(responseAtendimentos.data);

      const responseProfissionais = await Api.get("/BuscarProfissional");

      const profissionaisFormatados = responseProfissionais.data.map(
        (profissional) => ({
          value: profissional.id,
          label: profissional.nome,
        })
      );
      setProfissionais(profissionaisFormatados);
    };

    getData();
  }, []);

  const handleModal = () => {
    setShowModal(true);
  };

  const handleModalEdit = () => {
    setShowModalEdit(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setNewProfissionalName("");
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteAtendimento = async (id) => {
    try {
      const response = await Api.delete(`DeletarAtendimento/${id}`);

      if (response.status === 200) {
        const updatedAtendimentos = atendimentos.filter(
          (atendimento) => atendimento.id !== id
        );
        setAtendimentos(updatedAtendimentos);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditAtendimento = async (id) => {
    handleModalEdit();
    console.log("Editando atendimento: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      profissionalSelecionado == null ||
      profissionalSelecionado == undefined ||
      profissionalSelecionado == "" ||
      newDataInicio === "" ||
      newDataFim === ""
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    const newAtendimento = {
      profissional: profissionalSelecionado.value,
      hora_inicio: newDataInicio,
      hora_fim: newDataFim,
    };

    const response = await Api.post(
      "/NovoAtendimento",
      JSON.stringify(newAtendimento),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      window.location.reload();
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      newProfissionalName == null ||
      newProfissionalName == undefined ||
      newProfissionalName == "" ||
      newDataInicio === "" ||
      newDataFim === ""
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    const EditedAtendimento = {
      id: Editdata.id,
      nome: newProfissionalName,
      hora_inicio: newDataInicio,
      hora_fim: newDataFim,
    };

    const response = await Api.put(
      "/EditarAtendimento",
      JSON.stringify(EditedAtendimento),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setAtendimentos((atendimento) => {
      return atendimentos.map((atendimento) => {
        if (atendimento.id === Editdata.id) {
          return {
            ...atendimento,
            nome: newProfissionalName,
            hora_inicio: newDataInicio,
            hora_fim: newDataFim,
          };
        }
        return atendimento;
      });
    });

    handleCloseEdit();

    setNewProfissionalName("");
    setNewDataInicio("");
    setNewDataFim("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1 className="page-title">Lista de Atendimentos</h1>
      <Button
        style={{ marginBottom: "24px", marginTop: "16px" }}
        variant="primary"
        onClick={handleModal}
      >
        Cadastrar novo atendimento
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de novo Atendimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Selecione o profissional</Form.Label>
              <Select
                options={profissional}
                onChange={(selected) => setProfissionalSelecionado(selected)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicInicio">
              <Form.Label>Hora de início</Form.Label>
              <Form.Control
                type="time"
                value={newDataInicio}
                onChange={(e) => setNewDataInicio(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicFim">
              <Form.Label>Hora do fim</Form.Label>
              <Form.Control
                type="time"
                value={newDataFim}
                onChange={(e) => setNewDataFim(e.target.value)}
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
          <Modal.Title>Edicao de Atendimento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Selecione o profissional</Form.Label>
              <Select
                options={profissional}
                onChange={(selected) => setProfissionalSelecionado(selected)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicInicio">
              <Form.Label>Hora de início</Form.Label>
              <Form.Control
                type="time"
                value={newDataInicio}
                onChange={(e) => setNewDataInicio(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicFim">
              <Form.Label>Hora do fim</Form.Label>
              <Form.Control
                type="time"
                value={newDataFim}
                onChange={(e) => setNewDataFim(e.target.value)}
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
            <th>Nome do Profissional</th>
            <th>Hora de inicio</th>
            <th>Hora do fim</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {atendimentos.map((atendimento, index) => (
            <tr key={atendimento.id}>
              <td>{atendimento.id}</td>
              <td>
                {
                  profissional.find(
                    (profissional) =>
                      profissional.value === atendimento.id_profissional
                  )?.label
                }
              </td>
              <td>{atendimento.hora_inicio}</td>
              <td>{atendimento.hora_fim}</td>

              <td>
                <Button
                  className="actions-btn"
                  onClick={() => {
                    handleDeleteAtendimento(atendimento.id);
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

export default Atendimentos;
