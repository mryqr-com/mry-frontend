export function noBorder() {
    return {
        type: 'NONE',
        width: 1,
        sides: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
        color: 'rgba(220, 223, 230, 1)'
    };
}

export function defaultAppearanceStyle(vPadding = 0, hPadding = 15) {
    return {
        backgroundColor: controlForegroundColor,
        borderRadius: 0,
        shadow: {
            width: 6,
            color: 'rgba(0, 0, 0, 0.15)'
        },
        border: noBorder(),
        vPadding: vPadding,
        hPadding: hPadding,
    };
}

export function defaultSolidBorder() {
    return {
        type: 'SOLID',
        width: 1,
        sides: ['TOP', 'BOTTOM', 'LEFT', 'RIGHT'],
        color: 'rgba(220, 223, 230, 1)'
    };
}

export function noShadow() {
    return {
        width: 0,
        color: 'rgba(0, 0, 0, 0.1)'
    };
}

export function noBorderRadius() {
    return {
        radius: 0,
        corners: ['TOP_LEFT', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM_RIGHT']
    };
}

export function fontStyle(size, bold, color) {
    return {
        fontFamily: "默认",
        fontSize: size,
        bold: bold,
        italic: false,
        color: color,
    };
}

export let primaryThemeColor = '#00bfff';
export let oppositeThemeColor = '#FF8C00';
export let primaryTextColor = '#303133';
export let regularTextColor = '#606266';
export let secondaryTextColor = '#909399';
export let controlForegroundColor = 'rgba(255, 255, 255, 1)';
// export let controlForegroundColor = 'rgba(246, 247, 252, 1)';

