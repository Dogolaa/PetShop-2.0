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
    const result = db.BuscarClientes();
    result
        .then(data=> response.json(data))
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
    const result = db.BuscarProdutos();
    result
        .then(data=> response.json(data))
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
    const result = db.BuscarServicos();
    result
        .then(data=> response.json(data))
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




app.get('/teste', (request, response) => {
    response.send("EndPoint de teste!")
 });

app.listen(8080, () => {
    console.log("Server is running on port 8080")
});