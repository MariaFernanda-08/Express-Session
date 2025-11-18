const express = require('express')
const mysql = require('mysql2/promise')
var session = require('express-session')
const path = require('path')

const conn = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"produtos_de_limpeza"
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(
    session({
    secret: 'AgV*1c$B!25',
    resave: false,
    saveUninitialized: false
}))

const produto = []

app.listen(3000)

//TELA LOGIN
app.get('/', (req,res) => {
    
    const existe = req.session.usuario 
    if(existe){
        res.sendFile(__dirname + "/ui/html/index.html") 
    }else{
        res.redirect("/login")
    }
    
})

app.get('/login', (req,res) => {
    res.sendFile(__dirname + "/ui/html/login.html")
})

app.post('/login', (req,res) => {
    const {usuario, senha} = req.body

    if(usuario == "Maria Fernanda" && senha == "0909"){ 
        req.session.usuario = usuario;

        res.redirect("/")
    }else{
        res.redirect("/login")
    }
})

app.get('/sair', (req,res) =>{
    req.session.destroy()
    res.redirect('/login')
})

//CADASTRA O PRODUTO
app.post("/produtos", async (req,res) =>{ 
    const {nome,marca,volume,tipo_embalagem,aplicacao,estoque,estoque_minimo} = req.body

    produto.push({
        nome, 
        marca,
        volume,
        tipo_embalagem,
        aplicacao,
        estoque,
        estoque_minimo     
    })

    try { 
        res.sendFile(__dirname + "/ui/html/cadastro.html")
        const sql = "INSERT INTO cadastro_produtos (nome,marca,volume,tipo_embalagem,aplicacao,estoque,estoque_minimo) VALUES (?,?,?,?,?,?,?);"
         
        await conn.query(sql, [nome,marca,volume,tipo_embalagem,aplicacao,estoque,estoque_minimo])
        
        res.json({
            msg:"Produto cadastrado"
        })
    } catch (error){
        console.error(error)
        res.status(500).json({ erro: "Erro no servidor"})
    }
})


//LISTA OS PRODUTOS
app.get("/lista", (req,res) =>{
    res.sendFile(__dirname + "/ui/html/lista.html")
})

app.get("/api/produtos", async(req,res) =>{
   try{
        const mysql2 = "SELECT id_produto,nome,marca,volume,tipo_embalagem,aplicacao,estoque,estoque_minimo FROM cadastro_produtos;"
        
        const [produtoLista] = await conn.query(mysql2)
        
        res.json({
            produto: produtoLista
        }) 
        
    } catch (error){
        console.log(error)
        res.status(500).json({erro: "Erro no servidor"})
    }   
})

//ENTRADA NO ESTOQUE
app.put("/estoque/entrada", (req,res) =>{
    res.sendFile(__dirname + "/ui/html/entrada.html")
})

//SAIDA NO ESTOQUE
app.put("/estoque/saida", (req,res) =>{
    res.sendFile(__dirname + "/ui/html/saida.html")
})

//ALERTA DE ESTOQUE
app.get("/alerta", (req,res) =>{
    res.send(__dirname + "/ui/html/alerta.html")
})