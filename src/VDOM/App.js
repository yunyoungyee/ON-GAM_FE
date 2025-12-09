// h 함수를 외부에서 가져옵니다.
import { h } from "./createElement.js";
import { updateElement } from "./updateElement.js";

export const oldState = [
    { id: 1, completed: false, content: "todo list item 1" },
    { id: 2, completed: true, content: "todo list item 2" },
];

export const newState = [
    { id: 1, completed: true, content: "todo list item 2" },
    { id: 2, completed: true, content: "todo list item 1 update" },
    { id: 3, completed: false, content: "todo list item 3" },
];

export const render = (state) =>
    h(
        "div",
        { id: "app" },
        h(
            "ul",
            null,
            state.map(({ id, completed, content }) =>
                h(
                    "li",
                    { key: id, class: completed ? "completed" : null },
                    h("input", {
                        type: "checkbox",
                        class: "toggle",
                        // checked 속성은 boolean 값으로 전달됩니다.
                        checked: completed,
                    }),
                    content, // 텍스트 노드는 문자열로 전달됩니다.
                    h("button", { class: "remove" }, "삭제")
                )
            )
        ),
        h(
            "form",
            null,
            h("input", { type: "text" }),
            h("button", { type: "submit" }, "추가")
        )
    );

const oldNode = render(oldState);
const newNode = render(newState);

const $root = document.createElement("div");

// 1. 초기 렌더링
document.body.appendChild($root);
updateElement($root, oldNode);

// 2. 1.5초 뒤 업데이트 실행
setTimeout(() => {
    // 이전 노드와 새 노드를 비교하여 DOM 업데이트
    updateElement($root, newNode, oldNode);
}, 1500);
