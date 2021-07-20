const admin = require('firebase-admin');
const serviceAccount = require("../sockets-4d894-firebase-adminsdk-sdila-140bc100a3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://sockets-4d894-default-rtdb.firebaseio.com/'
});

const db = admin.firestore();

const conected = async(user) => {
    return user
}

/**
 * METODO PARA VER QUIEN ESTA ESCRIBIENDO
 */
const typing = async(user)=> {
    return user
}

 /**
  * METODO PARA GUARDAR LOS MENSAJES EN LA BASE DE DATOS
  * RETURNA EL ULTIMO MENSAJE CORRESPONDIENTE AL USUARIO EMISOR Y RECEPTOR
*/
const send = async (dat) => {

    let d = new Date();
    let now = `${d.getDay()}-${(d.getMonth() + 1)}-${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`;


    let data = {
        idUser: dat.idUser,
        toUser: dat.toUser,
        msg: dat.msg,
        created: now,
        sessionChat: dat.sessionChat,
        viewed: 0 // no visto
    }

    // insert into database
    await db.collection('message').add(data);

    const message = db.collection('message').orderBy('created')

    const getLastMessage = await message.get();

    let jsonDB = [];

    getLastMessage.forEach(doc => {
        if (doc.data().idUser == data.idUser && doc.data().toUser == data.toUser || doc.data().idUser == data.toUser && doc.data().toUser == data.idUser) {
            jsonDB.push(doc.data());
        }
    });
  
    jsonDB = jsonDB[jsonDB.length - 1];
    
    return jsonDB;
}

// METODO PARA MOSTRAR TODOS LOS MENSAJES
const showMessage = async(data)=> {

    const msgRef = db.collection('message').orderBy('created', 'desc')        
    const allMsg = await msgRef.get();
    let jsonDB = [];

    allMsg.forEach(doc => {
        if (doc.data().idUser == data.idUser && doc.data().toUser == data.toUser || doc.data().idUser == data.toUser && doc.data().toUser == data.idUser) {
            jsonDB.push(doc.data());
        }
    });

    return {
        userToken: data.userToken,
        json: jsonDB
    };
}

module.exports = {sendMsg: send, showMessage: showMessage, typing: typing, conected: conected};