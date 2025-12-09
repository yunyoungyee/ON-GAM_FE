export function h(type, props, ...children) {
    return {
        type,
        props: props || {},
        children: children.flat().map((child) =>
            typeof child === "string"
                ? {
                    type: "TEXT",
                    props: { nodeValue: child },
                    children: [],
                }
                : child
        ),
    };
}

// type을 받아서 DOM요소로 만드는 메서드
export function createElement(node) {
    if (node.type === "TEXT") {
        return document.createTextNode(node.props.nodeValue);
    }

    const el = document.createElement(node.type);

    Object.entries(node.props || {})
        .filter(([attr, value]) => value !== null && value !== undefined)
        .forEach(([attr, value]) => {
            if (typeof value === "boolean") {
                if (value) {
                    el.setAttribute(attr, "");
                } else {
                    el.removeAttribute(attr);
                }
                return;
            }
            el.setAttribute(attr, value);
        });

    node.children.map(createElement).forEach((child) => el.appendChild(child));

    return el;
}
