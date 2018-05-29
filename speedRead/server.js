let fs = require('fs');
let express = require('express');
let app = express();

//for heroku -> process.env.PORT
let server = app.listen(process.env.PORT || 3000, () => {
	let host = server.address().address || "localhost";
	let port = server.address().port;
	console.log('spreeder app listening at http://' + host + ':' + port);
});

app.use(express.static('public'));

//socket
let io = require('socket.io')(server);
io.sockets.on('connection', (socket) =>{	
	let sprecord = require('./public/files/sprecord.json');
	io.to(socket.id).emit('record', sprecord);

	socket.on('record', (data)=> {
		// Data comes in as whatever was sent, including objects
		sprecord = merge(sprecord, data);
	
		// Send it to all other clients
		socket.broadcast.emit('record', sprecord);
	});

	socket.on('disconnect', ()=>{
		const record = JSON.stringify(sprecord);
		fs.writeFile("./public/files/sprecord.json", record, 'utf8', (err) =>{
    	if (err) {
        return console.log(err);
    	}
		}); 
	});
});

function merge(d1, d2) {
	for (let k2 in d2){
		if(d1.hasOwnProperty(k2)){
			d1[k2] += d2[k2];
		} else {
			d1[k2] = d2[k2];
		}
	}
	return d1;
}