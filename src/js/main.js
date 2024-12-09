const skinInput = document.getElementById('skinInput')
const processButton = document.getElementById('processButton')

let skinFile = null

skinInput.addEventListener('change', (event) => {
    const file = event.target.files[0]

    if (file && file.type === 'image/png') {
        skinFile = file
        processButton.disabled = false
        alert('Imagen cargada correctamente.')
    } else {
        alert('Por favor selecciona un archivo PNG válido.')
        skinFile = null
    }
});

processButton.addEventListener('click', () => {
    if (!skinFile) return

    const reader = new FileReader()

    reader.onload = (event) => {
        const arrayBuffer = event.target.result;

        console.log('Tamaño del archivo: ' + (arrayBuffer.byteLength / 1024) + ' kb');
    };

    reader.readAsArrayBuffer(skinFile);
});