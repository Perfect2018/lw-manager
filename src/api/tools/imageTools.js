//压缩图片
export function imageToBase64(url, width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = url;

    return new Promise(resolve => {
        image.onload = function () {
            ctx.drawImage(image, 0, 0, width, height);
            let data = canvas.toDataURL('image/jpeg', 1);//quality 图片质量
            resolve(data)
        }
    }, reject => {
        reject()
    })
}
