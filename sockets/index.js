const sockets_id = new Map();

  const main = (socket) => {


	/**
	 * event: nombre del evento
	 * controller: nombre del controlador
	 * metod: metodo 
	 * 
	 */
  	let sockets = [
			{ event: 'sendText', controller: 'chat', method: 'sendMsg' },
			{ event: 'viewed', controller: 'chat', method: 'viewed' },
			{ event: 'showMessage', controller: 'chat', method: 'showMessage' },
			{ event: 'typing', controller: 'chat', method: 'typing'},	
			{ event: 'conected', controller: 'chat', method: 'conected'},
			{ event: 'sendComment', controller: 'comment', method: 'pComment'}

  	]


  	for(let x in sockets){
  		socket.on(sockets[x].event, (data) => { require('./socket_core')(socket, data, `./../controllers/${sockets[x].controller}`, sockets[x].method, sockets[x].event); });	
  	}

  	   socket.on('disconnect', () => {
          if (sockets_id.has(socket.id))
               sockets_id.delete(socket.id);
     	});
  }

  module.exports = main;