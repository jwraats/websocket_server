var ws = require("nodejs-websocket")

var orientatedSide = []; 
var connections = 0;

var server = ws.createServer(function (conn) {
    connections++;
    var id = connections;
    conn.on("text", function (str) {
        if(str == "getList"){
		sendList(conn)
	}else{
		orientatedSide[id] = str
  		sendChange();
	} 
    });

    conn.on("close", function (code, reason) {
       	orientatedSide[id] = null;
    });

}).listen(1337)

function sendList(conn){
	orientatedSide.forEach(function(entry, i) {
		conn.sendText("Connectie ["+i+"]: "+entry);
	});
}

function sendChange(){
	broadcast(server, "isGreen: '"+checkIfAllSame()+"'");
}

function checkIfAllSame(){
	var same = true;
	var oldEntry = null;
	orientatedSide.forEach(function(entry) {
    		if(oldEntry != null && entry != oldEntry){
			same = false;
		}
		oldEntry = entry;
	});
	return same;
}

function broadcast(server, msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}
