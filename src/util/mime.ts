import { TwitterClientUserException } from "../exception"

const GIF_SIGNATURE = [0x47, 0x49, 0x46, 0x38]
const JPEG_SIGNATURE = [0xFF, 0xD8]
const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]
const WEBP_SIGNATURE = [0x52, 0x49, 0x46, 0x46, null, null, null, null, 0x57, 0x45, 0x42, 0x50]

const MP4_SIGNATURE = [0x66, 0x74, 0x79, 0x70]
// FIXME: What is quicktime file signature?
// const MOV_SIGNATURE = [0x6D, 0x6F, 0x6F, 0x76]

export async function detectMediaMimeExt(
    data: Blob
): Promise<string> {
    const slicedBlob = await data.slice(0, 12).bytes()
    if (_hasSignature(GIF_SIGNATURE, slicedBlob))
        return 'image/gif'
    if (_hasSignature(JPEG_SIGNATURE, slicedBlob))
        return 'image/jpeg'
    if (_hasSignature(PNG_SIGNATURE, slicedBlob))
        return 'image/png'
    if (_hasSignature(WEBP_SIGNATURE, slicedBlob))
        return 'image/webp'
    if (_hasSignature(MP4_SIGNATURE, slicedBlob))
        return 'video/mp4'
    throw new TwitterClientUserException('unsupported media type')
}

function _hasSignature(
    signature: (number | null)[],
    data: Uint8Array
): boolean {
    if (signature.length > data.length) return false
    // https://en.wikipedia.org/wiki/List_of_file_signatures
    for (let i = 0; i < signature.length; i++) {
        if (signature[i] === null) continue
        if (data[i] !== signature[i]) return false
    }
    return true
}