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
    var {nama,tahun,description} = req.body;
    var sql = ` INSERT into movies values(null,'${nama}','${tahun}','${description}') `;  
    conn.query(sql,(err, result) => {////////////ADD TABLE MOVIES//////////////////////////
        if(err) throw err ;
        res.send(result);
    })
})
app.post('/addCategories', (req,res) => {
    var {nama} = req.body
    var sql = `insert into categories values(null,'${nama}')`;  
    conn.query(sql,(err, result) => {///////////////ADD TABLE CATEGORIES//////////////////
        res.send(result);
    })
})

app.post('/addMovCat', (req,res) => {
    var {idmovie, idcategory} = req.body;
    var sql = `insert into movcat values ('${idmovie},'${idcategory}');`;  
    
    conn.query(sql,(err, result) => {///////////ADD TABLE LIST MOvCAT//////////////////
        if(err) throw err;
        res.send(result);
    })
})
//////////////////////////////////END METHOD POST//////////////////////////////////////////
/////////////////////////////////START Method PUT(EDIT)////////////////////////////////////
app.put('/editMovies/:id',(req,res)=>{
    var MovieId = req.params.id;
    var {nama = "", tahun ="", description=""} = req.body

    var sql =`SELECT * from movies where id = ${MovieId};`;

    conn.query(sql, (err, result) => {//////////EDIT TABLE MOVIE/////////////////////////
        if(err) throw err;
        if(result.length>0){
            if(nama == ""){nama = result[0].nama}
            if ( tahun == ""){tahun = result[0].tahun}
            if(description =="") {description == result[0].description};
        }
        sql = `Update movies set nama='${nama}',tahun ='${tahun}',
        description ='${description}' where id = ${MovieId};`
    })
})

app.put('/editCategories/:id',(req,res)=>{
    var CategoryId = req.params.id;
    var {nama} = req.body

    var sql =`SELECT * from categories where id = ${CategoryId};`;

    conn.query(sql, (err, result) => {//////////EDIT TABLE Categories///////////////////
        if(err) throw err;
        sql = `Update categories set nama='${nama}' where id = ${CategoryId};`
        res.send(result);
    })
})
/////////////////////////////////END METHOD PUT(EDIT)//////////////////////////////////////
/////////////////////////////////START METHOD DELETE///////////////////////////////////////
app.delete('/deleteMovie/:id',(req,res)=>{
    var idMovie = req.params.id
    var sql =`Delete from movies where id ='${idMovie}';`;
    conn.query(sql, (err, result) => {//////////DELETE TABLE MOVIE///////////////////
        if(err) throw err;
        sql = `delete from movcat where idmovie='${idMovie}';`;
        conn.query(sql,(err1,result1)=>{
            if(err1) throw err1;
            res.send(result1);
        })
        res.send(result);
    })
})

app.delete('/deleteCategorie/:id',(req,res)=>{
    var idCategory = req.params/id
    var sql =`delete from categories where id = '${idCategory}';`;
        conn.query(sql, (err, result) => {//////////DELETE TABLE CATEGORIE///////////////////
        if(err) throw err;
        sql = `delete from movcat where idcategory ='${idCategory}';`;
        conn.query(sql,(err1,result1)=>{
            if(err1) throw err1;
            res.send(result1);
        })
        res.send(result);
    })
})

app.delete('/deleteMovCat',(req,res)=>{
    var {idcategory, idmovie} = req.body
    var sql =`delete from movcat where idmovie = ${idmovie}and idcategory ='${idcategory}'`;
    conn.query(sql, (err, result) => {//////////DELETE TABLE MOVIE CATEGORIE///////////////////
        if(err) throw err;
        res.send(result);
    })
})
/////////////////////////////////END METHOD DELETE///////////////////////////////////////
app.listen (port,()=>console.log('api aktif di port '+ port ))