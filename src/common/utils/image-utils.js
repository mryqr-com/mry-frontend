import {isImage} from "@/common/utils/mime-utils";

function jpegOrPng(mimeType) {
    return mimeType === 'image/jpeg' || mimeType === 'image/png';
}

export function imageThumbnailUrl(file) {
    if (!file) {
        return null;
    }

    if (!isImage(file.type)) {
        return null;
    }

    if (jpegOrPng(file.type)) {
        return `${file.fileUrl}?x-oss-process=image/resize,m_fill,h_200,w_200/auto-orient,1`;
    }

    return file.fileUrl;
}


export function imageThumbnailUrlWide(file) {
    if (!file) {
        return null;
    }

    if (!isImage(file.type)) {
        return null;
    }

    if (jpegOrPng(file.type)) {
        return `${file.fileUrl}?x-oss-process=image/resize,m_fill,h_100,w_200/auto-orient,1`;
    }

    return file.fileUrl;
}


export function imageDisplayUrl(file) {
    if (!file) {
        return null;
    }

    if (!isImage(file.type)) {
        return;
    }

    if (jpegOrPng(file.type)) {
        return `${file.fileUrl}?x-oss-process=image/auto-orient,1`;
    }
    return file.fileUrl;
}

export function imageCompressable(mimeType) {
    return jpegOrPng(mimeType);
}
