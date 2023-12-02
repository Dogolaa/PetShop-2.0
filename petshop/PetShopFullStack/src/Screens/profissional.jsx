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

const Profissional = () => {
  const [criterio, setCriterio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const getProfissional = async () => {
      const responseProfissional = await Api.get(
        `/BuscarProfissional?criterio=${criterio}&termo=${searchTerm}`
      );
      setProfissional(responseProfissional.data);
      setAllProfissional(responseProfissional.data);
    };
    getProfissional();
  }, [criterio, searchTerm]);




  const [allProfissional, setAllProfissional] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [profissional, setProfissional] = useState([]);

  const [newProfissionalName, setNewProfissionalName] = useState("");
  const [newProfissionalEmail, setNewProfissionalEmail] = useState("");
  const [newProfissionalTelefone, setNewProfissionalTelefone] = useState("");
  const [newProfissionalCargo, setNewProfissionalCargo] = useState("");
  const [newProfissionalSalario, setNewProfissionalSalario] = useState("");
  const [newProfissionalEndereco, setNewProfissionalEndereco] = useState("");


  const [Editdata, setEditData] = useState([]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredProfissional = allProfissional.filter((profissional) =>
      profissional.nome.toLowerCase().includes(searchTerm)
    );
    setProfissional(filteredProfissional);
  };

  const handleSort = async (e) => {
    const selectedCriterio = e.target.value;
    setCriterio(selectedCriterio);

    try {
      const responseProfissional = await Api.get(
        `/BuscarProfissional?criterio=${selectedCriterio}`
      );
      setProfissional(responseProfissional.data);
      setAllProfissional(responseProfissional.data);
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
    setNewProfissionalName("");
    setNewProfissionalEmail("");
    setNewProfissionalTelefone("");
    setNewProfissionalEndereco("");
    setNewProfissionalCargo("");
    setNewProfissionalSalario("");
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteProfissional = async (id) => {
    console.log("Deletando profissional com o id: ", id);

    try {
      const response = await Api.delete(`DeletarProfissional/${id}`);

      if (response.status === 200) {
        setProfissional((prevProfissional) =>
          prevProfissional.filter((profissional) => profissional.id !== id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditProfissional = async (id) => {
    handleModalEdit();
    console.log("Editando profissional: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    if (
      newProfissionalName == null ||
      newProfissionalName == undefined ||
      newProfissionalName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    
    const newProfissional = {
      nome: newProfissionalName,
      email: newProfissionalEmail,
      telefone: newProfissionalTelefone,
      endereco: newProfissionalEndereco,
      cargo: newProfissionalCargo,
      salario: newProfissionalSalario,
    };
  
    try {
      const response = await Api.post(
        "/NovoProfissional",
        JSON.stringify(newProfissional),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      console.log(response.data.insertId);
  
      setProfissional([
        ...profissional,
        {
          id: response.data.insertId,
          nome: newProfissionalName,
          email: newProfissionalEmail,
          telefone: newProfissionalTelefone,
          endereco: newProfissionalEndereco,
          cargo: newProfissionalCargo,
          salario: newProfissionalSalario,
        },
      ]);
  
      handleClose();
  
      setNewProfissionalEmail("");
      setNewProfissionalName("");
      setNewProfissionalTelefone("");
      setNewProfissionalEndereco("");
      setNewProfissionalCargo("");
      setNewProfissionalSalario("");
  
      // Recarregar a página após a inserção bem-sucedida
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
    }
  };
  

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      newProfissionalName == null ||
      newProfissionalName == undefined ||
      newProfissionalName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }

    const EditedProfissional = {};
    EditedProfissional.id = Editdata.id;

    EditedProfissional.nome = newProfissionalName;

    EditedProfissional.email = newProfissionalEmail;

    EditedProfissional.telefone = newProfissionalTelefone;

    EditedProfissional.endereco = newProfissionalEndereco;

    EditedProfissional.cargo = newProfissionalCargo;

    EditedProfissional.salario = newProfissionalSalario;

    const response = await Api.put(
      "/EditarProfissional",
      JSON.stringify(EditedProfissional),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setProfissional((profissional) => {
      return profissional.map((profissional) => {
        if (profissional.id === Editdata.id) {
          return {
            ...profissional,
            nome: newProfissionalName,
            email: newProfissionalEmail,
            telefone: newProfissionalTelefone,
            endereco: newProfissionalEndereco,
            cargo: newProfissionalCargo,
            salario: newProfissionalSalario,
          };
        }
        return profissional;
      });
    });

    handleCloseEdit();

    setNewProfissionalName("");
    setNewProfissionalEmail("");
    setNewProfissionalEndereco("");
    setNewProfissionalTelefone("");
    setNewProfissionalCargo("");
    setNewProfissionalSalario("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1>Lista de Profissional</h1>

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
          Cadastrar Novo Profissional
        </Button>
        <Form>
          <Form.Group controlId="formBasicSort" style={{ marginRight: 10 }} >
            <Form.Control as="select" value={criterio} onChange={handleSort}>
              <option value="">Sem Ordenação</option>
              <option value="nome">Nome</option>
              <option value="telefone">Telefone</option>
              <option value="endereco">Endereco</option>
              <option value="cargo">Cargo</option>
              <option value="salario">Salario</option>
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
          <Modal.Title>Cadastro de novo Profissional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Nome do Profissional"
                onChange={(e) => setNewProfissionalName(e.target.value)}
              />
            </Form.Group>

            <FormGroup controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Digite o email do Profissional"
                onChange={(e) => setNewProfissionalEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Digite o telefone do Profissional"
                onChange={(e) => setNewProfissionalTelefone(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicAddress">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do Profissional"
                onChange={(e) => setNewProfissionalEndereco(e.target.value)}
              />
            </FormGroup>
            
            <FormGroup controlId="formBasicCargo">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o cargo do Profissional"
                onChange={(e) => setNewProfissionalCargo(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicSalario">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o salario do Profissional"
                onChange={(e) => setNewProfissionalSalario(e.target.value)}
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
          <Modal.Title>Edicao de Profissional</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewProfissionalName(e.target.value)}
                defaultValue={Editdata.nome}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewProfissionalEmail(e.target.value)}
                defaultValue={Editdata.email}
              />
            </Form.Group>

            <FormGroup controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Digite o telefone do Profissional"
                onChange={(e) => setNewProfissionalTelefone(e.target.value)}
                defaultValue={Editdata.telefone}
              />
            </FormGroup>

            <FormGroup controlId="formBasicAddress">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do Profissional"
                onChange={(e) => setNewProfissionalEndereco(e.target.value)}
                defaultValue={Editdata.endereco}
              />
            </FormGroup>

            <FormGroup controlId="formBasicCargo">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o Cargo do Profissional"
                onChange={(e) => setNewProfissionalCargo(e.target.value)}
                defaultValue={Editdata.cargo}
              />
            </FormGroup>

            <FormGroup controlId="formBasicSalario">
              <Form.Label>Salario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o Salario do Profissional"
                onChange={(e) => setNewProfissionalSalario(e.target.value)}
                defaultValue={Editdata.salario}
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
            <th>Cargo</th>
            <th>Salario</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {profissional.map((profissiona) => (
            <tr key={profissiona.id}>
              <td>{profissiona.id}</td>
              <td>{profissiona.nome}</td>
              <td>{profissiona.email}</td>
              <td>{profissiona.telefone}</td>
              <td>{profissiona.endereco}</td>
              <td>{profissiona.cargo}</td>
              <td>{profissiona.salario}</td>
              <td>
                <Button
                  onClick={() => {
                    handleDeleteProfissional(profissiona.id);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <BsTrash />
                </Button>
                <Button
                  onClick={() => {
                    setEditData(profissiona);
                    handleEditProfissional(profissiona.id);
                    setNewProfissionalName(profissiona.nome);
                    setNewProfissionalEmail(profissiona.email);
                    setNewProfissionalTelefone(profissiona.telefone);
                    setNewProfissionalEndereco(profissiona.endereco);
                    setNewProfissionalCargo(profissiona.cargo);
                    setNewProfissionalSalario(profissiona.salario);
                  }}
                >
                  <AiOutlineEdit />
                </Button>
              </td>
            </tr>
          ))}
          {profissional.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhum profissional encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Profissional;
