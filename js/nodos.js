/* nodos.html — Cuidados en Red */

document.getElementById('comunaFilter').addEventListener('change', filterByComuna);

var nodoMarkers = [];
var nodoMap = null;

function filterByComuna() {
    var selected = document.getElementById('comunaFilter').value;
    var visible = 0;
    document.querySelectorAll('.nodo-card').forEach(function(card) {
        var show = selected === 'all' || card.getAttribute('data-comuna').split(',').indexOf(selected) !== -1;
        card.style.display = show ? 'block' : 'none';
        if (show) visible++;
    });

    // El mapa muestra los mismos Nodos que la lista
    nodoMarkers.forEach(function(item) {
        var show = selected === 'all' || item.comunas.indexOf(selected) !== -1;
        if (show && !nodoMap.hasLayer(item.marker)) item.marker.addTo(nodoMap);
        if (!show && nodoMap.hasLayer(item.marker)) nodoMap.removeLayer(item.marker);
    });

    document.getElementById('nodosCount').textContent = selected === 'all'
        ? 'Mostrando los 16 Nodos'
        : 'Mostrando ' + visible + (visible === 1 ? ' Nodo' : ' Nodos') + ' de la Comuna ' + selected;
}

// Inicializar mapa cuando todo esté cargado
window.addEventListener('load', function() {
    // Verificar que Leaflet esté cargado antes de inicializar
    if (typeof L === 'undefined') {
        console.error('Leaflet no está cargado');
        return;
    }

    // Inicializar mapa de Leaflet
    const map = L.map('map').setView([-34.6037, -58.3816], 12);
    nodoMap = map;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const nodoIcon = L.icon({
        iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCAzMCA0NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTUgMEMxMC41MDc1IDAgNi44NTc1IDMuNjUgNi44NTc1IDguMTQyNUM2Ljg1NzUgMTQuMDYyNSAxNSAyNy40Mjc1IDE1IDI3LjQyNzVDMTUgMjcuNDI3NSAyMy4xNDI1IDE0LjA2MjUgMjMuMTQyNSA4LjE0MjVDMjMuMTQyNSAzLjY1IDE5LjQ5MjUgMCAxNSAwWiIgZmlsbD0iIzY2QkI2QSIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iOC41IiByPSI0IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==',
        iconSize: [30, 45],
        iconAnchor: [15, 45],
        popupAnchor: [0, -45]
    });

    const nodos = [
        { numero: 1, nombre: "Nodo Retiro", cobertura: "Cobertura completa", direccion: "Av. Córdoba 1235, Retiro", telefono: "4555-1001", email: "nodo.retiro@cuidadosenred.gob.ar", comunas: "Comunas 1 y 2", lat: -34.5947, lng: -58.3816 },
        { numero: 2, nombre: "Nodo San Telmo", cobertura: "Cobertura completa", direccion: "Defensa 678, San Telmo", telefono: "4555-1002", email: "nodo.santelmo@cuidadosenred.gob.ar", comunas: "Comuna 1", lat: -34.6217, lng: -58.3724 },
        { numero: 3, nombre: "Nodo Recoleta", cobertura: "Cobertura parcial: lista de espera", direccion: "Av. Las Heras 2234, Recoleta", telefono: "4555-1003", email: "nodo.recoleta@cuidadosenred.gob.ar", comunas: "Comuna 2", lat: -34.5873, lng: -58.3974 },
        { numero: 4, nombre: "Nodo Balvanera", cobertura: "Cobertura completa", direccion: "Av. Corrientes 2456, Balvanera", telefono: "4555-1004", email: "nodo.balvanera@cuidadosenred.gob.ar", comunas: "Comuna 3", lat: -34.6042, lng: -58.4005 },
        { numero: 5, nombre: "Nodo La Boca", cobertura: "Cobertura completa", direccion: "Almirante Brown 756, La Boca", telefono: "4555-1005", email: "nodo.laboca@cuidadosenred.gob.ar", comunas: "Comuna 4", lat: -34.6345, lng: -58.3634 },
        { numero: 6, nombre: "Nodo Almagro", cobertura: "Cobertura completa", direccion: "Av. Rivadavia 3890, Almagro", telefono: "4555-1006", email: "nodo.almagro@cuidadosenred.gob.ar", comunas: "Comuna 5", lat: -34.6085, lng: -58.4195 },
        { numero: 7, nombre: "Nodo Caballito", cobertura: "Cobertura parcial: lista de espera", direccion: "Av. Acoyte 234, Caballito", telefono: "4555-1007", email: "nodo.caballito@cuidadosenred.gob.ar", comunas: "Comuna 6", lat: -34.6178, lng: -58.4365 },
        { numero: 8, nombre: "Nodo Flores", cobertura: "Cobertura completa", direccion: "Av. Rivadavia 6789, Flores", telefono: "4555-1008", email: "nodo.flores@cuidadosenred.gob.ar", comunas: "Comuna 7", lat: -34.6285, lng: -58.4628 },
        { numero: 9, nombre: "Nodo Villa Lugano", cobertura: "Cobertura parcial: sede provisoria por obra", direccion: "Av. Escalada 4567, Villa Lugano", telefono: "4555-1009", email: "nodo.villalugano@cuidadosenred.gob.ar", comunas: "Comuna 8", lat: -34.6742, lng: -58.4734 },
        { numero: 10, nombre: "Nodo Liniers", cobertura: "Cobertura parcial: equipo en formación", direccion: "Av. Rivadavia 11234, Liniers", telefono: "4555-1010", email: "nodo.liniers@cuidadosenred.gob.ar", comunas: "Comuna 9", lat: -34.6428, lng: -58.5215 },
        { numero: 11, nombre: "Nodo Floresta", cobertura: "Cobertura completa", direccion: "Av. Gaona 3456, Floresta", telefono: "4555-1011", email: "nodo.floresta@cuidadosenred.gob.ar", comunas: "Comuna 10", lat: -34.6295, lng: -58.4935 },
        { numero: 12, nombre: "Nodo Villa Devoto", cobertura: "Cobertura parcial: equipo en formación", direccion: "Av. San Martín 4890, Villa Devoto", telefono: "4555-1012", email: "nodo.villadevoto@cuidadosenred.gob.ar", comunas: "Comuna 11", lat: -34.6012, lng: -58.5142 },
        { numero: 13, nombre: "Nodo Coghlan", cobertura: "Cobertura completa", direccion: "Av. Cabildo 3456, Coghlan", telefono: "4555-1013", email: "nodo.coghlan@cuidadosenred.gob.ar", comunas: "Comuna 12", lat: -34.5678, lng: -58.4785 },
        { numero: 14, nombre: "Nodo Belgrano", cobertura: "Cobertura parcial: lista de espera", direccion: "Av. Cabildo 2123, Belgrano", telefono: "4555-1014", email: "nodo.belgrano@cuidadosenred.gob.ar", comunas: "Comuna 13", lat: -34.5645, lng: -58.4552 },
        { numero: 15, nombre: "Nodo Palermo", cobertura: "Cobertura parcial: lista de espera", direccion: "Av. Santa Fe 4567, Palermo", telefono: "4555-1015", email: "nodo.palermo@cuidadosenred.gob.ar", comunas: "Comuna 14", lat: -34.5875, lng: -58.4215 },
        { numero: 16, nombre: "Nodo Chacarita", cobertura: "Cobertura completa", direccion: "Av. Warnes 2890, Chacarita", telefono: "4555-1016", email: "nodo.chacarita@cuidadosenred.gob.ar", comunas: "Comuna 15", lat: -34.5892, lng: -58.4512 }
    ];

    nodos.forEach(nodo => {
        const marker = L.marker([nodo.lat, nodo.lng], { icon: nodoIcon, alt: nodo.nombre }).addTo(map);
        nodoMarkers.push({ marker: marker, comunas: nodo.comunas.match(/\d+/g) || [] });

        const popupContent = `
            <h3>${nodo.numero}. ${nodo.nombre}</h3>
            <p><strong>${nodo.comunas}</strong></p>
            <p>${nodo.cobertura}</p>
            <p><i class="fa fa-map-marker" aria-hidden="true"></i> ${nodo.direccion}</p>
            <p><i class="fa fa-phone" aria-hidden="true"></i> ${nodo.telefono}</p>
            <p><i class="fa fa-envelope" aria-hidden="true"></i> ${nodo.email}</p>
            <a href="https://maps.google.com/?q=${encodeURIComponent(nodo.direccion + ', Buenos Aires')}" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
        `;

        marker.bindPopup(popupContent);
    });
    // Si ya había un filtro elegido antes de que cargara el mapa, aplicarlo
    filterByComuna();
});
