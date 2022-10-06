const { response } = require('express');
const express = require('express');
const app = express();
const {logger} = require('./middleware/logEvents'); 
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const PORT = process.env.PORT || 3500;


//custom middleware logger
app.use(logger);

//handle options credentials check - before cors!
// and fetch cookies credentials requirement.
app.use(credentials);

//cross origin resourse sharing
app.use(cors(corsOptions));

//builtin middleware to handle urlencoded from data.
app.use(express.urlencoded({extended:false}));

//builtin middleware for json
app.use(express.json());

//middleware for cookies.
app.use(cookieParser());

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')));
//use static files for subdir also
//app.use('/subdir',express.static(path.join(__dirname,'/public')));

app.use('/',require('./routes/root'));
//app.use('/subdir',require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));


//verifying JWT for /teachers route
app.use(verifyJWT);
app.use('/teachers',require('./routes/api/teachers'));

app.all('*/',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error : "404 Not found"});
    }else{
        res.type('txt').send("404 not found");
    }
});

app.use(errorHandler);

app.listen(PORT,()=>console.log(`server started on port ${PORT}`));




//route handlers
// app.get('/hello(.html)?',(req,res,next)=>{
//     console.log('attempted to load hello.html');
//     next();
// },(req,res)=>{
//     res.send("hello world");
// });
// //chaining 
// const one = (req,res,next) => {
//     console.log('one');
//     next();
// }
// const two = (req,res,next) => {
//     console.log('two');
//     next();
// }
// const three = (req,res,next) => {
//     console.log('three');
//     res.send('Finished');
// }

// app.get('/chain(.html)?',[one, two, three]);


// const http = require('http');
// const path = require('path');
// const fs = require('fs');
// const fsPromises = require('fs').Promises;

// const logEvents = require('./logEvents');
// const EventEmitter = require('events');
// const { contentType } = require('express/lib/response');
// const { response } = require('express');

// class Emitter extends EventEmitter {};

// //intialize object 
// const myEmitter = new Emitter();  

// const PORT = process.env.PORT || 3500;

// const serveFile = async(filePath, contentType, response) => {
//     try{
//         const data = await fsPromises.readFile(filePath,'utf8');
//         response.writeHead(200,{'contentType':contentType});
//         response.end(data);
//     }catch(err){
//         console.log(err);
//         response.statusCode = 500;
//         response.end();
//     }
// }

// const server = http.createServer((req,res) =>{
//     console.log(req.url,req.method);
//     const extension = path.extname(req.url);
//     let contentType;

//     switch(extension){
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.js':
//             contentType = 'text/javascript';
//             break;
//         case '.json':
//             contentType = 'application/json';
//             break;
//         case '.jpg':
//             contentType = 'image/jpeg';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.txt':
//             contentType = 'text/plain';
//             break;
//         default:
//             contentType = 'text/html';
//     }

//     let filePath = 
//         contentType === 'text/html' && req.url==='/'
//             ? path.join(__dirname, 'views', 'index.html')
//             : contentType === 'text/html' && req.url.slice(-1)==='/'
//                 ? path.join(__dirname,'views',req.url,'index.html')
//                 : contentType === 'text/html'
//                     ?path.join(__dirname,'views',req.url)
//                     :path.join(___dirname,req.url);
    
//     if(!extension && req.url.slice(-1) !== '/') 
//         filePath += '.html';
//     const fileExists = fs.existsSync(filePath);
//     if(fileExists){
//         //serve the file
//         serveFile(filePath,contentType,res);
//     }else{
//         //404
//         //301 ewdirect
//         switch(path.parse(filePath).base){
//             case 'old-page.html':
//                 res.writeHead(301,{'Location':'/new-page.html'});
//                 res.end();
//                 break;
//             case 'new-page.html':
//                 res.writeHead(301,{'Location': '/'});
//                 res.end();
//                 break;
//             default:
//                 serveFile(path.join(__dirname,'views','404.html'),'text/html',res);
//         }
//         console.log(path.parse(filePath));
//     }

// switch(req.url){
//     case '/':
//         res.statusCode = 200;
//         res.setHeader('content-Type','text/html');
//         path = path.join(__dirname,'views','index.html');
//         fs.readFile(path,'utf8',(err,data)=>{
//         res.sendDate(data);
//     })
// }
// if(req.url=="/" || req.url=== 'index.html'){
//     res.statusCode = 200;
//     res.setHeader('content-Type','text/html');
//     path = path.join(__dirname,'views','index.html');
//     fs.readFile(path,'utf8',(err,data)=>{
//         res.sendDate(data);
//     })
// }
//});

//server.listen(PORT,()=>console.log(`server started on port ${PORT}`));

// //add listener for the log event
// myEmitter.on(`log`, (msg)=>logEvents(msg));

// setTimeout(()=>{
//     //emit event
//     myEmitter.emit('log', 'Log event emitted!');
// },2000);