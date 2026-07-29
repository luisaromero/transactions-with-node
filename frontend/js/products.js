const productList = document.getElementById('product-list');
const statusMessage = document.getElementById('status-message');

async function loadProducts() {
    try {
        const products = await apiGet('productos');

        if (products.length === 0) {
            statusMessage.textContent = 'No hay productos disponibles.';
            return;
        }

        products.forEach(product => {
            const item = document.createElement('li');
            item.className = 'product-item';

            const name = document.createElement('h3');
            name.textContent = product.nombre;

            const price = document.createElement('p');
            price.textContent = `Precio: $${product.precio}`;

            const stock = document.createElement('p');
            stock.textContent = `Stock: ${product.existencias}`;

            item.appendChild(name);
            item.appendChild(price);
            item.appendChild(stock);
            productList.appendChild(item);
        });

    } catch (err) {
        statusMessage.textContent = `Error: ${err.message}`;
    }
}

loadProducts();