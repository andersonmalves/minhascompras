const express = require('express');
const app = express();

const bodyParser = require('body-parser')

const sqlite = require('sqlite');
const dbConnection = sqlite.open('banco.sqlite', { Promise })

app.set('view engine', 'ejs')
app.use(express.static('public')) // pasta pública
app.use(bodyParser.urlencoded({ extended: false }))

const init = async() => {
    const db = await dbConnection
    await db.run('create table if not exists tb_itens (id INTEGER PRIMARY KEY, item TEXT);')
}

init()

// exibir lista
app.get('/', async(request, response) => {
    // console.log('Acesso em ' + new Date())
    const db = await dbConnection
    const itens = await db.all('select * from tb_itens')
    response.render('home', { itens })
    // response.send(request.body)
});

// adicionar item
app.post('/addItem', async(request, response) => {
    const { novoItem } = request.body
    const db = await dbConnection
    await db.run(`insert into tb_itens(item) values('${novoItem}')`)
    response.redirect('/')
});

// remover item
app.get('/delItem/:id', async(request, response) => {
    const db = await dbConnection
    await db.run('delete from tb_itens where id = ' + request.params.id)
    response.redirect('/')
});

// iniciar escuta na porta 3000
app.listen(3000, (err) => {
    if(err){
        console.log('Não foi possível iniciar o servidor do Jobify')
    } else {
        console.log('Servidor do Jobify rodando...')
    }
});