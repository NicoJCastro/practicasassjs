document.addEventListener('DOMContentLoaded', function() {
navegacionFija(); // Navegacion fija
crearGaleria(); // Crear galeria de imagenes
resaltarEnlace(); // Resaltar enlace actual
scrollNav(); // Scroll enlaces
});

// Inicio Navegacion Fija

function navegacionFija() {
    const header = document.querySelector('.header');
    const sobreFestival = document.querySelector('.sobre-festival');

    window.addEventListener('scroll', function() {
       
        const scroll = window.scrollY; // Scroll en pixeles 
        const alturaSobreFestival = sobreFestival.clientHeight; // Altura del elemento sobre-festival 
        // clientHeight: Nos da la altura del elemento en pixeles incluyendo padding pero sin margin ni border 


        if (scroll > alturaSobreFestival) {
            header.classList.add('fijo');
        } else {
            header.classList.remove('fijo');
        }
    });
}

// Inicio Crear Galeria

function crearGaleria() {
    const CANTIDAD_IMAGENES = 16;
const galeria = document.querySelector('.galeria-imagenes');

for (let i = 1; i <= CANTIDAD_IMAGENES; i++) {
    // console.log(i);
    const imagen = document.createElement('PICTURE');
    imagen.innerHTML = `
    <source srcset="dist/img/gallery/thumbs/${i}.avif" type="image/avif">
    <source srcset="dist/img/gallery/thumbs/${i}.webp" type="image/webp">
    <img loading="lazy" width="200" height="300" src="dist/img/gallery/thumbs/${i}.jpg" alt="imagen galeria">`;
    

    //Event Handler para mostrar la imagen en grande al hacer click en ella 
    imagen.onclick = function(){
    mostrarImagen(i);
    }
    
    galeria.appendChild(imagen);
}

}

// ------ Fin Crear Galeria

function mostrarImagen (i) {

    const imagen = document.createElement('PICTURE');
    imagen.innerHTML = `
    <source srcset="dist/img/gallery/full/${i}.avif" type="image/avif">
    <source srcset="dist/img/gallery/full/${i}.webp" type="image/webp">
    <img loading="lazy" width="200" height="300" src="dist/img/gallery/full/${i}.jpg" alt="imagen galeria">`;

    //Generar Modal
    const modal = document.createElement('DIV');
    modal.classList.add('modal');
    modal.onclick = cerrarModal;

    //Boton cerrar Modal
    const cerrarModalBtn = document.createElement('BUTTON');
    cerrarModalBtn.textContent = 'X';
    cerrarModalBtn.classList.add('modal-btn-cerrar');
    cerrarModalBtn.onclick = cerrarModal;
   
    modal.appendChild(imagen);
    modal.appendChild(cerrarModalBtn);    


    //Agregar en el html
    const body = document.querySelector('body');
    body.classList.add('overflow-hidden');
    body.appendChild(modal);
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    modal.classList.add('fade-out');
    setTimeout(() => {
        modal?.remove();
        const body = document.querySelector('body');
        body.classList.remove('overflow-hidden');
    }, 500);
   

}
// ----- Fin de Crear Galeria

// Inicio Resaltar enlace actual

function resaltarEnlace() {
    document.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navegacion-principal a');

       let actual = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                actual = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('activo');
           if (link.getAttribute('href') === '#' + actual) {
               link.classList.add('activo');
            }
        });
    } );
}
// ------ Fin Resaltar enlace actual


// Inicio Scroll enlaces

function scrollNav() {
    const links = document.querySelectorAll('.navegacion-principal a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            if (href === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                const seccion = document.querySelector(href);
                seccion.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });   
}

// ------ Fin Scroll enlaces

