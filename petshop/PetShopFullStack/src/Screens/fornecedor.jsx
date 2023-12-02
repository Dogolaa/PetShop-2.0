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

const Fornecedor = () => {
  const [criterio, setCriterio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getFornecedor = async () => {
      const responseFornecedor = await Api.get(
        `/BuscarFornecedor?criterio=${criterio}&termo=${searchTerm}`
      );
      setFornecedor(responseFornecedor.data);
      setAllFornecedor(responseFornecedor.data);
    };
    getFornecedor();
  }, [criterio, searchTerm]);

  const [allFornecedor, setAllFornecedor] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [fornecedor, setFornecedor] = useState([]);

  const [newFornecedorName, setNewFornecedorName] = useState("");
  const [newFornecedorCNPJ, setNewFornecedorCNPJ] = useState("");
  const [newFornecedorTelefone, setNewFornecedorTelefone] = useState("");
  const [newFornecedorEndereco, setNewFornecedorEndereco] = useState("");

  const [Editdata, setEditData] = useState([]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredFornecedor = allFornecedor.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(searchTerm)
    );
    setFornecedor(filteredFornecedor);
  };

  const handleSort = async (e) => {
    const selectedCriterio = e.target.value;
    setCriterio(selectedCriterio);

    try {
      const responseFornecedor = await Api.get(
        `/BuscarFornecedor?criterio=${selectedCriterio}`
      );
      setFornecedor(responseFornecedor.data);
      setAllFornecedor(responseFornecedor.data);
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
    setNewFornecedorName("");
    setNewFornecedorCNPJ("");
    setNewFornecedorTelefone("");
    setNewFornecedorEndereco("");
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteForneced = async (id) => {
    console.log("Deletando fornecedor com o id: ", id);

    try {
      const response = await Api.delete(`DeletarFornecedor/${id}`);

      if (response.status === 200) {
        setFornecedor((prevFornecedor) =>
          prevFornecedor.filter((fornecedor) => fornecedor.id !== id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditForneced = async (id) => {
    handleModalEdit();
    console.log("Editando fornecedor: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      newFornecedorName == null ||
      newFornecedorName == undefined ||
      newFornecedorName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }

    const newFornecedor = {
      nome: newFornecedorName,
      cnpj: newFornecedorCNPJ,
      telefone: newFornecedorTelefone,
      endereco: newFornecedorEndereco,
    };

    try {
      const response = await Api.post(
        "/NovoFornecedor",
        JSON.stringify(newFornecedor),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response.data.insertId);

      setFornecedor([
        ...fornecedor,
        {
          id: response.data.insertId,
          nome: newFornecedorName,
          cnpj: newFornecedorCNPJ,
          telefone: newFornecedorTelefone,
          endereco: newFornecedorEndereco,
        },
      ]);

      handleClose();

      setNewFornecedorCNPJ("");
      setNewFornecedorName("");
      setNewFornecedorTelefone("");
      setNewFornecedorEndereco("");

      // Recarregar a página após a inserção bem-sucedida
      window.location.reload();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      newFornecedorName == null ||
      newFornecedorName == undefined ||
      newFornecedorName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }

    const EditedFornecedor = {};
    EditedFornecedor.id = Editdata.id;

    EditedFornecedor.nome = newFornecedorName;

    EditedFornecedor.cnpj = newFornecedorCNPJ;

    EditedFornecedor.telefone = newFornecedorTelefone;

    EditedFornecedor.endereco = newFornecedorEndereco;

    const response = await Api.put(
      "/EditarFornecedor",
      JSON.stringify(EditedFornecedor),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setFornecedor((fornecedor) => {
      return fornecedor.map((fornecedor) => {
        if (fornecedor.id === Editdata.id) {
          return {
            ...fornecedor,
            nome: newFornecedorName,
            cnpj: newFornecedorCNPJ,
            telefone: newFornecedorTelefone,
            endereco: newFornecedorEndereco,
          };
        }
        return fornecedor;
      });
    });

    handleCloseEdit();

    setNewFornecedorName("");
    setNewFornecedorCNPJ("");
    setNewFornecedorEndereco("");
    setNewFornecedorTelefone("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1 className="page-title">Lista de Fornecedor</h1>

      <div
        className="group-buttons"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="primary"
          onClick={handleModal}
          style={{ marginRight: "10px", marginTop: "0" }}
        >
          Cadastrar Novo Fornecedor
        </Button>
        <Form>
          <Form.Group controlId="formBasicSort" style={{ marginRight: 10 }}>
            <Form.Control as="select" value={criterio} onChange={handleSort}>
              <option value="">Sem Ordenação</option>
              <option value="nome">Nome</option>
              <option value="telefone">Telefone</option>
              <option value="endereco">Endereco</option>
              <option value="cnpj">CNPJ</option>
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
          <Modal.Title>Cadastro de novo Fornecedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Nome do Fornecedor"
                onChange={(e) => setNewFornecedorName(e.target.value)}
              />
            </Form.Group>

            <FormGroup controlId="formBasiccnpj">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="cnpj"
                placeholder="Digite o cnpj do Fornecedor"
                onChange={(e) => setNewFornecedorCNPJ(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Digite o telefone do Fornecedor"
                onChange={(e) => setNewFornecedorTelefone(e.target.value)}
              />
            </FormGroup>

            <FormGroup controlId="formBasicAddress">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do Fornecedor"
                onChange={(e) => setNewFornecedorEndereco(e.target.value)}
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
          <Modal.Title>Edicao de Fornecedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewFornecedorName(e.target.value)}
                defaultValue={Editdata.nome}
              />
            </Form.Group>

            <Form.Group controlId="formBasiccnpj">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewFornecedorCNPJ(e.target.value)}
                defaultValue={Editdata.cnpj}
              />
            </Form.Group>

            <FormGroup controlId="formBasicPhone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Digite o telefone do Fornecedor"
                onChange={(e) => setNewFornecedorTelefone(e.target.value)}
                defaultValue={Editdata.telefone}
              />
            </FormGroup>

            <FormGroup controlId="formBasicAddress">
              <Form.Label>Endereço</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o endereço do Fornecedor"
                onChange={(e) => setNewFornecedorEndereco(e.target.value)}
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
            <th>CNPJ</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {fornecedor.map((forneced) => (
            <tr key={forneced.id}>
              <td>{forneced.id}</td>
              <td>{forneced.nome}</td>
              <td>{forneced.cnpj}</td>
              <td>{forneced.telefone}</td>
              <td>{forneced.endereco}</td>

              <td>
                <Button
                  className="actions-btn"
                  onClick={() => {
                    handleDeleteForneced(forneced.id);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <BsTrash />
                </Button>
                <Button
                  className="actions-btn"
                  onClick={() => {
                    setEditData(forneced);
                    handleEditForneced(forneced.id);
                    setNewFornecedorName(forneced.nome);
                    setNewFornecedorCNPJ(forneced.cnpj);
                    setNewFornecedorTelefone(forneced.telefone);
                    setNewFornecedorEndereco(forneced.endereco);
                  }}
                >
                  <AiOutlineEdit />
                </Button>
              </td>
            </tr>
          ))}
          {fornecedor.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhum fornecedor encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Fornecedor;
