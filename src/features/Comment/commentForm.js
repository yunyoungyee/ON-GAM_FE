import { createButton } from '../../shared/components/button.js';
import { api } from "../../shared/api/api.js";

function getCurrentUser() {
    try {
        const rawData = localStorage.getItem('user');
        if (!rawData) {
            return null;
        }
        return JSON.parse(rawData);
    } catch (e) {
        console.error('user 파싱 에러', e);
        return null;
    }
}

export function CommentForm(postId) {
    let mode = "create";
    let editCommentId = null;
    const section = document.createElement("section");
    section.className = "comment-section";

    const textarea = document.createElement("textarea");
    textarea.className = "comment-textarea";
    textarea.placeholder = "댓글을 남겨주세요!";

    const action = document.createElement("div");
    action.className = "comment-action";

    const button = createButton({
        label: "댓글 등록",
        fullWidth: false
    });
    button.classList.add("comment-submit");

    document.addEventListener('commentEditRequest', (e) => {
        editMode(e.detail);
    })
    function editMode(comment) {
        console.log("editMode 호출");
        mode = "edit";
        editCommentId = comment.commentId;
        textarea.value = comment.content;
        button.textContent = "댓글 수정";

        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function handleEdit(e) {
        editMode(e.detail);
    };
    document.addEventListener('commentEditRequest', handleEdit);

    button.addEventListener("click", async () => {
        const content = textarea.value.trim();
        if (!content) {
            alert("댓글을 입력해주세요!");
            return;
        }

        const user = getCurrentUser();
        if (!user) {
            alert("로그인 후 이용해주세요.");
            return;
        }
        try {
            let result;
            const comment = {
                postId,
                userId: user.id,
                content,
            };
            if (mode === 'edit') {
                console.log("댓글 수정 시도:");
                result = await api.updateComment(editCommentId, { postId, userId: user.id, content });
                document.dispatchEvent(new CustomEvent('commentUpdate', {
                    detail: result.data,
                    bubbles: true
                }));
            } else {
                console.log("댓글 등록 시도:", comment);
                result = await api.createComment(comment);
                document.dispatchEvent(new CustomEvent('commentAdd', {
                    detail: result.data,
                    bubbles: true
                }));
            }
            textarea.value = "";
            button.textContent = "댓글 등록";
            mode = "create";
            editCommentId = null;
        } catch (error) {
            console.error("댓글 등록 실패:", error);
            alert("댓글 등록에 실패했습니다.");
        }
    });

    action.appendChild(button);
    section.append(textarea, action)
    section.editMode = editMode;
    return {
        element: section,
        editMode,
        cleanup() {
            document.removeEventListener('commentEditRequest', handleEdit);
        }
    };
}