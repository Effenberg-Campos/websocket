// const idUser = document.getElementById('idUser');
// const toUser = document.getElementById('toUser');
const boxMsg = document.getElementById('boxMsg'); 
const textBox = document.getElementById('textBox');
const actions = document.getElementById('actions');
const itemUser = document.getElementsByClassName('itemUser');
const userConected = document.getElementsByClassName('status');
let countEvent = 0;

socket.on('connection', function () {
    console.log('conectado');
    
    let conected = sessionStorage.getItem("idUser");
    socket.emit('conected', conected);
});

/** 
 * EVENTO EMIT PARA SABER CUANDO EL USUARIO ESTA TYPEANDO
*/
textBox.addEventListener('keypress', function () {
    let data = {
        idUser: sessionStorage.getItem("idUser"),
        actionTyping: sessionStorage.getItem("userEmisor")

    }
    socket.emit('typing', data);
})

/** 
 * EVENTO EMIT PARA GUARDAR LOS DATOS DEL MENSAJE A LA DB
*/
document.getElementById('btn').addEventListener('click', function () {
    let msg = document.getElementById('textBox').value;

    let sessionChat = sessionStorage.getItem("userEmisor");

    let data = {
        idUser: idUser.value,
        toUser: toUser.value,
        msg: msg,
        sessionChat : sessionChat 
    }

    socket.emit('sendText', data);
    document.getElementById('textBox').value = '';
});

/** 
 * EVENTO ON PARA MOSTRAR TODOS LOS MENSAJES EN LA CAJA DE MENSAJE
*/
socket.on('showMessage', function (data) {

    let = userStorage = sessionStorage.getItem("idUser");

    if (data['userToken'] == sessionStorage.getItem("userEmisor")) {
        printMessage(data)
    } 
})

/** 
 * EVENTO ON socket que agrega el ultimo mensaje enviado al DOM
*/ 
socket.on('sendText', function (data) {
    actions.innerHTML = "";
    let classEnv = ""
    
    data.idUser !== idUser.value ?  classEnv ={classDate:"dateToUser", classMsg:"toUser"} : classEnv = {classDate:"date", classMsg:"fromUser"}
        
    let div = document.createElement("div");
    let pUser = document.createElement('p');
    let pMessage = document.createElement('p');
    let span = document.createElement('span');

    div.classList.add(classEnv.classMsg);
    span.classList.add(classEnv.classDate);

    pUser.textContent = `Id Usuario: ${data.idUser}`;
    pMessage.textContent = data.msg;
    span.textContent = data.created;

    div.appendChild(pUser);
    div.appendChild(pMessage);
    div.appendChild(span);

    if (sessionStorage.getItem("userEmisor") == data.sessionChat || sessionStorage.getItem("userReceptor") == data.sessionChat) {    
        boxMsg.insertAdjacentElement('afterbegin', div)
    }

}); 


socket.on('typing', function (data) {

    if (sessionStorage.getItem("userReceptor") == data.actionTyping) {
        actions.innerHTML = `<em>Usuario ${data.idUser} esta escribiendo...</em>`;
    }

})

socket.on('conected', function (data) {
    console.log(itemUser)

    let di;
    for(di in itemUser){

        itemUser[di] ?  console.log(itemUser[di].getAttribute('data-id')) : console.log("No existe")

    }

})

// Imprime los mensajes
function printMessage(data){

    for (var i in data['json']) {

        // if(data['json'][i].idUser == idUserLocal || data['json'][i].idUser == idUserRemote ){
        var divMsgSend = document.createElement("div");
        var classEnv;

        data['json'][i].idUser !== idUser.value ?  classEnv ={classDate:"dateToUser", classMsg:"toUser"} : classEnv = {classDate:"date", classMsg:"fromUser"}

        let pUser = document.createElement("p");
        let pData = document.createElement("p");
        let spanDate = document.createElement("span");
        // let viewed = document.createElement("em");

        divMsgSend.classList.add(`${classEnv.classMsg}`);
        spanDate.classList.add(`${classEnv.classDate}`);

        pUser.textContent = `Id Usuario: ${data['json'][i].idUser}`;
        pData.textContent = `${data['json'][i].msg}`;
        spanDate.textContent = `${data['json'][i].created}`;

        // data['json'][i].viewed == 0 ? viewed.textContent = "No visto" : viewed.textContent = "Visto";

        divMsgSend.appendChild(pUser);
        divMsgSend.appendChild(pData);
        divMsgSend.appendChild(spanDate);
        divMsgSend.appendChild(viewed);
    
        boxMsg.appendChild(divMsgSend);
    }
}

/**
 * Se captura el id del usuario seleccionado en la bandeja de mensajes
 */
for (let x = 0; x < itemUser.length; x++){
    
    itemUser[x].addEventListener('click', function () {
            
        //ESTADOS DE LA CAGITA DE CHAT
        //var a;
        //for(a in itemUser) {
        //console.log(itemUser[a]);
        //    itemUser[a].setAttribute("active",false);
        //}

        let itemSelect = this.getAttribute('data-id');
        
        if (toUser.value != itemSelect) {
            
            // console.log(itemUser[x]);
            this.setAttribute("active",true);

            let toUserId = itemUser[x].getAttribute('data-id');
            toUser.setAttribute('value', toUserId);
            
            sessionStorage.setItem('idUSerRec', toUser.value);
            idUser.value = sessionStorage.getItem("idUser");
            // idUser.setAttribute('disabled', 'disabled');
            let userEmisor = window.btoa(idUser.value + "" + toUser.value);
            let userReceptor = window.btoa(toUser.value + "" + idUser.value);

            sessionStorage.setItem("userEmisor", userEmisor);
            sessionStorage.setItem("userReceptor", userReceptor);

            // console.log(window.atob(userToken));

            boxMsg.innerHTML = "";
            
            if(countEvent < 1){
                let data = {
                    idUser: idUser.value,
                    toUser: toUser.value,
                    userToken: userEmisor
                }
                // socket.emit('viewed', data);
                socket.emit('showMessage', data);
            }
            countEvent = countEvent + 1;
            // console.log(countEvent)
        } else {
            console.log('No se puede')
        }

    });
}




// socket.on('viewed', function () {

//     let data = {
//         idUser: idUser.value,
//         toUser: toUser.value,
//         userToken: userEmisor
//     }

//     socket.emit('showMessage', data);
// })