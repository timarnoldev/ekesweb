export function rgbToHex(r:number, g:number, b:number) {
    return "0x" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c:number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}


export const gen_color_table = [
    0x000000, 0xAA0000, 0x00AA00, 0x00AAAA, 0x0000AA, 0xAA00AA, 0xAA5500, 0xAAAAAA,
    0x555555, 0x5555FF, 0x55FF55, 0x55FFFF, 0xFF5555, 0xFF55FF, 0xFFFF55
]