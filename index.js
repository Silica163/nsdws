const http = require('http');
const path = require('path');
const fs = require('fs');
const config = require("./config.json")
const {getContentType} = require('./server/content-type.js')

const server = http.createServer();


var serverMsg = function(status,method,pathname){
    var dt = new Date()
    var color ={
        404:"\x1b[31m",
        200:"\x1b[32m"
    }
    console.log(`[${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}] [${color[status]} ${status}\x1b[39m ] [${color[status]} ${method}\x1b[39m ] ${pathname}`)
};

server.on('request',(req,res)=>{
	req.on("data",buffer=>{
	console.log('---recieve data---')
		console.log(buffer.toString())
		req.on("end",()=>{console.log("---END---")});
	});
	const url = new URL("http://"+req.headers.host+req.url);
	var reqFile = path.join('./static/',url.pathname),fileExt = path.extname(reqFile),data;
	if(!fs.existsSync(reqFile)){
		res.writeHead(404);
		res.end(http.STATUS_CODES[404]);
		serverMsg(res.statusCode,req.method,url.toString());
		return;
	};
	if(reqFile.endsWith("/")) reqFile += 'index.html';
	data = fs.readFileSync(reqFile);
	res.setHeader('Content-type',getContentType(fileExt)||'text/html');
	res.writeHead(200);
	res.end(data);
	serverMsg(res.statusCode,req.method,url.toString());
});

// listen to 127.0.0.1 port 8080
server.listen(config,()=>{
	console.log('server running at',server.address())
});