import { getImageUrl } from "../../shared/api/api.js";

export function CreatePostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card card';

  //INFO: innerHTML은 XSS 위험존재(취약)
  // 제목
  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = post.title;

  // 메타 (좋아요, 댓글, 조회수)
  const meta = document.createElement('p');
  meta.className = 'post-card__meta';
  meta.textContent = `좋아요 ${post.likes}  댓글 ${post.comments}  조회수 ${post.views}`;

  // 날짜
  const date = document.createElement('span');
  date.className = 'post-card__date';
  date.textContent = post.createdAt.replace('T', ' ').slice(0, 19);

  // 상단 영역 (제목 + 메타 + 날짜)
  const top = document.createElement('div');
  top.className = 'post-card__top';
  top.append(title, meta, date);

  // 구분선
  const divider = document.createElement('hr');
  divider.className = 'post-card__divider';

  // 작성자 영역
  console.log(post.profileImageUrl)
  const author = document.createElement('div');
  author.className = 'post-card__author';
  author.innerHTML = `
    <div class="avatar">
      <img src=${getImageUrl(post.profileImageUrl)}></img>
    </div>
    <p>${post.authorNickname}</p>
  `;

  // 카드 전체 조립
  card.append(top, divider, author);
  return card;
}
