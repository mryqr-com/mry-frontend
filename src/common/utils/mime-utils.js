import FileType from 'file-type/browser';

export function mimeFor(blob) {
    if (blob.name && blob.name.endsWith('.svg')) {
        return Promise.resolve({ext: 'svg', mime: 'image/svg+xml'});
    }

    if (blob.name && blob.name.endsWith('.txt')) {
        return Promise.resolve({ext: 'txt', mime: 'text/plain'});
    }

    if (blob.name && blob.name.endsWith('.csv')) {
        return Promise.resolve({ext: 'csv', mime: 'text/csv'});
    }

    return FileType.fromBlob(blob);
}

export let accept = {
    IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/x-icon', 'image/svg+xml',
        'image/vnd.microsoft.icon', 'image/avif', 'image/webp', 'image/apng'],
    DOCUMENT: ['application/pdf',
        'text/plain',
        'text/csv',
        'text/html',
        'application/x-msi',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint',
        'application/vnd.oasis.opendocument.presentation',
    ],
    VIDEO: ['video/x-matroska', 'video/mp4', 'video/x-msvideo', 'video/x-ms-wmv',
        'video/quicktime', 'video/mpeg', 'video/webm', 'video/ogg'],
    AUDIO: ['audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/flac', 'audio/wav', 'audio/x-wav'],
    COMPRESSED: ['application/x-rar-compressed', 'application/zip', 'application/x-zip-compressed', 'application/x-7z-compressed',
        'application/gzip', 'application/x-arj', 'application/x-tar', 'application/x-compress']
};

export let allViewableAcceptTypes = [...accept.VIDEO, ...accept.IMAGE, ...accept.DOCUMENT, ...accept.AUDIO];

let iconMap = new Map();

iconMap.set('application/pdf', 'pdf.svg');
iconMap.set('image/jpeg', 'jpg.svg');
iconMap.set('image/png', 'png.svg');
iconMap.set('image/gif', 'gif.svg');
iconMap.set('image/svg+xml', 'svg.svg');
iconMap.set('image/x-icon', 'ico.svg');
iconMap.set('video/mp4', 'mp4.svg');
iconMap.set('video/x-msvideo', 'avi.svg');
iconMap.set('audio/mpeg', 'mp3.svg');
iconMap.set('text/plain', 'txt.svg');
iconMap.set('audio/wav', 'wav.svg');


export function iconFor(mimeType) {

    let icon = iconMap.get(mimeType);
    if (icon) {
        return icon;
    }

    if (accept.VIDEO.includes(mimeType)) {
        return 'mov.svg';
    }

    if (accept.AUDIO.includes(mimeType)) {
        return 'wav.svg';
    }

    if (['application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword', 'application/vnd.oasis.opendocument.text'].includes(mimeType)) {
        return 'doc.svg';
    }

    if (['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel', 'application/vnd.oasis.opendocument.spreadsheet'].includes(mimeType)) {
        return 'xls.svg';
    }

    if (['application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-powerpoint', 'application/vnd.oasis.opendocument.presentation'].includes(mimeType)) {
        return 'ppt.svg';
    }


    if (accept.COMPRESSED.includes(mimeType)) {
        return 'zip.svg';
    }

    return 'file.svg';
}

export function isImage(mimeType) {
    if (!mimeType) {
        return false;
    }

    return accept.IMAGE.includes(mimeType);
}

export function isVideo(mimeType) {
    if (!mimeType) {
        return false;
    }

    return accept.VIDEO.includes(mimeType);
}

export function isAudio(mimeType) {
    if (!mimeType) {
        return false;
    }

    return accept.AUDIO.includes(mimeType);
}