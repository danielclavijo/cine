
//Necesita un nombre de tag (h1, div), un array con sus propiedades (id, type), y opcionalmente texto y padre al que se hará el append
function createNode(nombre,array,texto,padre){
    var nodo = document.createElement(nombre);

    for (var key in array) {
        if (array.hasOwnProperty(key)) {
            nodo.setAttribute(key,array[key]);
        }
    }
    if(texto){
        var textNode = document.createTextNode(texto);
        nodo.appendChild(textNode);
    }

    if(padre){
        var padre = document.getElementById(padre);
        padre.appendChild(nodo);
    }
    else
        document.body.appendChild(nodo);

    return nodo;
}
