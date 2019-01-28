const express = require('express');
const cors = require('cors');
const sql = require('mysql');
const bodyParser = require('body-parser');

//////////////////////////////////////////END IMPORT ////////////////////////////////////////////////
const app = express();
const port = 1997;
/////////////////////////////////////////END VARIABEL PUBLIC/////////////////////////////////////////

const conn = sql.createConnection({
    host: 'localhost',
    user: 'ignatius',
    password: 'fernando08',
    database: 'moviebertasbih',
    port: 3306
})
//////////////////////////////////////END CONEKSI KE DATABASE MYSQL WORKBENCH/////////////////////////

app.use(bodyParser.json());
app.use(cors());

////////////////////////////////////START GET //////////////////////////////////////////////////
app.get('/',(req,res)=>{
    res.send("<h1>HOME API</h1>");/////GET HOME API////////////////////////////////////////////////
})

app.get('/getListMovie',(req,res)=>{
    var sql = `select * from movies`

    conn.query(sql, (err, result) => {/////GET LIST MOVIE/////////////////////////////////////
        if (err) throw err; 
        res.send(result);
    })
})
app.get('/getListCategories',(req,res)=>{
    var sql = `select * from categories`

    conn.query(sql, (err, result) => {////////////////GET LIST CATEGORIE////////////////
        if (err) throw err; 
        res.send(result);
    })
})

app.get('/getListMovieCategorie',(req,res)=>{
    var sql = `select m.nama as movie, c.nama as category from 
    movies m join categories c where (m.id = (select idmovie from movcat) and c.id =(select idcategory from movcat))`

    conn.query(sql, (err, result) => {////////////////GET LIST CONNECT MOVIE DENGAN CATEGORIE////////////////
        if (err) throw err; 
        res.send(result);
    })
})
//////////////////////////////////////////END METHOD GET /////////////////////////////////////////
/////////////////////////////////////////START METHOD POST//////////////////////////////////////
app.post('/addMovie', (req,res) => {
    var sql = ` INSERT into movies SET ? `;  
    conn.query(sql,(err, result) => {////////////ADD TABLE MOVIES//////////////////////////
        if(err) throw err ;
        res.send(result);
    })
})
app.post('/addCategories', (req,res) => {
    var sql = `insert into categories set ?`;  
    conn.query(sql,(err, result) => {///////////////ADD TABLE CATEGORIES//////////////////
        res.send(result);
    })
})

app.post('/addMovieCategorie', (req,res) => {
    var idMovie = req.body.idMovie;
    var idcategory = req.body.idcategory;
    var sql = `insert into movcat select m.id as idmovie ,c.id as idcategory from movies m join categories c on c.id
    where (m.id ='${idMovie}' and c.id ='${idcategory}');`;  
    
    conn.query(sql,(err, result) => {///////////ADD TABLE LIST MOvCAT//////////////////
        if(err) throw err;
        res.send(result);
    })
})
//////////////////////////////////END METHOD POST//////////////////////////////////////////
/////////////////////////////////START Method PUT(EDIT)////////////////////////////////////
app.put('/editMovies/:id',(req,res)=>{
    var MovieId = req.params.id;
    var sql =`SELECT * from movies where id = ${MovieId};`;
    conn.query(sql, (err, result) => {//////////EDIT TABLE MOVIE/////////////////////////
        if(err) throw err;
        const data = JSON.parse(req.body.data);
        sql = `Update movies set nama='${data.nama}' where id = ${MovieId};`
    })
})

app.put('/editCategories/:id',(req,res)=>{
    var CategoryId = req.params.id;
    var sql =`SELECT * from categories where id = ${CategoryId};`;
    conn.query(sql, (err, result) => {//////////EDIT TABLE Categories///////////////////
        if(err) throw err;
        const data = JSON.parse(req.body.data);
        sql = `Update categories set nama='${data.nama}' where id = ${CategoryId};`
        res.send(result);
    })
})
/////////////////////////////////END METHOD PUT(EDIT)//////////////////////////////////////
/////////////////////////////////START METHOD DELETE///////////////////////////////////////
app.delete('/deleteMovie/:id',(req,res)=>{
    var sql =``;
    conn.query(sql, (err, result) => {//////////DELETE TABLE MOVIE///////////////////
        if(err) throw err;
        res.send(result);
    })
})

app.delete('/deleteCategorie/:id',(req,res)=>{
    var sql =``;
    conn.query(sql, (err, result) => {//////////DELETE TABLE CATEGORIE///////////////////
        if(err) throw err;
        res.send(result);
    })
})

app.delete('/deleteMoviesCategorie',(req,res)=>{
    var sql =``;
    conn.query(sql, (err, result) => {//////////DELETE TABLE MOVIE CATEGORIE///////////////////
        if(err) throw err;
        res.send(result);
    })
})
/////////////////////////////////END METHOD DELETE///////////////////////////////////////
app.listen (port,()=>console.log('api aktif di port '+ port ))