var ws = new WebSocket('ws://127.0.0.1:8086');

var socket = {
    eventos: { connection: new Event('connection') },
    /** Socket event listener
     * @param {String} eventName 
     * @param {Function} cb - callback
     * 
     */
    on(eventName, cb) {

        //crear evento si no existe
        if (!socket.eventos.hasOwnProperty(eventName))
            socket.eventos[eventName] = new Event(eventName);

        document.addEventListener(eventName, function(evt) { cb(evt.data); });

    },

    /**
     * Emite eventos al servidor
     * @param {String} eventName 
     */
    emit(eventName, data = {}) {
        var datos = JSON.stringify({ eventName: eventName, datos: data });
        ws.send(datos);
    }

};


ws.onopen = function() { document.dispatchEvent(socket.eventos.connection); }
ws.onmessage = function(data) {
    var datos = JSON.parse(data.data);

    //si existe el evento
    if (socket.eventos.hasOwnProperty(datos.eventName)) {
        socket.eventos[datos.eventName].data = datos.data;
        document.dispatchEvent(socket.eventos[datos.eventName]);
    }
}
