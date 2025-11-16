import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { CreatePostCard } from './postCard.js';
import { navigate } from '../../core/router.js';
import { api } from '../../shared/api/api.js';

async function postRender(PostListContainer) {
  try{
    console.log("게시글 목록 조회 시도");
    const result = await api.getPosts();
    const posts = result.data;
    console.log('회원가입 시도:', {posts});
    const list = PostListContainer.querySelector("#post-list-container");
    if (Array.isArray(posts)){
      console.log("들어옴");
      posts.forEach(post=>{
        const card = CreatePostCard(post);
        card.addEventListener('click',()=>{
          navigate(`/posts/${post.postId}`);
        });
        list.appendChild(card);
      });
    }
  }catch(error) {
    console.error("게시글 목록 조회 실패",error.message);
  }
  
}

export function PostListPage(){
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader());

  const PostListContainer = document.createElement('main');
  PostListContainer.className = 'page post-list-page';
  PostListContainer.innerHTML=`
    <section class="post-list__intro">
      
    </section>
    <p id="intro-text">
      안녕하세요,<br/>
      아무 말 대잔치 <span class="hightlight">게시판</span> 입니다.
    </p>
    <div id="post-create-btn-container"></div>

    <div class="card-list" id="post-list-container"></div>
  `;
  
  const createPostBtn = createButton({
    label: '게시글 작성',
    onClick: () => navigate('/posts/create'),
  });
  PostListContainer.querySelector('#post-create-btn-container').appendChild(createPostBtn);

  postRender(PostListContainer);
  fragment.appendChild(PostListContainer);
  return fragment;
}