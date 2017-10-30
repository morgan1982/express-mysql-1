const express = require('express');
const path = require('path');
const mysql = require('mysql');
// import { user, pass } from './gredentials'
const cred = require('./credentials');

// credentials
user = cred.user;
pass = cred.pass;
host = cred.host;
database = cred.database;

// init app
const app = express();

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//connection to the database
const db = mysql.createConnection({
    host: host,
    port: 3306,
    user: user,
    password: pass,
    database: database,
    debug: false
});


db.connect((err) => {
    if(err) {
        throw err;

    }
    console.log('MySql Connected..');
});

// Table creation
app.get('/createtable', (req, res) => {
    let table = "blog"
    let sql = `CREATE TABLE ${table} (id int AUTO_INCREMENT, title varchar(20), author varchar(20), body varchar(255), PRIMARY KEY(id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('table ' + table + ' created')
    })
})
//insert post to the table
app.get('/insertpost/', (req, res) => {
    let table = "blog";

})

// Fetch data from database
app.get('/getposts', (req, res) => {
    let sql = 'select * from blog';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send('POsts fetched...');
    });
});

// select single post
app.get('/getpost/:id', (req, res) => {
    let index = req.params.id - 1
    let sql = `SELECT * FROM blog WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log(result[index].title);
        let post = {
            id: result[index].id,
            title: result[index].title,
            author: result[index].author,
            body: result[index].body
        }
        let context = {
            post: post
        } 
        console.log(post);
        res.render('posts', {post: post});
    });
});



//Home route
app.get('/', (req, res) => {
    let articles = [
        {
            id:1,
            title: 'Article 1',
            author: 'Entropy',
            body: 'This is article 1'
        },
        {
            id:2,
            title: 'Article 2',
            author: 'Entropy',
            body: 'This is article 2'
        },
        {
            id:3,
            title: 'Article 3',
            author: 'Entropy',
            body: 'This is article 3'
        }
    ]
    let name = "entropy";
    res.render("index", {
        name: name,
        articles: articles
    });
});
//Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

db.end();

app.listen('3000', () => {
    console.log("Server started at port 3000...")
})