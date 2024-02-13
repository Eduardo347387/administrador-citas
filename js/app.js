const ls = window.localStorage;
const CITAS_KEY =  'citas'
let Editar  

const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

// Contenedor para las citas
const contenedorCitas = document.querySelector('#citas');

// Formulario nuevas citas
const formulario = document.querySelector('#nueva-cita')
formulario.addEventListener('submit', nuevaCita);


const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas: ''
}


function datosCita(e) {
    //  console.log(e.target.name) // Obtener el Input
     citaObj[e.target.name] = e.target.value;
}

// CLasses
class Citas {
    constructor() {
        this.citas = []
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        saveData(this.citas)
    } 
    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
        saveData(this.citas)
    }
    actulizarCita(citaAtualizada){ 
        this.citas =  this.citas.map(cita=> cita.id === citaAtualizada.id ? citaAtualizada: cita)
        saveData(this.citas)
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        
        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }
        

        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('#contenido').insertBefore( divMensaje , document.querySelector('.agregar-cita'));

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
            divMensaje.remove();
        }, 2000);
   }

   imprimirCitas({citas}) { // Se puede aplicar destructuring desde la función...
       
        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            // scRIPTING DE LOS ELEMENTOS...
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.innerHTML = `${mascota}`;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span> ${propietario}`;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Síntomas: </span> ${sintomas}`;

            // Botton eliminar
            const buttonEliminar = document.createElement('BUTTON')
            buttonEliminar.className = 'btn btn-danger mr-2'
            buttonEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `;

            buttonEliminar.onclick = ()=> eliminarCita(id)


            const buttonEditar = document.createElement('BUTTON');
            buttonEditar.className = 'btn btn-info'
            buttonEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
            `;

            buttonEditar.onclick = ()=> edicion(cita)

            // Agregar al HTML
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(buttonEliminar)
            divCita.appendChild(buttonEditar)

            contenedorCitas.appendChild(divCita);
        });    
   }

   limpiarHTML() {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
   }
}

const ui = new UI();
const administrarCitas = new Citas();



function nuevaCita(e) {
    e.preventDefault();

    const {mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    const fechaObjeto = new Date(fechaInput.value);
    fechaObjeto.setDate(fechaObjeto.getDate() + 1)

    const fechaHoy = new Date();
    const soloFecha = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate());

    
    // Validar
    if( mascota.trim() === '' || propietario.trim() === '' || telefono.trim() === '' || fecha.trim() === ''  || hora.trim() === '' || sintomas.trim() === '' ) {
        ui.imprimirAlerta('Todos los mensajes son Obligatorios', 'error')

        return;

    }else if(fechaObjeto < soloFecha){
        ui.imprimirAlerta('Fecha invalida', 'error');
        return;
    }

    if(Editar){
    
        let newListCitas = administrarCitas.citas.filter(cita=> cita.id !== citaObj.id)

        if(validarFechaYhora(newListCitas)){
            administrarCitas.actulizarCita({...citaObj})
            ui.imprimirAlerta('Cita Editada correctamente')
            formulario.querySelector('[type = "submit"]').textContent = 'Crear Cita'
            Editar = false; 
            fechaInput.defaultValue = ''

            // Imprimir el HTML de citas
            ui.imprimirCitas(administrarCitas);

            // Reinicia el objeto para evitar futuros problemas de validación
            reiniciarObjeto();

            // Reiniciar Formulario
            formulario.reset();
        }
    }else{
    
        if(validarFechaYhora(administrarCitas.citas)){
            // Generar un ID único
            citaObj.id = Date.now();
            
            // Añade la nueva cita
            administrarCitas.agregarCita({...citaObj});

            // Mostrar mensaje de que todo esta bien...
            ui.imprimirAlerta('Cita Agregada Correctamente');


            // Imprimir el HTML de citas
            ui.imprimirCitas(administrarCitas);

            // Reinicia el objeto para evitar futuros problemas de validación
            reiniciarObjeto();
            

            // Reiniciar Formulario
            formulario.reset();
        }
      
    }

    

}

function reiniciarObjeto() {
    // Reiniciar el objeto
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}


function eliminarCita(id){
    
    // Eliminar paciente desde clase
    administrarCitas.eliminarCita(id)
    // Mandar mensaje
    ui.imprimirAlerta('Cita eliminada correctamente')
    // Mostrar lista actulizada
    ui.imprimirCitas(administrarCitas)
    
    formulario.reset()
    formulario.querySelector('[type = "submit"]').textContent = 'Crear Cita'
    Editar = false; 
    fechaInput.defaultValue = ''
    reiniciarObjeto()
}

function edicion(cita){
    const {mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    mascotaInput.value       =  mascota
    propietarioInput.value   =  propietario
    telefonoInput.value      =  telefono
    // fecha.value              =  fecha 
    fechaInput.defaultValue = fecha
    horaInput.value          =  hora
    sintomasInput.value      =  sintomas

    citaObj.mascota = mascota
    citaObj.propietario = propietario 
    citaObj.telefono = telefono
    citaObj.fecha = fecha
    citaObj.hora = hora
    citaObj.sintomas = sintomas
    citaObj.id = id
   
    formulario.querySelector('[type = "submit"]').textContent = 'Editar Paciente'
    Editar = true; 
}

function saveData(data){
    const jsonData = JSON.stringify(data)
    ls.setItem(CITAS_KEY,jsonData)
}


// Eventos
eventListeners();

function eventListeners() {
    window.addEventListener('beforeunload',()=>formulario.reset())
    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    // verificar si existe la llave citas 
    if(ls.getItem(CITAS_KEY)){
        administrarCitas.citas = JSON.parse(ls.getItem(CITAS_KEY))
        ui.imprimirCitas(administrarCitas)
    }
}


function validarFechaYhora(citas){
    if(citas.some(cita => cita.fecha === citaObj.fecha && cita.hora === citaObj.hora)) {
        ui.imprimirAlerta('Ya existe una cita en la fecha y hora mencionada', 'error');
        return false;
    }
    return true
}

