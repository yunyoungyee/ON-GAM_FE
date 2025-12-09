import { updateElement } from "./updateElement.js";
import { createElement } from "./createElement.js";

export function diffChildren(parentEl, newChildren, oldChildren) {

    // --- 1. oldChildren을 keyMap / noKeyList로 분리 ---
    const oldKeyMap = new Map();
    const oldNoKeyList = [];

    oldChildren.forEach((child, i) => {
        const key = child?.props?.key;
        if (key != null) oldKeyMap.set(key, { child, index: i });
        else oldNoKeyList.push({ child, index: i });
    });

    const usedOldIndices = new Set();

    // newChildren을 기반으로 새로운 DOM 순서를 구성하기 위한 배열
    const newDomOrder = [];

    let oldNoKeyCursor = 0;

    // --- 2. newChildren 순회하며 old 매칭 ---
    newChildren.forEach((newChild, newIndex) => {
        const key = newChild?.props?.key;
        let oldMatch = null;

        if (key != null && oldKeyMap.has(key)) {
            // KEY 매칭 성공
            oldMatch = oldKeyMap.get(key);
        } else if (key == null) {
            // KEY 없는 경우 oldNoKeyList에서 순서대로 매칭
            if (oldNoKeyCursor < oldNoKeyList.length) {
                oldMatch = oldNoKeyList[oldNoKeyCursor++];
            }
        }

        // 해당 newIndex 위치에 들어가야 할 실제 DOM 노드
        let existingDom = parentEl.childNodes[newIndex];

        if (oldMatch) {
            const oldChild = oldMatch.child;
            const oldIndex = oldMatch.index;

            usedOldIndices.add(oldIndex);

            // 1) oldChild → newChild로 updateElement 수행
            updateElement(parentEl, newChild, oldChild, oldIndex);

            const updatedDom = parentEl.childNodes[oldIndex];

            // 2) 필요한 경우 DOM 이동 처리 (노드 위치 조정)
            if (updatedDom !== existingDom) {
                parentEl.insertBefore(updatedDom, existingDom || null);
            }

            newDomOrder.push(updatedDom);

        } else {
            // 새 노드 생성
            const newDom = createElement(newChild);
            parentEl.insertBefore(newDom, existingDom || null);
            newDomOrder.push(newDom);
        }
    });

    // --- 3. oldChildren 중에서 사용되지 않은 노드는 삭제 ---
    oldChildren.forEach((oldChild, i) => {
        if (!usedOldIndices.has(i)) {
            const domToRemove = parentEl.childNodes[i];
            if (domToRemove) parentEl.removeChild(domToRemove);
        }
    });
}
