const main = async(socket, data, controller, method, event) => {
const controlador = require(`${controller}`);
     const resp = await controlador[`${method}`](data);
     console.log(resp);
     socket.emit(event, resp);
}
module.exports = main;