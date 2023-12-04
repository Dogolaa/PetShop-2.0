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
  const [nomeProduto, setNomeProduto] = useState('');
  const [QuantProdutos, setQuantProdutos] = useState(null);

  useEffect(() => {
    const getProdutos = async () => {
      try {
        const responseProdutos = await Api.get("/BuscarTodosProdutos");
        const responseQuantidadeProdutos = await Api.get("/QuantidadeProdutosTabela");
        console.log(responseQuantidadeProdutos.data[0].total_produtos);
        const responseProdutosObjeto = await Api.get("/BuscarTodosProdutosObjetos");
        const responseProdutosConsumivel = await Api.get("/BuscarTodosProdutosConsumiveis");
        setProdutos(responseProdutos.data);
        setQuantProdutos(responseQuantidadeProdutos.data[0].total_produtos);
        setProdutos2(responseProdutosObjeto.data);
        setProdutos3(responseProdutosConsumivel.data);
      } catch (error) {
        console.error("Erro ao obter produtos:", error);
      }
    };
    getProdutos();
  }, []);

  const handleInputChange = (event) => {
    setNomeProduto(event.target.value);
  };

  const buscarProdutosPorNome = async () => {
    try {
      const response = await Api.post("/BuscarProdutosPorNome", { nome: nomeProduto });
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos por nome:", error);
    }
  };

  const buscarProdutosOrdenada = async () => {
    try {
      const response = await Api.post("/BuscarProdutosPorNome", { nome: consultaOrdena });
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos por nome:", error);
    }
  };

    const [opcaoSelecionada, setOpcaoSelecionada] = useState('produtos');
    const [valorSelecionado, setValorSelecionado] = useState('');
  
    const handleChange = (event) => {
      setOpcaoSelecionada(event.target.value);
      setValorSelecionado(event.target.value);
    };

  const [showModal, setShowModal] = useState(false);

  const [showModalEdit, setShowModalEdit] = useState(false);

  const [produtos, setProdutos] = useState([]);
  
  const [produtosObjetos, setProdutos2] = useState([]);
  const [produtosConsumiveis, setProdutos3] = useState([]);

  const [NewProdutoName, setNewProdutoName] = useState("");
  const [NewProdutoPreco, setNewProdutoPreco] = useState("");
  const [NewProdutoEstoque, setNewProdutoEstoque] = useState("");
  const [NewProdutoDescricao, setNewProdutoDescricao] = useState("");
  const [NewProdutoMarca, setNewProdutoMarca] = useState("");
  const [NewProdutoFornecedor, setNewProdutoFornecedor] = useState("");
  const [NewProdutoTipo, setNewProdutoTipo] = useState("");
  const [NewProdutoValidade, setNewProdutoValidade] = useState("");
  const [NewProdutoIngredientes, setNewProdutoIngredientes] = useState("");
  const [Editdata, setEditData] = useState([]);

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
    location.reload();
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
    const newProduct = {
      nome: NewProdutoName,
      preco: NewProdutoPreco,
      estoque: NewProdutoEstoque,
      descricao: NewProdutoDescricao,
      marca: NewProdutoMarca,
      fornecedor: NewProdutoFornecedor,
      tipo: NewProdutoTipo,
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
        descricao: NewProdutoDescricao,
        marca: NewProdutoMarca,
        fornecedor: NewProdutoFornecedor,
        tipo: NewProdutoTipo,
      },
    ]);

    handleClose();

    setNewProdutoName("");
    setNewProdutoPreco("");
    setNewProdutoEstoque("");
    location.reload();
  };

  const handleSave2 = async (e) => {
    e.preventDefault();

    if (
      NewProdutoName == null ||
      NewProdutoName == undefined ||
      NewProdutoName == ""
    ) {
      alert("nome nao pode ser nulo!");
      return;
    }
    const newProduct = {
      nome: NewProdutoName,
      preco: NewProdutoPreco,
      estoque: NewProdutoEstoque,
      descricao: NewProdutoDescricao,
      marca: NewProdutoMarca,
      fornecedor: NewProdutoFornecedor,
      validade: NewProdutoValidade,
      ingredientes: NewProdutoIngredientes,
    };
    console.log(NewProdutoValidade);

    const response = await Api.post(
      "/NovoProduto2",
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
        descricao: NewProdutoDescricao,
        marca: NewProdutoMarca,
        fornecedor: NewProdutoFornecedor,
        validade: NewProdutoValidade,
        ingredientes: NewProdutoIngredientes,
      },
    ]);

    handleClose();

    setNewProdutoName("");
    setNewProdutoPreco("");
    setNewProdutoEstoque("");
    location.reload();
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

  const handleSubmit = async (e) => {
    event.preventDefault();
    if(opcaoSelecionada === "protudos"){
      return "<h1>Teste</h1>";
    }
    //console.log("<h1>Teste</h1>");
  };

  function formatadata(date){
    if(date == null)
      return
    const dataOriginal = new Date(date);
      const dia = dataOriginal.getDate();
      const mes = dataOriginal.getMonth() + 1; // Os meses são indexados a partir de zero, então somamos 1
      const ano = dataOriginal.getFullYear();

      const dataFormatada = `${dia}/${mes}/${ano}`;
      return dataFormatada;
  }
  

  
  return (
    <Container style={{ marginTop: 20 }}>
      <Header />
      <h1>Lista de Produtos</h1>

      <Button variant="primary" onClick={handleModal}>
        Cadastrar novo produto Objeto
      </Button>
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

            <Form.Group controlId="formBasicDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite a Descrição do Produto"
                onChange={(e) => setNewProdutoDescricao(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicMarca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite a Marca do Produto"
                onChange={(e) => setNewProdutoMarca(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicFornecedor">
              <Form.Label>Fornecedor</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Fronecedor do Produto"
                onChange={(e) => setNewProdutoFornecedor(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicTipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Tipo do Produto"
                onChange={(e) => setNewProdutoTipo(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Button variant="primary" onClick={handleModal}>
        Cadastrar novo produto Consumivel
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de novo Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave2}>
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

            <Form.Group controlId="formBasicDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite a Descrição do Produto"
                onChange={(e) => setNewProdutoDescricao(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicMarca">
              <Form.Label>Marca</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite a Marca do Produto"
                onChange={(e) => setNewProdutoMarca(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicFornecedor">
              <Form.Label>Fornecedor</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite o Fronecedor do Produto"
                onChange={(e) => setNewProdutoFornecedor(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicValidade">
              <Form.Label>Valdiade</Form.Label>
              <Form.Control
                type="date"
                placeholder="Digite a Validade do Produto"
                onChange={(e) => setNewProdutoValidade(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicIngredientes">
              <Form.Label>Ingredientes</Form.Label>
              <Form.Control
                type="Text"
                placeholder="Digite os Ingredientes do Produto"
                onChange={(e) => setNewProdutoIngredientes(e.target.value)}
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

      <br /><br />
      <input type="text" value={nomeProduto} onChange={handleInputChange} />
      <button onClick={buscarProdutosPorNome}>Buscar</button>
      

      <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label></Form.Label>
        <Form.Control as="select" value={opcaoSelecionada} onChange={handleChange}>
          <option value="produtos">Produtos</option>
          <option value="objeto">Objetos</option>
          <option value="consumivel">Consumíveis</option>
        </Form.Control>
      </Form.Group>
    </Form>
    <br />
    {opcaoSelecionada === 'produtos' && <p>total de produtos: {QuantProdutos}</p>}
      {opcaoSelecionada === 'produtos' && <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Preco(R$)</th>
            <th>Estoque</th>
            <th>Descrição</th>
            <th>Marca</th>
            <th>Fornecedor</th>
            {opcaoSelecionada != 'consumivel' && <th>Tipo</th>}
            {opcaoSelecionada != 'objeto' && <th>Validade</th>}
            {opcaoSelecionada != 'objeto'  && <th>Ingredientes</th>}  
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((product) => (
            <tr key={product.id }>
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>{product.preco}</td>
              <td>{product.estoque}</td>
              <td>{product.descricao}</td>
              <td>{product.marca}</td>
              <td>{product.fornecedor}</td>
              {opcaoSelecionada != 'consumivel' && <td>{product.tipo2}</td>}
              {opcaoSelecionada != 'objeto' && <td>{formatadata(product.validade2)}</td>}
              {opcaoSelecionada != 'objeto' && <td>{product.ingredientes2}</td>}
              

              <td>
                <Button
                  onClick={() => {
                    handleDeleteProduct(product.id);
                  }} style={{marginRight: 10}}
                >
                  <BsTrash />
                </Button>
                <Button
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
        </tbody>
      </Table>}

      {opcaoSelecionada === 'objeto' && <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Preco(R$)</th>
            <th>Estoque</th>
            <th>Descrição</th>
            <th>Marca</th>
            <th>Fornecedor</th>
            {opcaoSelecionada != 'consumivel' && <th>Tipo</th>}
            {opcaoSelecionada != 'objeto' && <th>Validade</th>}
            {opcaoSelecionada != 'objeto'  && <th>Ingredientes</th>}  
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosObjetos.map((product) => (
            <tr key={product.id }>
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>{product.preco}</td>
              <td>{product.estoque}</td>
              <td>{product.descricao}</td>
              <td>{product.marca}</td>
              <td>{product.fornecedor}</td>
              {opcaoSelecionada != 'consumivel' && <td>{product.tipo2}</td>}
              {opcaoSelecionada != 'objeto' && <td>{formatadata(product.validade2)}</td>}
              {opcaoSelecionada != 'objeto' && <td>{product.ingredientes2}</td>}
              

              <td>
                <Button
                  onClick={() => {
                    handleDeleteProduct(product.id);
                  }} style={{marginRight: 10}}
                >
                  <BsTrash />
                </Button>
                <Button
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
        </tbody>
      </Table>}

      {opcaoSelecionada === 'consumivel' && <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Preco(R$)</th>
            <th>Estoque</th>
            <th>Descrição</th>
            <th>Marca</th>
            <th>Fornecedor</th>
            {opcaoSelecionada != 'consumivel' && <th>Tipo</th>}
            {opcaoSelecionada != 'objeto' && <th>Validade</th>}
            {opcaoSelecionada != 'objeto'  && <th>Ingredientes</th>}  
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosConsumiveis.map((product) => (
            <tr key={product.id }>
              <td>{product.id}</td>
              <td>{product.nome}</td>
              <td>{product.preco}</td>
              <td>{product.estoque}</td>
              <td>{product.descricao}</td>
              <td>{product.marca}</td>
              <td>{product.fornecedor}</td>
              {opcaoSelecionada != 'consumivel' && <td>{product.tipo2}</td>}
              {opcaoSelecionada != 'objeto' && <td>{formatadata(product.validade2)}</td>}
              {opcaoSelecionada != 'objeto' && <td>{product.ingredientes2}</td>}
              

              <td>
                <Button
                  onClick={() => {
                    handleDeleteProduct(product.id);
                  }} style={{marginRight: 10}}
                >
                  <BsTrash />
                </Button>
                <Button
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
        </tbody>
      </Table>}


      
    </Container>
  );
};


export default Produtos;
