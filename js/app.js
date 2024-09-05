// Selecciona el formulario para cotizar seguro
const formulario = document.querySelector('#cotizar-seguro');

// Constructor para crear una instancia de Seguro
function Seguro(marca, year, tipo) {
    // Aquí puedes agregar propiedades o métodos necesarios para el objeto Seguro
    this.marca= marca,
    this.year = year,
    this.tipo = tipo

}

Seguro.prototype.cotizarSeguro = function () {

    /*  
    Americano: 1.15
    Asiatico:1.05
    Europeo:1.35
    */


    let cantidad;
    const base = 2000;

    switch(this.marca) {

        case '1':
            cantidad = base * 1.15;
            break
        case '2':
            cantidad = base * 1.05;
            break
        case '3':
            cantidad = base * 1.35;
            break
        default:
        break;
    
    }

    //calculando el year 
    const diferencia = new Date().getFullYear() - this.year

    cantidad -= ((diferencia * 3) * cantidad) / 100;


    // cotizando el tipo de seguro 

    //basico : 1.30
    //completo : 1.50;

    if(this.tipo === 'basico') {
        (cantidad *= 1.30).toFixed(1);
    }else {
        (cantidad *= 1.50).toFixed(1);
    }

    return cantidad


}
// Constructor para la interfaz de usuario (UI)
function UI() {}

// Método para llenar el select con los años
UI.prototype.llenarSelect = () => {
    const max = new Date().getFullYear(); // Año actual
    const min = max - 20; // Año mínimo (20 años atrás)
    const selectYear = document.querySelector('#year'); // Selecciona el elemento select

    // Agrega las opciones de año al select
    for (let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

// Método para mostrar mensajes en la interfaz
UI.prototype.mensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    // Asigna clases según el tipo de mensaje (error o correcto)
    if (tipo === 'error') {
        div.classList = 'error';
    } else {
        div.classList = 'correcto';
    }

    div.classList.add('mensaje','mt-10');
    div.textContent = mensaje;

    // Inserta el mensaje en la interfaz antes del resultado
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove()
    }, 3000);
};

UI.prototype.mostrarResultado = (total,seguro) => {

    let marca;
     switch(seguro.marca) {
          case '1':
               marca = 'Americano';
               break;
          case '2':
               marca = 'Asiatico';
               break;
          case '3':
               marca = 'Europeo';
               break;
     }

    const div = document.createElement('div');
    div.classList = 'mt-10';

    div.innerHTML = `
        <p class='header'>Tu Resumen: </p>
          <p class="font-bold">Marca: <span class="font-normal"> ${marca} </span> </p>
          <p class="font-bold">Año: <span class="font-normal"> ${seguro.year} </span> </p>
          <p class="font-bold">Tipo: <span class="font-normal"> ${seguro.tipo} </span> </p>
          <p class="font-bold"> Total: <span class="font-normal"> $ ${total} </span> </p>
    
    `

    const resultadoDiv = document.querySelector('#resultado');
    

    //mostrar spinner

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block'

    setTimeout(() => {
        spinner.style.display = 'none'
        resultadoDiv.appendChild(div)
    }, 3000);

}

// Crea una instancia de la interfaz de usuario
const ui = new UI();

// Evento que se dispara cuando el DOM ha cargado completamente
document.addEventListener("DOMContentLoaded", () => {
    // Llama al método para llenar el select con los años disponibles
    ui.llenarSelect();
});

// Función para escuchar los eventos en el formulario
function eventListener() {
    formulario.addEventListener('submit', cotizarSeguro);
}

// Función para manejar la cotización del seguro
function cotizarSeguro(e) {
    e.preventDefault();

    // Obtiene los valores seleccionados de la marca, año y tipo de seguro
    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;


    // Valida que todos los campos estén completos
    if (marca === '' || year === '' || tipo === '') {
        ui.mensaje('Todos los campos son obligatorios', 'error');
        return
    } else {

    ui.mensaje('Cotizando...','correcto');

    //eliminar las cotizaciones previas

    const resultados = document.querySelector('#resultado div');
    if(resultados != null){
        resultados.remove();
    }

 
    const seguro = new Seguro(marca,year,tipo);
    
    const total = seguro.cotizarSeguro();

    ui.mostrarResultado(total,seguro);

    }

    
}

// Inicia los listeners de eventos
eventListener();
