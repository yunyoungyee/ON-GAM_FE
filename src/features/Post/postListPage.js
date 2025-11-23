import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { CreatePostCard } from './postCard.js';
import { navigate } from '../../core/router.js';
import { api } from '../../shared/api/api.js';
import { getCurrentUser } from '../../shared/util.js';

async function postRender(PostListContainer) {
  try {
    console.log('게시글 목록 조회 시도');
    const result = await api.getPosts();
    const posts = result.data;
    console.log('게시글 조회:', { posts });

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'post-list-slider';

    if (Array.isArray(posts)) {
      console.log('들어옴');
      posts.forEach(post => {
        const card = CreatePostCard(post);
        card.classList.add('post-card')
        card.addEventListener('click', () => {
          navigate(`/posts/${post.postId}`);
        });
        sliderContainer.appendChild(card);
      });
    }
    PostListContainer.appendChild(sliderContainer);
  } catch (error) {
    console.error('게시글 목록 조회 실패', error.message);
  }
}

export function PostListPage() {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader());

  const PostListContainer = document.createElement('main');
  PostListContainer.className = 'page post-list-page';

  const user = getCurrentUser();
  const introBox = document.createElement('div');
  introBox.className = 'intro-box';
  introBox.textContent = `${user.nickname}님 오늘의 기분은 어떠신가요?`;
  const createPostBtn = createButton({
    label: '게시글 작성',
    onClick: () => navigate('/posts/create'),
  });

  const introContainer = document.createElement('div');
  introContainer.className = 'intro-container';
  introContainer.append(introBox,createPostBtn);
  PostListContainer.append(introContainer);
  postRender(PostListContainer);
  fragment.appendChild(PostListContainer);
  return fragment;
}