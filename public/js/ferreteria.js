const path =window.location.pathname;
console.log(path);
if(path.includes('producto')){
    $('#producto').addClass('menu-is-opening menu-open');
    $('#producto #principal').addClass('active')
    $('#todo').addClass('active');
    $('#herramientas, #construccion, #electricidad, #gasfiteria').click(function() {
        let idContenedor = this.id; // Obtiene el ID del contenedor clickeado
        $('#producto .nav-treeview .nav-item .nav-link').removeClass('active');
        let contenedor = `#${idContenedor}`
        $(contenedor).addClass('active');
        /*switch(idContenedor){
            case 'herramientas':
                $(`#`)
        }*/
    });
    if(path.includes('agregar')){
        $('#todo').removeClass('active');
        $('#agregar').addClass('active');
    }
    
}
else if(path.includes('compras')){
    $('#compras').addClass('menu-is-opening menu-open')
    $('#compras .nav-link').addClass('active')
}
