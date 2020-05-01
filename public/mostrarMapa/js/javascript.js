        function ensennar() {
            var linksn = document.getElementById("menu1");
            var linksn2 = document.getElementById("menu2");
            linksn.classList.toggle("notHidden");
            linksn2.classList.toggle("notHidden");
        }

        function cancelar() {
            document.getElementById("caja").classList.remove("overlay");
            document.getElementById("advertencia").classList.add("ocultar");
            document.getElementById("btnAceptar").classList.remove("ocultar");
            document.getElementById("btnCancelar").classList.remove("ocultar");
        }
        
        function aceptar(){
            console.log("Qué quiere hacer acá?");
            cancelar();
        }
        
        function error(titulo, msg, aceptar, cancelar){
            document.getElementById("caja").classList.add("overlay");
            document.getElementById("advertencia").classList.remove("ocultar");
            document.getElementById("tituloAdv").innerHTML = titulo;
            document.getElementById("mensaje").innerHTML = msg;
            if(!aceptar) document.getElementById("btnAceptar").classList.add("ocultar");
            if(!cancelar) document.getElementById("btnCancelar").classList.add("ocultar");
            window.scrollTo(0, 0);
        }