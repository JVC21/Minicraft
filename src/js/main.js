const skinInput = document.getElementById('skinInput');
const downloadButton = document.getElementById('downloadButton');

let skinFile = null; // original file 64px 64px
let miniSkinDataURL = null; // result as data URL

class SkinFace {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

const SKIN_HEAD =  {
    up:    new SkinFace(8, 0, 8, 8),
    down: new SkinFace(16, 0, 8, 8),
    right: new SkinFace(0, 8, 8, 8),
    front: new SkinFace(8, 8, 8, 8),
    left: new SkinFace(16, 8, 8, 8),
    back: new SkinFace(24, 8, 8, 8),
}

function createSkin(skinImg) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 32;
    canvas.height = 32;

    ctx.drawImage(skinImg, SKIN_HEAD.front.x, SKIN_HEAD.front.y, SKIN_HEAD.front.w, SKIN_HEAD.front.h, 0, 0, SKIN_HEAD.front.w, SKIN_HEAD.front.h);

    return canvas.toDataURL('image/png');
}

skinInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file || file.type !== 'image/png') {
        alert('Por favor selecciona un archivo PNG válido.');
        return;
    }

    skinFile = file;

    const reader = new FileReader();

    reader.onload = (event) => {
        const skinImg = new Image();

        skinImg.src = event.target.result;
        skinImg.onload = () => {
            if (skinImg.width != 64 || skinImg.height != 64) {
                alert('Por favor selecciona un archivo de 64x64 px. [' + skinImg.width + 'x' + skinImg.height + ']');
                return;
            }

            miniSkinDataURL = createSkin(skinImg);
        }

        downloadButton.disabled = false;
    };
    reader.readAsDataURL(skinFile);  
});

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');

    link.href = miniSkinDataURL;
    link.download = 'test.png';
    link.click();
});