
const transformToTelegramPhotos = (imageUrls) => {
    let mediaPhotos = [];

    // telegram limitation
    imageUrls = imageUrls.slice(0, 9);

    imageUrls.forEach(url => {
        let inputMediaPhoto = {
            type: 'photo',
            media: url
        };
        mediaPhotos.push(inputMediaPhoto);
    });

    return mediaPhotos;
}

const generateGallery = (content, imageUrls) => {

    let mediaPhotos = transformToTelegramPhotos(imageUrls);

    let msg = `${content.price} - ${content.type} ${content.street}\nrooms: ${content.rooms}, floor:${content.floor}\n${content.area} - ${content.pricePerSquareMeter}\n${content.link}`;

    mediaPhotos[0].caption = msg;

    return mediaPhotos;
};

const generateMsg = (content) => {

    let msg = '<strong>';

    for (var key in content) {
        if (key === 'title' || key === 'link') {
            continue;
        }

        let value = content[key];
        let v = `${key}: ${value} \n`;
        msg += v;
    }

    msg += '</strong>' + '\n' + item.title + '\n' + item.link;

    return msg;
}

module.exports = { generateGallery, generateMsg };