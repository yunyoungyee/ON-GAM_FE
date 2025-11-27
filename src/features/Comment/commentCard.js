import { getImageUrl } from "../../shared/api/api.js";
import { createModal } from "../../shared/components/modal.js";
import { getCurrentUser } from "../../shared/util.js";

function createActions(comment, { onEdit, onDelete }) {
  const actions = document.createElement("div");
  actions.className = "comment-card__actions";

  ["수정", "삭제"].forEach((label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = "comment-card__button";

    button.dataset.commentId = comment.commentId;

    button.addEventListener("click", (e) => {
      const id = e.target.dataset.commentId;

      if (label === "삭제") {
        console.log("버튼 누름");
        createModal({
          title: '댓글을 삭제하시겠습니까?',
          description: '삭제한 내용은 복구 할 수 없습니다.',
          onConfirm: () => onDelete(comment.commentId),
        });
      } else if (label === "수정") {
        console.log("수정 클릭");
        onEdit(comment);
      }
    });
    actions.appendChild(button);
  });

  return actions;
}


export function CreateCommentCard(comment, { onEdit, onDelete }) {
  const user = getCurrentUser();
  const card = document.createElement('div');
  card.id = `comment-${comment.commentId}`;
  card.className = 'comment-card';

  const header = document.createElement("div");
  header.className = "comment-card__header";

  const avatar = document.createElement("div");
  avatar.className = "comment-card__avatar";
  const profileImg = document.createElement('img');
  profileImg.src = getImageUrl(comment.profileImageUrl);
  avatar.appendChild(profileImg);


  const info = document.createElement("div");
  info.className = "comment-card__info";

  const authorRow = document.createElement("div");
  authorRow.className = "comment-card__author-row";

  const commenter = document.createElement("span");
  commenter.className = "comment-card__author";
  commenter.textContent = comment.commenterNickname;

  const date = document.createElement("span");
  date.className = "comment-card__date";
  date.textContent = comment.updatedAt.replace('T', ' ').slice(0, 19);

  const content = document.createElement("div");
  content.className = "comment-card__content";
  content.textContent = comment.content;

  authorRow.append(commenter, date);
  info.append(authorRow, content);
  header.append(avatar, info);
  card.appendChild(header);
  if (user.id === comment.userId) {
    const action = createActions(comment, { onEdit, onDelete });
    card.appendChild(action);
  }
  return card;
}
