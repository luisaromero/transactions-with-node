const formSearch = document.getElementById('form-search-orders');
const OrderListHtml = document.getElementById('list-orders');
const statusMessage = document.getElementById('status-message');

formSearch.addEventListener('submit', async (event) => {
    event.preventDefault();

    const rut = document.getElementById('rut').value.trim();

    OrderListHtml.textContent = '';
    statusMessage.textContent = 'Buscando...';

    try {
        const orders = await apiGet('ordenes', { rut });

        statusMessage.textContent = '';

        if (orders.length === 0) {
            statusMessage.textContent = 'Este cliente no tiene órdenes registradas.';
            return;
        }

        orders.forEach(order => {
            const item = document.createElement('li');
            item.className = 'orden-item';

            const idOrder = document.createElement('h3');
            idOrder.textContent = `Orden #${order.id_orden}`;

            const total = document.createElement('p');
            total.textContent = `Total: $${formaterPrice(order.precio_total)}`;

            item.appendChild(idOrder);
            item.appendChild(total);
            OrderListHtml.appendChild(item);
        });

    } catch (err) {
        statusMessage.textContent = `Error: ${err.message}`;
    }
});