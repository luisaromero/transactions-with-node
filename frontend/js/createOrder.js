const formSearchAddress = document.getElementById('form-search-address');
const msgAdress = document.getElementById('msg-address');
const formCreateOrder = document.getElementById('form-crear-orden');
const selectAddress = document.getElementById('address');
const listProductsForm = document.getElementById('list-products-form');
const msgResult = document.getElementById('msg-result');

let ActualRut = '';

// cargar direcciones al buscar rut

formSearchAddress.addEventListener('submit', async (event) => {
    event.preventDefault();

    ActualRut = document.getElementById('rut').value.trim();
    msgAdress.textContent = 'Buscando...';
    selectAddress.textContent = '';

    try {
        const address = await apiGet('direcciones', { rut: ActualRut });

        if (address.length === 0) {
            msgAdress.textContent = 'Este cliente no tiene direcciones registradas.';
            formCreateOrder.classList.add('text-hidden');
            return;
        }

        address.forEach(dir => {
            const option = document.createElement('option');
            option.value = dir.id_direccion;
            option.textContent = dir.direccion;
            selectAddress.appendChild(option);
        });

        msgAdress.textContent = '';
        formCreateOrder.classList.remove('text-hidden');
        await LoadAvailableProducts();

    } catch (err) {
        msgAdress.textContent = `Error: ${err.message}`;
    }
});

// cargar productos como checkboxes + cantidad

async function LoadAvailableProducts() {
    listProductsForm.textContent = '';

    try {
        const products = await apiGet('productos');

        products.forEach(product => {
            const item = document.createElement('li');
            item.className = 'product-form-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = product.id_producto;
            checkbox.id = `producto-${product.id_producto}`;
            checkbox.disabled = product.existencias === 0;

            const label = document.createElement('label');
            label.setAttribute('for', `producto-${product.id_producto}`);
            label.textContent = `${product.nombre} — $${formaterPrice(product.precio)} (stock: ${product.existencias})`;

            const quantity = document.createElement('input');
            quantity.type = 'number';
            quantity.min = '1';
            quantity.max = String(product.existencias);
            quantity.value = '1';
            quantity.className = 'quantity-input';
            quantity.disabled = product.existencias === 0;

            item.appendChild(checkbox);
            item.appendChild(label);
            item.appendChild(quantity);
            listProductsForm.appendChild(item);
        });

    } catch (err) {
        msgResult.textContent = `Error al cargar productos: ${err.message}`;
    }
}

// armar el POST con lo seleccionado
formCreateOrder.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id_direccion = Number(selectAddress.value);

    const checkboxes = listProductsForm.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
        msgResult.textContent = 'Selecciona al menos un producto.';
        return;
    }

    const selectedProducts = Array.from(checkboxes).map(checkbox => {
        const item = checkbox.closest('.product-form-item');
        const inputQuantity = item.querySelector('.quantity-input');
        return {
            id_producto: Number(checkbox.value),
            cantidad: Number(inputQuantity.value)
        };
    });

    msgResult.textContent = 'Creando orden...';

    try {
        const results = await apiPost('/orden', {
            rut: ActualRut,
            id_direccion,
            productos: selectedProducts
        });

        msgResult.textContent = `Orden #${results.id_orden} creada. Total: $${formaterPrice(results.precio_total)}`;
        msgResult.classList.add('order-confirmed');
        formCreateOrder.reset();
        formCreateOrder.classList.add('text-hidden');

    } catch (err) {
        msgResult.textContent = `Error: ${err.message}`;
    }
});