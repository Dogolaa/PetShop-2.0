const express = require('express')
const app = express();
const cors = require('cors');
const dbServices = require('./dbServices.js')

app.use(cors())
app.use(express.json())


const db = dbServices.getdbServicesInstance();


app.get('/', (request, response) => {
   response.send("Hello, World!") 
});



 app.get('/BuscarClientes', (request, response) => {
    const criterio = request.query.criterio || '';
    const termo = request.query.termo || ''; 
    const result = db.BuscarClientes(criterio, termo); 
    result
        .then(data => response.json(data))
        .catch(err => console.log(err))
});






 app.post('/NovoCliente', (request, response) => {
    const result = db.NovoCliente(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.delete('/DeletarCliente/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarCliente(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });





 app.get('/BuscarProdutos', (request, response) => {
    const criterio = request.query.criterio || '';
    const termo = request.query.termo || ''; 
    const result = db.BuscarProdutos(criterio, termo); 
    result
        .then(data => response.json(data))
        .catch(err => console.log(err))
});





 app.post('/NovoProduto', (request, response) => {
    const result = db.NovoProduto(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.delete('/DeletarProduto/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarProduto(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });




 app.get('/BuscarServicos', (request, response) => {
    const criterio = request.query.criterio || '';
    const termo = request.query.termo || ''; 
    const result = db.BuscarServicos(criterio, termo); 
    result
        .then(data => response.json(data))
        .catch(err => console.log(err))
});

 app.post('/NovoServico', (request, response) => {
    const result = db.NovoServico(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.delete('/DeletarServico/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarServico(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


 app.put('/EditarProduto', (request, response) => {
    const result = db.EditarProduto(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.put('/EditarCliente', (request, response) => {
    const result = db.EditarCliente(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.put('/EditarServico', (request, response) => {
    const result = db.EditarServico(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


 app.get('/BuscarVendas', (request, response) => {
    const result = db.BuscarVendas();
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.post('/NovaVenda', (request, response) => {
    const result = db.NovaVenda(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


 app.delete('/DeletarVenda/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarVenda(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


 app.get('/infohome',(request, response) => {
    const result = db.buscarInformacoesVendas();
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
  });

  app.post('/RotularClientesPremium', async (request, response) => {
    try {
        const result = await db.RotularClientesPremium();
        response.status(200).json(result);
    } catch (error) {
        console.error('Erro ao rotular clientes premium:', error);
        response.status(500).json({ error: 'Erro interno do servidor' });
    }
});



//ATENDIMENTOS


app.get('/BuscarAtendimentos', (request, response) => {
    console.log('Recebida solicitação para buscar atendimentos');
    const result = db.BuscarAtendimentos();
    result
      .then(data => response.json(data))
      .catch(err => {
        console.log(err);
        response.status(500).json({ error: 'Internal Server Error' });
      });
  });
  

 app.post('/NovoAtendimento', (request, response) => {
    const result = db.NovoAtendimento(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


 app.put('/EditarAtendimento', (request, response) => {
    const result = db.EditarAtendimento(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


 app.delete('/DeletarAtendimento/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarAtendimento(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });



 // Profissionais

 app.get('/BuscarProfissional', (request, response) => {
    const criterio = request.query.criterio || '';
    const termo = request.query.termo || ''; 
    const result = db.BuscarProfissional(criterio, termo); 
    result
        .then(data => response.json(data))
        .catch(err => console.log(err))
});


 app.post('/NovoProfissional', (request, response) => {
    const result = db.NovoProfissional(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.delete('/DeletarProfissional/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarProfissional(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });
 app.put('/EditarProfissional', (request, response) => {
    const result = db.EditarProfissional(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });



//Fornecedor
app.get('/BuscarFornecedor', (request, response) => {
    const criterio = request.query.criterio || '';
    const termo = request.query.termo || ''; 
    const result = db.BuscarFornecedor(criterio, termo); 
    result
        .then(data => response.json(data))
        .catch(err => console.log(err))
});






 app.post('/NovoFornecedor', (request, response) => {
    const result = db.NovoFornecedor(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });

 app.delete('/DeletarFornecedor/:id', (request, response) => {
    const id = request.params.id;
    const result = db.DeletarFornecedor(id);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });
 app.put('/EditarFornecedor', (request, response) => {
    const result = db.EditarFornecedor(request.body);
    result
        .then(data=> response.json(data))
        .catch(err => console.log(err))
 });


app.get('/teste', (request, response) => {
    response.send("EndPoint de teste!")
 });

app.listen(8080, () => {
    console.log("Server is running on port 8080")
});