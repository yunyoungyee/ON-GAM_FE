import { CreateCommentCard } from "./commentCard.js";
import { api } from "../../shared/api/api.js";

//export function CommentList(postId, { onEdit }) {
export function CommentList(postId) {
    const CommentListContainer = document.createElement("div");
    CommentListContainer.className = "comment-list";

    async function commentRender() {
        const result = await api.getCommentByPost(postId);
        const comments = result.data;
        console.log(comments);
        CommentListContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();
        comments.forEach(comment => {
            fragment.appendChild(CreateCommentCard(comment, { onEdit: handleEdit, onDelete }));
        });
        CommentListContainer.appendChild(fragment);
    }

    function addComment(newComment) {
        CommentListContainer.appendChild(CreateCommentCard(newComment, { onEdit: handleEdit, onDelete }));
    }
    async function onDelete(commentId) {
        await api.deleteComment(commentId);
        const targetComment = document.getElementById(`comment-${commentId}`);
        if (targetComment) {
            targetComment.remove();
        }
    }
    /*
    async function handleEdit(comment) {
        console.log("handleEdit호출");
        if (typeof onEdit === "function") {
            onEdit(comment);
        }
    }
        */
    function handleEdit(comment) {
        document.dispatchEvent(new CustomEvent('commentEditRequest', {
            detail: comment,
            bubbles: true
        }));
    }

    function handleAdd(e) {
        addComment(e.detail);
    }

    function handleUpdate(){
        commentRender()
    }

    document.addEventListener('commentUpdate', handleUpdate);
    document.addEventListener('commentAdd', handleAdd);
    commentRender();
    return {
        element: CommentListContainer,  // PostDetailPage에서 appendChild 할 애
        commentRender,
        addComment,
        cleanup(){
            document.removeEventListener('commentUpdate', handleUpdate);
            document.removeEventListener('commentAdd', handleAdd);
        }
    };
}