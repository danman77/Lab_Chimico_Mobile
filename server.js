var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
var jwt= require('jsonwebtoken');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
const base64 = require('base64topdf');
var fs = require('fs');
var url='mongodb://127.0.0.1:27017';
var secretKey = "Alfa159jtdm!!*"
var db1    = new mongodb.Db('lab', new mongodb.Server("127.0.0.1", 27017));
var gfs = Grid(db1, mongodb);
var app = express()
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
     if ('OPTIONS' === req.method) {
        res.status(204).send();
    }
    else {
        next();
    }
});
app.use('/report', express.static('report'))
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

// rotta per ottenere la lista delle richieste aperte

app.get('/richiesteAperte',function(req,res)
{
    
    mongodb.connect(url,function(err,db)
{
    db.db('lab').collection('richieste').find({stato:0,utente:ObjectId(req.query.id)}).toArray(function(err,risultato)
{
    res.json(risultato)
})
})
})

// rotta per ottenere il numero delle richieste aperte

app.get('/numRichiesteAperte',function(req,res)
{
    mongodb.connect(url,function(err,db)
    {
        db.db('lab').collection('richieste').find({stato:0,utente:ObjectId(req.query.id)}).count(function(err,numero)
    {
        
        res.json(numero)
    })
        
    
    })
})

// rotta per ottenere la lista delle richieste chiuse 

app.get('/richiesteChiuse',function(req,res)
{
    mongodb.connect(url,function(err,db)
{
    db.db('lab').collection('richieste').find({stato:1,utente:ObjectId(req.query.id)}).toArray(function(err,risultato)
{
    res.json(risultato)
})
})
})


// rotta per generare il report nella cartella temporanea di node

app.get('/getReport', function (req, res) {
    data= new Date()
    datafile=data.getDay().toString()+data.getMonth().toString()+data.getYear().toString()+data.getHours().toString()+data.getMinutes().toString()+data.getSeconds()
    nomefile='report'+datafile+'.pdf'
    mongodb.connect(url,function(err,db)
    {
        db.db('lab').collection("richieste").find({ _id: ObjectId(req.query.idrichiesta) }).toArray(function(err,report)
        {
            fs.writeFile('./report/'+nomefile,report[0].report.buffer)
            
        })
    })
    res.json({file:nomefile})
    
})
    
    

//rotta per effettuare l'autenticazione e generare il token di accesso

app.get('/authentication',function(req,res)
{
mongodb.connect(url,function(err,db)
{
    db.db('lab').collection('users').findOne({email:req.query.user},function(err,utente)
{
    
    if(req.query.password==null || req.query.user==null || !utente)
        {
             
            res.sendStatus(403)
        }else
        {
            
    bcrypt.compare(req.query.password, utente.password, function (err1, res2) {
        if (res2)
            {
               
                jwt.sign({id: utente._id,email:utente.email,nome:utente.nome,cognome:utente.cognome},secretKey,{ expiresIn: 460 },function(err,token)
            {
                
                res.json({tkn:token})
                
            })
            }
        else 
            {
                
                res.sendStatus(403)
            }
    })
        }
})
})
})

// Express inizializzazione del server web sulla porta 8080

app.listen('8080', function (err) {
    if (err) {
        console.log("error 505");
    }
    
})