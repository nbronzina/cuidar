/* el-sistema.html — Cuidados en Red */

/* El índice arranca abierto en pantallas grandes; en celular y tableta queda plegado */
document.addEventListener('DOMContentLoaded', function() {
    var toc = document.getElementById('tocDetails');
    if (toc && window.matchMedia('(min-width: 992px)').matches) toc.open = true;
});
