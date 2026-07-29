const API_URL = 'http://localhost:3000';

//la función fetch compartida

async function apiGet(filtro, params = {}) {
    console.log('aqui')
    const query = new URLSearchParams({ filtro, ...params });
    const res = await fetch(`${API_URL}/?${query}`);

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || 'Error al consultar la API');
    }

    return res.json();
}

async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.mensaje || 'Error al crear el recurso');
    }

    return data;
}

function formaterPrice(value) {
    return new Intl.NumberFormat('es-CL').format(value);
}