const skinUploader = document.getElementById('skinUploader');
const skinUploaderLabel = document.getElementById('skinUploaderLabel');
const skinInput = document.getElementById('skinInput');
const downloadButton = document.getElementById('downloadButton');

let skinFile = null; // original file 64px 64px
let fileName = null; // original file name without extension
let miniSkinDataURL = null; // result as data URL

class SkinFace {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(ctx, skinImg, dx, dy, dh, dw) {
        ctx.drawImage(skinImg, this.x, this.y, this.w, this.h, dx, dy, dh, dw);
    }
}

class SkinHead {
    constructor(x, y) { 
        this.up    = new SkinFace(x + 8 , y + 0, 8, 8);
        this.down  = new SkinFace(x + 16, y + 0, 8, 8);
        this.right = new SkinFace(x + 0 , y + 8, 8, 8);
        this.front = new SkinFace(x + 8 , y + 8, 8, 8);
        this.left  = new SkinFace(x + 16, y + 8, 8, 8);
        this.back  = new SkinFace(x + 24, y + 8, 8, 8);
    }
}

class SkinBody {
    constructor(x, y) { 
        this.up    = new SkinFace(x + 4 , y + 0, 8, 4 );
        this.down  = new SkinFace(x + 12, y + 0, 8, 4 );
        this.right = new SkinFace(x + 0 , y + 4, 4, 12);
        this.front = new SkinFace(x + 4 , y + 4, 8, 12);
        this.left  = new SkinFace(x + 12, y + 4, 4, 12);
        this.back  = new SkinFace(x + 16, y + 4, 8, 12);
    }
}

class SkinLimb {
    constructor(x, y) {
        this.up    = new SkinFace(x + 4 , y + 0, 8, 4 );
        this.down  = new SkinFace(x + 8, y + 0, 8, 4 );
        this.right = new SkinFace(x + 0 , y + 4, 4, 12);
        this.front = new SkinFace(x + 4 , y + 4, 8, 12);
        this.left  = new SkinFace(x + 8, y + 4, 4, 12);
        this.back  = new SkinFace(x + 12, y + 4, 8, 12);
    }
}

const HEAD_1 = new SkinHead(0 , 0 );
const HEAD_2 = new SkinHead(32, 0 );
const BODY_1 = new SkinBody(16, 16);
const BODY_2 = new SkinBody(16, 32);
const ARMR_1 = new SkinBody(40, 16);
const ARMR_2 = new SkinBody(40, 32);
const ARML_1 = new SkinBody(32, 48);
const ARML_2 = new SkinBody(48, 48);
const LEGR_1 = new SkinBody(0 , 16);
const LEGR_2 = new SkinBody(0 , 32);
const LEGL_1 = new SkinBody(16, 48);
const LEGL_2 = new SkinBody(0 , 48);

function scale(canvas, scale) {
    let scaledCanvas = document.createElement('canvas');
    let scaledCtx = scaledCanvas.getContext('2d');

    scaledCanvas.width = canvas.width * scale;
    scaledCanvas.height = canvas.height * scale;

    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height);

    return scaledCanvas;
}

function drawSkinHead(skinImg) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 12;
    canvas.height = 8;

    HEAD_1.front.draw(ctx, skinImg, 4, 0, 8, 8);
    HEAD_1.right.draw(ctx, skinImg, 0, 0, 4, 8);
    HEAD_2.front.draw(ctx, skinImg, 4, 0, 8, 8);
    HEAD_2.right.draw(ctx, skinImg, 0, 0, 4, 8);
    ctx.fillStyle = '#00000055';
    ctx.fillRect(0, 0, 4, 8);

    return canvas;
}

function drawSkinBody(skinImg) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 6;
    canvas.height = 4;

    BODY_1.front.draw(ctx, skinImg, 2, 0, 4, 4);
    BODY_1.right.draw(ctx, skinImg, 0, 0, 2, 4);
    BODY_2.front.draw(ctx, skinImg, 2, 0, 4, 4);
    BODY_2.right.draw(ctx, skinImg, 0, 0, 2, 4);
    ctx.fillStyle = '#00000055';
    ctx.fillRect(0, 0, 2, 4);

    return canvas;
}

function drawSkinLimb(skinImg, limb1, limb2) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 4;
    canvas.height = 4;

    limb1.front.draw(ctx, skinImg, 2, 0, 2, 4);
    limb1.right.draw(ctx, skinImg, 0, 0, 2, 4);
    limb2.front.draw(ctx, skinImg, 2, 0, 2, 4);
    limb2.right.draw(ctx, skinImg, 0, 0, 2, 4);
    ctx.fillStyle = '#00000055';
    ctx.fillRect(0, 0, 2, 4);

    return canvas;
}

function drawSkin(skinImg) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 16;
    canvas.height = 16;

    ctx.drawImage(drawSkinHead(skinImg), 2, 0, 12, 8);
    ctx.drawImage(drawSkinLimb(skinImg, ARML_1, ARML_2), 9, 8, 4, 4);
    ctx.drawImage(drawSkinBody(skinImg), 5, 8, 6, 4);
    ctx.drawImage(drawSkinLimb(skinImg, ARMR_1, ARMR_2), 3, 8, 4, 4);
    ctx.drawImage(drawSkinLimb(skinImg, LEGL_1, LEGL_2), 7, 12, 4, 4);
    ctx.drawImage(drawSkinLimb(skinImg, LEGR_1, LEGR_2), 5, 12, 4, 4);

    return scale(canvas, 10).toDataURL('image/png');
}

function resetSkinUploader() {
    skinUploader.style.backgroundImage = 'none';
    skinUploader.style.backgroundColor = '#FFF3';
    skinUploaderLabel.innerText = 'Click here to select a skin from your storage.';
    skinInput.value = null;
    skinFile = null;
    fileName = null;
    miniSkinDataURL = null;
    downloadButton.disabled = true;
}

function showSkinUploaderPreview(url) {
    skinUploader.style.backgroundImage = url ? `url(${url})` : 'none';
    skinUploader.style.backgroundColor = '#cccccc';
    skinUploaderLabel.innerText = '';
    downloadButton.disabled = false;
}

skinInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (!file || file.type !== 'image/png') {
        resetSkinUploader();
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
                resetSkinUploader();
                alert('Por favor selecciona un archivo de 64x64 px. [' + skinImg.width + 'x' + skinImg.height + ']');
                return;
            }

            miniSkinDataURL = drawSkin(skinImg);
            fileName = file.name.split('.').slice(0, -1).join('.');
            showSkinUploaderPreview(miniSkinDataURL);
        }
    };
    reader.readAsDataURL(skinFile);  
});

downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');

    link.href = miniSkinDataURL;
    link.download = `${fileName}_miniavatar.png`;
    link.click();
});