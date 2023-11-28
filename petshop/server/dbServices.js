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

  async BuscarProdutos() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tbl_produtos";
      connection.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async NovoProduto(data) {
    try {
      const query =
        "INSERT INTO tbl_produtos (nome,estoque,preco) VALUES (?,?,?)";
      const nome = data.nome;
      const preco = data.preco;
      const estoque = data.estoque;

      const response = await new Promise((resolve, reject) => {
        connection.query(query, [nome, preco, estoque], (err, result) => {
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
    const query = `DELETE FROM tbl_vendas WHERE id = ?;`;
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, id, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      if (response.affectedRows == 0) {
        throw new Error("Venda nao encontrada");
      }
      console.log("Venda foi deletada com sucesso");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  queryAsync(query) {
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
