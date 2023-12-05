const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log("BD foi conectado com sucesso!");
});

class dbServices {
  static instance;

  static getdbServicesInstance() {
    if (!this.instance) {
      this.instance = new dbServices();
    }
    return this.instance;
  }

  async BuscarClientes() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tbl_clientes";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async BuscarProdutos(criterio, termo) {
    let query = "SELECT * FROM tbl_produtos";

    if (termo) {
      query += ` WHERE nome LIKE '%${termo}%'`;
    }

    if (criterio) {
      switch (criterio) {
        case "nome":
          query += " ORDER BY nome";
          break;
        case "preco":
          query += " ORDER BY preco";
          break;
        case "estoque":
          query += " ORDER BY estoque";
          break;
        // Adicione mais casos conforme necessário
        default:
          break;
      }
    }

    return new Promise((resolve, reject) => {
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }





  async BuscarProdutosPorNome(nome) {
    return new Promise((resolve, reject) => {
      const query = `SELECT p.*, o.tipo AS tipo2, c.validade AS validade2, c.ingredientes AS ingredientes2 
                     FROM tbl_produtos p 
                     LEFT JOIN tbl_objeto o ON p.id = o.id 
                     LEFT JOIN tbl_consumivel c ON p.id = c.id 
                     WHERE p.nome LIKE '%${nome}%'`; // Usando o parâmetro nome na cláusula WHERE
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }  
  
  async BuscarTodosProdutos() {
    return new Promise((resolve, reject) => {
      const query = "SELECT p.*, o.tipo AS tipo2, c.validade AS validade2, c.ingredientes AS ingredientes2 FROM tbl_produtos p LEFT JOIN tbl_objeto o ON p.id = o.id LEFT JOIN tbl_consumivel c ON p.id = c.id;";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async BuscarTodosProdutosObjetos() {
    return new Promise((resolve, reject) => {
      const query = "SELECT p.*, o.tipo AS tipo2 FROM tbl_produtos p RIGHT JOIN tbl_objeto o ON p.id = o.id;";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async BuscarTodosProdutosConsumiveis() {
    return new Promise((resolve, reject) => {
      const query = "SELECT p.*, c.validade AS validade2, c.ingredientes AS ingredientes2 FROM tbl_produtos p RIGHT JOIN tbl_consumivel c ON p.id = c.id;";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async QuantidadeProdutosTabela() {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS total_produtos 
                     FROM (SELECT p.*, o.tipo AS tipo2, c.validade AS validade2, c.ingredientes AS ingredientes2 
                     FROM tbl_produtos p LEFT JOIN tbl_objeto o ON p.id = o.id LEFT JOIN tbl_consumivel c ON p.id = c.id ) 
                     AS subconsulta;`;
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  } 

  async NovoCliente(data) {
    try {
      const query = "INSERT INTO tbl_clientes (nome,email) VALUES (?,?)";
      const nome = data.nome;
      const email = data.email;

      const response = await new Promise((resolve, reject) => {
        connection.query(query, [nome, email], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      console.log("Cliente inserido com sucesso");
      return response;
    } catch (error) {
      console.log("Erro ao inserir cliente :" + error);
      throw error;
    }
  }

  async DeletarCliente(id) {
    const query = `DELETE FROM tbl_clientes WHERE id = ?;`;
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, id, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Cliente nao encontrado");
      }
      console.log("Cliente foi deletado com sucessos");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  

  async NovoProduto(data) {
    try {
      const query =
        "INSERT INTO tbl_produtos (nome,estoque,preco,descricao,marca,fornecedor) VALUES (?,?,?,?,?,?)";
      const nome = data.nome;
      const preco = data.preco;
      const estoque = data.estoque;
      const descricao = data.descricao;
      const marca = data.marca;
      const fornecedor = data.fornecedor;
      const tipo = data.tipo;

      const response = await new Promise((resolve, reject) => {
        connection.query(query, [nome, preco, estoque, descricao, marca, fornecedor], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      const lastInsertedId = await new Promise((resolve, reject) => {
        const queryLastId = "SELECT id FROM tbl_produtos ORDER BY id DESC LIMIT 1";
        connection.query(queryLastId, (err, result) => {
          if (err) reject(err);
          resolve(result[0].id); // Acessa o ID da primeira linha do resultado
        });
      });

      const query2 = "INSERT INTO tbl_objeto (id,tipo) VALUES (?,?)";

      const response3 = await new Promise((resolve, reject) => {
        connection.query(query2, [lastInsertedId, tipo], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      console.log("Produto inserido com sucesso");
      return response;
    } catch (error) {
      console.log("Erro ao inserir produto :" + error);
      throw error;
    }
  }

  async NovoProduto(data) {
    try {
      const query =
        "INSERT INTO tbl_produtos (nome,estoque,preco,descricao,marca,fornecedor) VALUES (?,?,?,?,?,?)";
      const nome = data.nome;
      const preco = data.preco;
      const estoque = data.estoque;
      const descricao = data.descricao;
      const marca = data.marca;
      const fornecedor = data.fornecedor;
      const validade = data.validade;
      const ingredientes = data.ingredientes;

      const response = await new Promise((resolve, reject) => {
        connection.query(query, [nome, preco, estoque, descricao, marca, fornecedor], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      const lastInsertedId = await new Promise((resolve, reject) => {
        const queryLastId = "SELECT id FROM tbl_produtos ORDER BY id DESC LIMIT 1";
        connection.query(queryLastId, (err, result) => {
          if (err) reject(err);
          resolve(result[0].id); // Acessa o ID da primeira linha do resultado
        });
      });

      const query2 = "INSERT INTO tbl_consumivel (id,validade,ingredientes) VALUES (?,?,?)";

      const response3 = await new Promise((resolve, reject) => {
        connection.query(query2, [lastInsertedId, validade, ingredientes], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      console.log("Produto inserido com sucesso");
      return response3;
    } catch (error) {
      console.log("Erro ao inserir produto :" + error);
      throw error;
    }
  }

  async DeletarProduto(id) {
    const query = `DELETE FROM tbl_produtos WHERE id = ?;`;
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, id, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Produto nao encontrado");
      }
      console.log("Produto foi deletado com sucessos");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async BuscarServicos() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tbl_servicos";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async NovoServico(data) {
    try {
      const query = "INSERT INTO tbl_servicos (nome,preco) VALUES (?,?)";
      const nome = data.nome;
      const preco = data.preco;

      const response = await new Promise((resolve, reject) => {
        connection.query(query, [nome, preco], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      console.log("Servico inserido com sucesso");
      return response;
    } catch (error) {
      console.log("Erro ao inserir servico :" + error);
      throw error;
    }
  }

  async DeletarServico(id) {
    const query = `DELETE FROM tbl_servicos WHERE id = ?;`;
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, id, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Servico nao encontrado");
      }
      console.log("Servico foi deletado com sucesso");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async EditarProduto(data) {
    let query = "UPDATE tbl_produtos SET ";
    const values = [];
    let isFirstSet = true;

    if (data.nome != null || data.nome != undefined) {
      query += `nome = ?`;
      values.push(data.nome);
      isFirstSet = false;
    }
    if (data.preco != null || data.preco != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `preco = ?`;
      values.push(data.preco);
      isFirstSet = false;
    }
    if (data.estoque != null || data.estoque != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `estoque = ?`;
      values.push(data.estoque);
    }

    query += ` WHERE id = ?`;
    values.push(data.id);

    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, values, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Produto nao encontrado");
      }
      console.log("Produto foi editado com sucesso");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async EditarCliente(data) {
    let query = "UPDATE tbl_clientes SET ";
    const values = [];
    let isFirstSet = true;

    if (data.nome != null || data.nome != undefined) {
      query += `nome = ?`;
      values.push(data.nome);
      isFirstSet = false;
    }
    if (data.email != null || data.email != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `email = ?`;
      values.push(data.email);
    }

    query += ` WHERE id = ?`;
    values.push(data.id);

    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, values, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Cliente nao encontrado");
      }
      console.log("Cliente foi editado com sucesso");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async EditarServico(data) {
    let query = "UPDATE tbl_servicos SET ";
    const values = [];
    let isFirstSet = true;

    if (data.nome != null || data.nome != undefined) {
      query += `nome = ?`;
      values.push(data.nome);
      isFirstSet = false;
    }
    if (data.preco != null || data.preco != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `preco = ?`;
      values.push(data.preco);
    }

    query += ` WHERE id = ?`;
    values.push(data.id);

    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, values, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Servico nao encontrado");
      }
      console.log("Servico foi editado com sucesso");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async BuscarVendas() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tbl_vendas";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async NovaVenda(data) {
    try {
      const query =
        "INSERT INTO tbl_vendas (id_cliente,id_produto,id_servico) VALUES (?,?,?)";

      const { cliente, produtos, servicos } = data;

      const produtosString = produtos.join(", ");
      const servicosString = servicos.join(", ");

      const response = await new Promise((resolve, reject) => {
        connection.query(
          query,
          [cliente, produtosString, servicosString],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result);
          }
        );
      });
      console.log("Cliente inserido com sucesso");
      return response;
    } catch (error) {
      console.log("Erro ao inserir cliente :" + error);
      throw error;
    }
  }

  async DeletarVenda(id) {
    const checkIfExistsQuery = `
      SELECT 1
      FROM tbl_vendas
      WHERE id = ?
        AND EXISTS (
          SELECT 1 FROM tbl_clientes WHERE id = tbl_vendas.id_cliente
        )
        AND EXISTS (
          SELECT 1 FROM tbl_produtos WHERE id = tbl_vendas.id_produto
        )
        AND EXISTS (
          SELECT 1 FROM tbl_servicos WHERE id = tbl_vendas.id_servico
        );
    `;
  
    const deleteVendaQuery = `DELETE FROM tbl_vendas WHERE id = ?;`;
  
    try {
      // Verificar se a venda existe e se está associada a clientes, produtos e serviços
      const existsResponse = await new Promise((resolve, reject) => {
        connection.query(checkIfExistsQuery, id, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
  
      if (existsResponse.length === 0) {
        throw new Error("Não é possível excluir a venda, pois não foi encontrada ou está associada a clientes, produtos ou serviços inexistentes.");
      }
  
      // Se existir, proceda com a exclusão da venda
      const deleteResponse = await new Promise((resolve, reject) => {
        connection.query(deleteVendaQuery, id, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
  
      if (deleteResponse.affectedRows === 0) {
        throw new Error("Venda não encontrada");
      }
  
      console.log("Venda foi deletada com sucesso");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  

  

  async buscarInformacoesVendas() {
    return new Promise(async (resolve, reject) => {
      try {
        const queryProdutos = "SELECT * FROM tbl_produtos";
        const produtos = await this.queryAsync(queryProdutos);

        const queryServicos = "SELECT * FROM tbl_servicos";
        const servicos = await this.queryAsync(queryServicos);

        const queryProdutosVendidos = "SELECT id_produto FROM tbl_vendas;";
        const idsProdutos = await this.queryAsync(queryProdutosVendidos);

        const queryServicosVendidos = "SELECT id_servico FROM tbl_vendas;";
        const idsServicos = await this.queryAsync(queryServicosVendidos);

        const calcularFaturamentoProdutos = (ids, lista) => {
          let totalFaturamento = 0;

          ids.forEach((idString) => {
            const idArray = idString.id_produto
              .split(",")
              .map((id) => id.trim());

            idArray.forEach((id) => {
              const produto = lista.find((item) => item.id == id);

              if (produto) {
                totalFaturamento += parseFloat(produto.preco);
              }
            });
          });

          return totalFaturamento;
        };

        const calcularFaturamentoServicos = (ids, lista) => {
          let totalFaturamento = 0;

          ids.forEach((idString) => {
            const idArray = idString.id_servico
              .split(",")
              .map((id) => id.trim());

            idArray.forEach((id) => {
              const servico = lista.find((item) => item.id == id);

              if (servico) {
                totalFaturamento += parseFloat(servico.preco);
              }
            });
          });

          return totalFaturamento;
        };

        const faturamentoProdutos = calcularFaturamentoProdutos(
          idsProdutos,
          produtos
        );
        const faturamentoServicos = calcularFaturamentoServicos(
          idsServicos,
          servicos
        );

        const resultadoFinal = {
          valorProdutos: faturamentoProdutos,
          valorServicos: faturamentoServicos,
        };
        resolve(resultadoFinal);
      } catch (error) {
        reject(error);
      }
    });
  }




}

module.exports = dbServices;
