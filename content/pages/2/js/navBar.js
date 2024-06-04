async function loadNavbar() {
    try {
        const response = await fetch('../2/carritoIndex.html');
        if (!response.ok) {
            throw new Error('Error response: No ha sido posible cargar el index de la navbar');
        }
        const navbarHTML = await response.text();
        document.getElementById('navbar-complete-carrito').innerHTML = navbarHTML;
    } catch (error) {
        console.error('Error loading navbar: ', error);
    }
}

document.addEventListener('DOMContentLoaded', loadNavbar);