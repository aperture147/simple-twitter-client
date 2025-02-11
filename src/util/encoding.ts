export function urlsafeBtoa(data: number[] | Uint8Array | ArrayBuffer): string {
    const input = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
    return btoa(String.fromCharCode(...input))
    .replace(/\+/g, "-")
    .replace(/\//g, "_") 
    .replace(/=/g, "");
}