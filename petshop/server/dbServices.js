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

  async BuscarClientes(criterio, termo) {
    let query = "SELECT * FROM tbl_clientes";

    if (termo) {
      query += ` WHERE nome LIKE '%${termo}%'`;
    }

    if (criterio) {
      switch (criterio) {
        case "nome":
          query += " ORDER BY nome";
          break;
        case "telefone":
          query += " ORDER BY telefone";
          break;
        case "endereco":
          query += " ORDER BY endereco";
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

  async NovoCliente(data) {
    try {
      const query =
        "INSERT INTO tbl_clientes (nome,email,telefone,endereco) VALUES (?,?,?,?)";
      const nome = data.nome;
      const email = data.email;
      const telefone = data.telefone;
      const endereco = data.endereco;

      const response = await new Promise((resolve, reject) => {
        connection.query(
          query,
          [nome, email, telefone, endereco],
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

  async BuscarServicos(criterio, termo) {
    let query = "SELECT * FROM tbl_servicos";

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
        case "duracao":
          query += " ORDER BY duracao";
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

  async NovoServico(data) {
    try {
      const query =
        "INSERT INTO tbl_servicos (nome,preco,duracao) VALUES (?,?,?)";
      const nome = data.nome;
      const preco = data.preco;
      const duracao = data.duracao;

      const response = await new Promise((resolve, reject) => {
        connection.query(query, [nome, preco, duracao], (err, result) => {
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
      isFirstSet = false;
    }
    if (data.telefone != null || data.telefone != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `telefone = ?`;
      values.push(data.telefone);
      isFirstSet = false;
    }
    if (data.endereco != null || data.endereco != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `endereco = ?`;
      values.push(data.endereco);
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
      isFirstSet = false;
    }

    if (data.duracao != null || data.duracao != undefined) {
      if (!isFirstSet) {
        query += ",";
      }
      query += `duracao = ?`;
      values.push(data.duracao);
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
        "INSERT INTO tbl_vendas (id_cliente,data, id_produto, id_servico) VALUES (?,NOW(), ?, ?)"; // 'NOW()' insere a data atual
  
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
      console.log("Venda inserida com sucesso");
      return response;
    } catch (error) {
      console.log("Erro ao inserir venda: " + error);
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

  async queryAsyncParams(query, params) {
    try {
      return new Promise((resolve, reject) => {
        connection.query(query, params, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }
  

  async buscarInformacoesVendas() {
    try {
      // Consulta para obter informações de produtos vendidos
      const queryProdutos = `
        SELECT tbl_produtos.id, tbl_produtos.preco
        FROM tbl_produtos
        JOIN tbl_vendas ON FIND_IN_SET(tbl_produtos.id, tbl_vendas.id_produto)
      `;
      const produtos = await this.queryAsync(queryProdutos);
  
      // Consulta para obter informações de serviços vendidos
      const queryServicos = `
        SELECT tbl_servicos.id, tbl_servicos.preco
        FROM tbl_servicos
        JOIN tbl_vendas ON FIND_IN_SET(tbl_servicos.id, tbl_vendas.id_servico)
      `;
      const servicos = await this.queryAsync(queryServicos);
  
      // Calcular faturamento total de produtos
      const faturamentoProdutos = produtos.reduce(
        (total, produto) => total + parseFloat(produto.preco),
        0
      );
  
      // Calcular faturamento total de serviços
      const faturamentoServicos = servicos.reduce(
        (total, servico) => total + parseFloat(servico.preco),
        0
      );
  
      const resultadoFinal = {
        valorProdutos: faturamentoProdutos,
        valorServicos: faturamentoServicos,
      };
  
      return resultadoFinal;
    } catch (error) {
      throw error;
    }
  }

  
  async RotularClientesPremium() {
    try {
      // Calcula a média de gastos em produtos
      const queryMediaGastosProdutos = `
        SELECT AVG(total_gastos) AS media_gastos_produtos
        FROM (
          SELECT id_cliente, COALESCE(SUM(preco), 0) AS total_gastos
          FROM tbl_vendas
          JOIN tbl_produtos ON FIND_IN_SET(tbl_produtos.id, tbl_vendas.id_produto)
          GROUP BY id_cliente
        ) AS gastos_clientes
      `;
      const resultMediaGastosProdutos = await this.queryAsyncParams(queryMediaGastosProdutos, []);
      const mediaGastosProdutos = resultMediaGastosProdutos[0]?.media_gastos_produtos || 0;
  
      console.log('Média de Gastos em Produtos:', mediaGastosProdutos);
  
      // Atualiza os clientes para 'Premium' se o total gasto for maior que a média global e todos os gastos em produtos forem maiores que a média em produtos
      const queryAtualizarClientes = `
        UPDATE tbl_clientes AS c
        SET c.tipo = 'Premium' 
        WHERE c.id IN (
          SELECT g.id_cliente 
          FROM (
            SELECT id_cliente, COALESCE(SUM(preco), 0) AS total_gasto_produtos
            FROM tbl_vendas 
            JOIN tbl_produtos ON FIND_IN_SET(tbl_produtos.id, tbl_vendas.id_produto) 
            GROUP BY id_cliente
          ) AS g
          WHERE g.total_gasto_produtos > ?
        )
      `;
  
      console.log('Query de Atualização de Clientes:', queryAtualizarClientes);
  
      const resultAtualizarClientes = await this.queryAsyncParams(queryAtualizarClientes, [mediaGastosProdutos]);
  
      console.log('Resultados da Atualização de Clientes:', resultAtualizarClientes);
  
      return resultAtualizarClientes;
    } catch (error) {
      console.error('Erro ao rotular clientes como Premium:', error);
      throw error;
    }
  }
  
  
  
  
  
  
  
  
  

  
}

module.exports = dbServices;
