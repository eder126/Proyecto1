/*************************************/
/********* CALIFICAR LIBRO *********/
/*************************************/
var d1 = document.getElementById("1");
var d2 = document.getElementById("2");
var d3 = document.getElementById("3");
var d4 = document.getElementById("4");
var d5 = document.getElementById("5");
function a1() {
    d1.src = "img/notebookA.svg";
    d2.src = "img/notebookN.svg";
    d3.src = "img/notebookN.svg";
    d4.src = "img/notebookN.svg";
    d5.src = "img/notebookN.svg";
}

function a2() {
    d1.src = "img/notebookA.svg";
    d2.src = "img/notebookA.svg";
    d3.src = "img/notebookN.svg";
    d4.src = "img/notebookN.svg";
    d5.src = "img/notebookN.svg";
}

function a3() {
    d1.src = "img/notebookA.svg";
    d2.src = "img/notebookA.svg";
    d3.src = "img/notebookA.svg";
    d4.src = "img/notebookN.svg";
    d5.src = "img/notebookN.svg";
}

function a4() {
    d1.src = "img/notebookA.svg";
    d2.src = "img/notebookA.svg";
    d3.src = "img/notebookA.svg";
    d4.src = "img/notebookA.svg";
    d5.src = "img/notebookN.svg";
}

function a5() {
    d1.src = "img/notebookA.svg";
    d2.src = "img/notebookA.svg";
    d3.src = "img/notebookA.svg";
    d4.src = "img/notebookA.svg";
    d5.src = "img/notebookA.svg";
}


/*************************************/
/****** CALIFICACION DE LIBRO ******/
/*************************************/
var Ud1 = document.getElementById("U1");
var Ud2 = document.getElementById("U2");
var Ud3 = document.getElementById("U3");
var Ud4 = document.getElementById("U4");
var Ud5 = document.getElementById("U5");
//Recibe un numero, entre el 1 al 5, desabilita el input radio que mostrara la calificacion del libro,
// y respectivamente muestra la calificacion del libro
function calificacion(numero){
    Ud1.disabled = true;
    Ud2.disabled = true;
    Ud3.disabled = true;
    Ud4.disabled = true;
    Ud5.disabled = true;
    if(numero == 1){
        Ud1.src = "img/notebookA.svg";
        Ud2.src = "img/notebookN.svg";
        Ud3.src = "img/notebookN.svg";
        Ud4.src = "img/notebookN.svg";
        Ud5.src = "img/notebookN.svg";
    }
    else if(numero == 2){
        Ud1.src = "img/notebookA.svg";
        Ud2.src = "img/notebookA.svg";
        Ud3.src = "img/notebookN.svg";
        Ud4.src = "img/notebookN.svg";
        Ud5.src = "img/notebookN.svg";
    }
    else if(numero == 3){
        Ud1.src = "img/notebookA.svg";
        Ud2.src = "img/notebookA.svg";
        Ud3.src = "img/notebookA.svg";
        Ud4.src = "img/notebookN.svg";
        Ud5.src = "img/notebookN.svg";
    }
    else if(numero == 4){
        Ud1.src = "img/notebookA.svg";
        Ud2.src = "img/notebookA.svg";
        Ud3.src = "img/notebookA.svg";
        Ud4.src = "img/notebookA.svg";
        Ud5.src = "img/notebookN.svg";
    }
    else{
        Ud1.src = "img/notebookA.svg";
        Ud2.src = "img/notebookA.svg";
        Ud3.src = "img/notebookA.svg";
        Ud4.src = "img/notebookA.svg";
        Ud5.src = "img/notebookA.svg";
    }
}