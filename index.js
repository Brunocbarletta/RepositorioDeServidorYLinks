/**
 * Configuracion y requisitos:
 * MySQL workbench y MySQLServer
 * Un esquema o base de datos llamada "datospagina"
 * Una tabla llamada "jsonpaginas" con el siguiente formato:
 * [Visitas, ID, Nombre, Link, Url]
 * Dichos campos contendran los datos de este json.
 * [nro de visitas (se inicializa en 1), "un numero identificador" ,"un nombre de la pagina", "direccion de la pagina", "ruta de un icono dentro del proyecto"]
 * ["3","2","google","https://www.google.com.ar/","Fotos/googleIcono.png"];
 */

const express=require('express');
const mysql=require('mysql');
const app=express();
const bodyParser=require('body-parser');

const PORT=process.envPORT||3050;

app.use(bodyParser.json());

//conecto a base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'datospaginas'
});

app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.use(express.static('views')); 
app.use(express.static('public'));

//renderizo ejs (primera solicitud)
///////////////////////Render "html"///////////////////////////
app.get('/',(req, res) => {

    res.render("Test.ejs");
});

app.get('/paginas',(req,res) => {
    const sql = 'SELECT * FROM jsonpaginas';
    connection.query(sql, (error,results) => {
        
        if (error) throw error;

        if (results.length > 0) { 
            res.json(results); 
        } else {
            res.send("not result"); 
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////TESTING ZONE ACTUALIZAR VISITAS/////////////////////////////////
app.put("/actualizar/:id",(req,res) => {
    const {id} = req.params;
    const {Visitas} = req.body;
    const sql = "UPDATE jsonpaginas SET Visitas= '"+Visitas+"' where ID= '"+id+"'";
    connection.query(sql,error => {
        if (error)  throw error;
        res.send("Visitas con ID "+id.toString()+" y "+Visitas.toString()+" visitas actualizada");
    })
});

///////////////////////////////////TESTING ZONE ACTUALIZAR TODOS (resetear)///////////////////////////////////
app.put("/actualizarTodos",(req,res) => {
    const sql="UPDATE jsonpaginas SET Visitas= '"+1+"'";
    connection.query(sql,error => {
        if (error)  throw error;
        res.send("Visitas reseteadas");
    });
 });

//check connect
connection.connect( error => {
    if (error) throw error;
    console.log('funco la conexion!');
});

//Puerto de escucha localhost:3000
app.listen(3000, () => {
    console.log('servidor funcionando');
    console.log(''+__dirname+'');
});