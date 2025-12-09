import { createElement } from "./createElement.js";
import { updateAttributes } from "./updateAttributes.js";
import { diffChildren } from "./diffChildren.js";

export function updateElement(parent, newNode, oldNode, index = 0) {
    const targetEl = parent.childNodes[index];

    // 1. 노드 삭제 (oldNode는 있고, newNode는 없을 때)
    if (!newNode && oldNode) {
        return parent.removeChild(targetEl);
    }

    // 2. 노드 추가 (newNode는 있고, oldNode는 없을 때)
    if (newNode && !oldNode) {
        return parent.appendChild(createElement(newNode));
    }

    // 3. 텍스트 노드 비교
    if (newNode.type === "TEXT" && oldNode.type === "TEXT") {
        if (newNode.props.nodeValue !== oldNode.props.nodeValue) {
            targetEl.nodeValue = newNode.props.nodeValue;
        }
        return;
    }

    // 4. 태그 타입 변경 (예: div -> p)
    if (newNode.type !== oldNode.type) {
        return parent.replaceChild(createElement(newNode), targetEl);
    }

    // 5. 속성 업데이트
    updateAttributes(targetEl, newNode.props || {}, oldNode.props || {});

    // (after) 6. 자식 노드 diff 처리
        diffChildren(
        targetEl,
        newNode.children || [],
        oldNode.children || []
    );
    /*
    // (before)6. 자식 노드 재귀적 처리
    const maxLength = Math.max(
        newNode.children.length,
        oldNode.children.length
    );
    for (let i = 0; i < maxLength; i++) {
        updateElement(
            targetEl, // 현재 노드를 부모로 설정
            newNode.children[i],
            oldNode.children[i],
            i
        );
    }
        */
}
