// MODELO DE DATOS

let mis_peliculas_iniciales = [
    {
        titulo: "Superlópez",
        director: "Javier Ruiz Caldera",
        miniatura: "files/superlopez.png",
    },
    {
        titulo: "Jurassic Park",
        director: "Steven Spielberg",
        miniatura: "files/jurassicpark.png",
    },
    {
        titulo: "Interstellar",
        director: "Christopher Nolan",
        miniatura: "files/interstellar.png",
    },
];

let mis_peliculas = [];

const postAPI = async (peliculas) => {
    try {
        const res = await fetch("https://myjson.dit.upm.es/api/bins", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(peliculas),
        });
        const { uri } = await res.json();
        return uri;
    } catch (err) {
        alert("No se ha podido crear el endpoint.");
    }
};
const getAPI = async (url) => {
    try {
        let res = await fetch(url);                     // ALUMNA
        return await res.json();                        // ALUMNA
    } catch (err) {
        alert("No se ha podido recibir respuesta.");    // ALUMNA
    }
};
const updateAPI = async (peliculas) => {
    try {
        const res = await fetch(localStorage.URL, {         // ALUMNA
            method: "PUT",                                  // ALUMNA
            headers: {
                "Content-Type": "application/json",         // ALUMNA
            },
            body: JSON.stringify(peliculas),                // ALUMNA
        });
        return await res.json();                            // ALUMNA
    } catch (err) {
        alert("No se ha podido actualizar el endpoint.");   // ALUMNA
    }
};

// VISTAS

const indexView = (peliculas) => {
    let i = 0;
    let view = "";

    while (i < peliculas.length) {
        view += `
        <div class="movie">
            <div class="movie-img">
                <img data-my-id="${i}" src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
            </div>
            <div class="title">
                ${peliculas[i].titulo || "<em>Sin título</em>"}
            </div>
            <div class="actions">
                <button class="show" data-my-id="${i}">Ver</button>         <!-- ALUMNA -->
                <button class="edit" data-my-id="${i}">Editar</button>
                <button class="delete" data-my-id="${i}">Borrar</button>    <!-- ALUMNA -->
            </div>
        </div>\n`;
        i++;                                                                //   ALUMNA
    }

    view += `<div class="actions">
                <button class="new">Añadir</button>                         <!-- ALUMNA -->
                <button class="reset">Reset</button>                        <!-- ALUMNA -->
            </div>`;

    return view;
};

const editView = (i, pelicula) => {
    return `<h2>Editar Película </h2>
         <div class="field">
         Título <br>
         <input  type="text" id="titulo" placeholder="Título" 
                 value="${pelicula.titulo}">
         </div>
         <div class="field">
         Director <br>
         <input  type="text" id="director" placeholder="Director" 
                 value="${pelicula.director}">
         </div>
         <div class="field">
         Miniatura <br>
         <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                 value="${pelicula.miniatura}">
         </div>
         <div class="actions">
             <button class="update" data-my-id="${i}">
                 Actualizar
             </button>
             <button class="index">
                 Volver
             </button>
        `;
};

const showView = (pelicula) => {
    return `
     <p>
        La película <b>${pelicula.titulo}</b>, fue     <!-- ALUMNA -->
        dirigida por <b>${pelicula.director}!</b>      <!-- ALUMNA -->
     
     </p>
     <div class="actions">
        <button class="index">Volver</button>
     </div>`;
};

const newView = () => {
    return `<h2>Crear Película</h2>
    <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título">                   <!-- ALUMNA -->
    </div>
    <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director">               <!-- ALUMNA -->
    </div>
    <div class="field">                         
            Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura">   <!-- ALUMNA -->
    </div>
    <div class="actions">
        <button class="create">Crear</button>                                   <!-- ALUMNA -->
        <button class="index">Volver</button>
    </div>`;
};

// CONTROLADORES

const initContr = async () => {
    if (!localStorage.URL || localStorage.URL === "undefined") {
        localStorage.URL = await postAPI(mis_peliculas_iniciales);
    }
    indexContr();
};

const indexContr = async () => {
    mis_peliculas = (await getAPI(localStorage.URL)) || [];                 // ALUMNA
    document.getElementById("main").innerHTML = await indexView(mis_peliculas);
};

const showContr = (i) => {
    document.getElementById("main").innerHTML = showView(mis_peliculas[i]); // ALUMNA
};

const newContr = () => {
    document.getElementById("main").innerHTML = newView();          // ALUMNA
};

const createContr = async () => {
    mis_peliculas.push(                                             // ALUMNA
        {
            titulo: document.getElementById("titulo").value,        // ALUMNA
            director: document.getElementById("director").value,    // ALUMNA
            miniatura: document.getElementById("miniatura").value,  // ALUMNA
        }
    );
    await updateAPI(mis_peliculas);                                 // ALUMNA
    indexContr();
};

const editContr = (i) => {
    document.getElementById("main").innerHTML = editView(i, mis_peliculas[i]);
};

const updateContr = async (i) => {
    mis_peliculas[i].titulo = document.getElementById("titulo").value;
    mis_peliculas[i].director = document.getElementById("director").value;
    mis_peliculas[i].miniatura = document.getElementById("miniatura").value;
    await updateAPI(mis_peliculas);
    indexContr();
};

const deleteContr = async (i) => {
    let msg = confirm("¿Desea borrar la oelicula");     // ALUMNA
    if (msg) {                                          // ALUMNA
        mis_peliculas.splice(i,1);                      // ALUMNA
        await updateAPI(mis_peliculas);                 // ALUMNA
        indexContr();                                   // ALUMNA
    } else {
        indexContr();                                   // ALUMNA
    }
};

const resetContr = async () => {
    await updateAPI(mis_peliculas_iniciales);   // ALUMNA
    indexContr();                               // ALUMNA
};

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

document.addEventListener("click", (ev) => {
    if (matchEvent(ev, ".index")) indexContr();
    else if (matchEvent(ev, ".edit")) editContr(myId(ev));
    else if (matchEvent(ev, ".update")) updateContr(myId(ev));
    else if (matchEvent(ev, ".show")) showContr(myId(ev));      // ALUMNA
    else if (matchEvent(ev, ".new")) newContr();                // ALUMNA
    else if (matchEvent(ev, ".create")) createContr();          // ALUMNA
    else if (matchEvent(ev, ".delete")) deleteContr(myId(ev));  // ALUMNA
    else if (matchEvent(ev, ".reset")) resetContr();            // ALUMNA
});

// Inicialización
document.addEventListener("DOMContentLoaded", initContr);
