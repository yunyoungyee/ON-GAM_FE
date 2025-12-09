export function updateAttributes(targetEl, newProps, oldProps) {
    const setAttr = (el, attr, value) => {
        if (value === null || value === undefined) {
            return el.removeAttribute(attr);
        }
        if (typeof value === "boolean") {
            if (value) {
                el.setAttribute(attr, "");
            } else {
                el.removeAttribute(attr);
            }
            return;
        }
        el.setAttribute(attr, value);
    };
    // 달라지거나 추가된 Props를 반영
    for (const [attr, value] of Object.entries(newProps)) {
        if (oldProps[attr] === value) continue;
        setAttr(targetEl, attr, value);
    }

    // 없어진 props를 attribute에서 제거
    for (const attr of Object.keys(oldProps)) {
        if (attr in newProps) continue;
        targetEl.removeAttribute(attr);
    }
}
