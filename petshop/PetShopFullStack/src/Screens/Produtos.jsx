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

const Produtos = () => {
  const [criterio, setCriterio] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getProdutos = async () => {
      const responseProdutos = await Api.get(
        `/BuscarProdutos?criterio=${criterio}&termo=${searchTerm}`
      );
      setProdutos(responseProdutos.data);
      setAllProdutos(responseProdutos.data);
    };
    getProdutos();
  }, [criterio, searchTerm]);

  const [allProdutos, setAllProdutos] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [produtos, setProdutos] = useState([]);

  const [NewProdutoName, setNewProdutoName] = useState("");
  const [NewProdutoPreco, setNewProdutoPreco] = useState("");
  const [NewProdutoEstoque, setNewProdutoEstoque] = useState("");
  const [Editdata, setEditData] = useState([]);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredProdutos = allProdutos.filter((produto) =>
      produto.nome.toLowerCase().includes(searchTerm)
    );
    setProdutos(filteredProdutos);
  };

  const handleSort = async (e) => {
    const selectedCriterio = e.target.value;
    setCriterio(selectedCriterio);

    try {
      const responseProdutos = await Api.get(
        `/BuscarProdutos?criterio=${selectedCriterio}`
      );
      setProdutos(responseProdutos.data);
      setAllProdutos(responseProdutos.data);
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
    setNewProdutoName("");
    setNewProdutoPreco("");
    setNewProdutoEstoque("");
  };

  const handleCloseEdit = () => {
    setEditData({});
    setShowModalEdit(false);
  };

  const handleDeleteProduct = async (id) => {
    console.log("Deletando produto com o id: ", id);

    try {
      const response = await Api.delete(`DeletarProduto/${id}`);

      if (response.status === 200) {
        setProdutos((prevProdutos) =>
          prevProdutos.filter((produto) => produto.id !== id)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditProduct = async (id) => {
    handleModalEdit();
    console.log("Editando produto: ", Editdata);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (
      NewProdutoName == null ||
      NewProdutoName == undefined ||
      NewProdutoName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    if (
      NewProdutoPreco == null ||
      NewProdutoPreco == undefined ||
      NewProdutoPreco == ""
    ) {
      alert("preco nao pode ser nulo!");
      return;
    }
    const newProduct = {
      nome: NewProdutoName,
      preco: NewProdutoPreco,
      estoque: NewProdutoEstoque,
    };

    const response = await Api.post(
      "/NovoProduto",
      JSON.stringify(newProduct),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log(response.data.insertId);

    setProdutos([
      ...produtos,
      {
        id: response.data.insertId,
        nome: NewProdutoName,
        preco: NewProdutoPreco,
        estoque: NewProdutoEstoque,
      },
    ]);

    handleClose();

    setNewProdutoName("");
    setNewProdutoPreco("");
    setNewProdutoEstoque("");
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    if (
      NewProdutoName == null ||
      NewProdutoName == undefined ||
      NewProdutoName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }

    if (
      NewProdutoPreco == null ||
      NewProdutoPreco == undefined ||
      NewProdutoPreco == ""
    ) {
      alert("preco nao pode ser nulo!");
      return;
    }
    const EditedProduct = {};
    EditedProduct.id = Editdata.id;

    EditedProduct.nome = NewProdutoName;

    EditedProduct.preco = NewProdutoPreco;

    EditedProduct.estoque = NewProdutoEstoque;

    const response = await Api.put(
      "/EditarProduto",
      JSON.stringify(EditedProduct),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    setProdutos((produtos) => {
      return produtos.map((produto) => {
        if (produto.id === Editdata.id) {
          return {
            ...produto,
            nome: NewProdutoName,
            preco: NewProdutoPreco,
            estoque: NewProdutoEstoque,
          };
        }
        return produto;
      });
    });

    handleCloseEdit();

    setNewProdutoName("");
    setNewProdutoPreco("");
    setNewProdutoEstoque("");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1 style={{ marginTop: "84px" }}>Lista de Produtos</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "24px",
          marginTop: "16px",
        }}
      >
        <Button
          variant="primary"
          onClick={handleModal}
          style={{
            marginRight: "10px",
            backgroundColor: "#baff29",
            border: "1px solid rgb(131, 179, 29)",
            marginTop: "0",
          }}
        >
          Cadastrar Novo Produto
        </Button>
        <Form>
          <Form.Group controlId="formBasicSort" style={{ marginRight: 10 }}>
            <Form.Control as="select" value={criterio} onChange={handleSort}>
              <option value="">Sem Ordenação</option>
              <option value="nome">Nome</option>
              <option value="preco">Preço</option>
              <option value="estoque">Estoque</option>
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
          <Modal.Title>Cadastro de novo Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Nome do Produto"
                onChange={(e) => setNewProdutoName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPreco">
              <Form.Label>Preco</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Preco do Produto!"
                onChange={(e) => setNewProdutoPreco(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEstoque">
              <Form.Label>Estoque</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o Estoque inical do Produto"
                onChange={(e) => setNewProdutoEstoque(e.target.value)}
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
          <Modal.Title>Edicao de Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewProdutoName(e.target.value)}
                defaultValue={Editdata.nome}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPreco">
              <Form.Label>Preco</Form.Label>
              <Form.Control
                type="Text"
                onChange={(e) => setNewProdutoPreco(e.target.value)}
                defaultValue={Editdata.preco}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEstoque">
              <Form.Label>Estoque</Form.Label>
              <Form.Control
                type="number"
                onChange={(e) => setNewProdutoEstoque(e.target.value)}
                defaultValue={Editdata.estoque}
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
            <th>Estoque</th>
            <th>Acoes</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>{product.preco}</td>
              <td>{product.estoque}</td>
              <td>
                <Button
                  className="actions-btn"
                  onClick={() => {
                    handleDeleteProduct(product.id);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <BsTrash />
                </Button>
                <Button
                  className="actions-btn"
                  onClick={() => {
                    setEditData(product),
                      handleEditProduct(product.id),
                      setNewProdutoName(product.nome),
                      setNewProdutoPreco(product.preco),
                      setNewProdutoEstoque(product.estoque);
                  }}
                >
                  <AiOutlineEdit />
                </Button>
              </td>
            </tr>
          ))}
          {produtos.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default Produtos;
