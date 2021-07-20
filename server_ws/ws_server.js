const main = (ws, wss) => {

    // El objeto debe estar en un ambito interno a la funcion para que no emita varios eventos a la vez
    const events = require('events');
    const eventEmitter = new events.EventEmitter();


    const id = require('uuidv1')(); //id unico del socket
    ws.id = id;

    const socket = {
        id: id, //id unico del socket
        destinyId: null, //id de otro socket, al que se emitira el evento

        eventos: new Set(['connection']),
        /** Socket event listener
         * @param {String} eventName 
         * @param {Function} cb - callback
         * 
         */

        on(eventName, cb) {
            if (!socket.eventos.has(eventName))
                eventEmitter.on(eventName, (data) => { cb(data); });

            socket.eventos.add(eventName);
        },

        /**
         * Emite eventos al cliente
         * @param {String} eventName 
         */
        emit(eventName, data = {}) {
            const socketID = socket.destinyId || socket.id;
            //posiblemente no sea muy eficiente para gran escala
            wss.clients.forEach(client => {
                /*
                MEJORAR ENVIO DE EVENTOS AL CHAT
                */
                
                //if (client.id == socketID) {
                    const datos = JSON.stringify({ eventName: eventName, data: data});
                    client.send(datos);
                //}
            });

            if (socket.destinyId) socket.destinyId = null; //resetear el id de destino
        },

        /**
         * Establece el destino para el proximo evento
         */
        to(id) {
            socket.destinyId = id;
            return socket;
        }

    };

    // disparar evento disconnect
    ws.onclose = ({ target }) => {
        eventEmitter.emit('disconnect');
    };

    ws.onmessage = ({ data, target }) => {
        const { eventName, datos } = JSON.parse(data);
        eventEmitter.emit(eventName, datos);
    };

    return socket;
};

module.exports = main;