import { getImageUrl } from "../../shared/api/api.js";

export function CreatePostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card card';

  const postArea = document.createElement('div');
  postArea.className = 'post-card__preview'
  const postPreview = document.createElement('img');
  postPreview.className = 'post-preview'
  postPreview.src = getImageUrl(post.postImageUrl);
  postArea.append(postPreview);

  const title = document.createElement('h3');
  title.className = 'card-title';
  title.textContent = post.title;


  const meta = document.createElement('p');
  meta.className = 'post-card__meta';
  const likesIcon = document.createElement('span');
  likesIcon.className = 'icon-likes';
  meta.append(likesIcon, `${post.likes} `);
  const commentIcon = document.createElement('span');
  commentIcon.className = 'icon-comments';
  meta.append(commentIcon, `${post.comments} `);
  const viewIcon = document.createElement('span');
  viewIcon.className = 'icon-views';
  meta.append(viewIcon, `${post.views} `);


  const date = document.createElement('span');
  date.className = 'post-card__date';
  date.textContent = post.createdAt.replace('T', ' ').slice(0, 19);


  const top = document.createElement('div');
  top.className = 'post-card__top';
  top.append(postArea);

  const middle = document.createElement('div');
  middle.className = 'post-card__middle';
  middle.append(title, meta)

  const divider = document.createElement('hr');
  divider.className = 'post-card__divider';


  console.log(post.profileImageUrl)
  const author = document.createElement('div');
  author.className = 'post-card__author';
  author.innerHTML = `
    <div class="avatar-mini">
      <img src=${getImageUrl(post.profileImageUrl)}></img>
    </div>
    <p>${post.authorNickname}</p>
  `;


  card.append(top, middle, divider, author);
  return card;
}
