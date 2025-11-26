import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { createModal } from '../../shared/components/modal.js';
import { api, getImageUrl } from '../../shared/api/api.js';
import { navigate } from '../../core/router.js';
import { CommentForm } from '../Comment/CommentForm.js';
import { CommentList } from '../Comment/commentList.js';
import { getCurrentUser } from '../../shared/util.js';

export async function PostDetailPage(postId) {

  try {
    // 게시글 API
    console.log("게시글 조회 시도");
    const result = await api.getPost(postId);
    const post = result.data;
    console.log(post);


    const fragment = document.createDocumentFragment();
    fragment.appendChild(createHeader({ showBack: true }));

    const postDetailContainer = document.createElement('main');
    postDetailContainer.className = 'page post-detail-page';

    /*
    //콜백 함수 사용(목적: )
    const commentList = CommentList(postId, {
      onEdit: (comment) => {
        commentForm.editMode(comment)
      }
    });

    //콜백 함수 사용(목적: 댓글 저장 -> 화면 그리기 -> 리렌더링)
    const commentForm = CommentForm(postId, (newComment) => {
      commentList.addComment(newComment);
      commentList.commentRender();
    });
*/
    // commentForm은 실행할 파라미터 자체가 없어짐(콜백 제거)
    const commentForm = CommentForm(postId);
    // commentList는 onEdit을 넘기지 않아도 됨
    const commentList = CommentList(postId);
    const article = document.createElement('article');
    article.className = 'post-detail';


    // 게시글 상단 조립 시작
    const title = document.createElement('h1');
    title.textContent = post.title;

    const topRow = document.createElement('div');
    topRow.className = 'post-detail__top';

    const author = document.createElement('div');
    author.className = 'post-detail__author';
    author.innerHTML = `
    <div class="avatar">
      <img src=${getImageUrl(post.profileImageUrl)}></img>
    </div>
    <div>
      <strong>${post.authorNickname}</strong>
      <span>${post.createdAt.replace('T', ' ').slice(0, 19)}</span>
    </div>
  `;

    const actions = document.createElement('div');
    actions.className = 'post-detail__actions';

    const editButton = document.createElement('button');
    editButton.textContent = '수정';
    editButton.addEventListener('click', () => {
      console.log("수정 맞음?");
      console.log(postId);
      navigate(`/posts/edit/${postId}`);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '삭제';
    deleteButton.addEventListener('click', () => {
      createModal({
        title: '게시글을 삭제할까요?',
        description: '작성된 게시글과 댓글은 삭제됩니다.',
        onConfirm: async () => {
          try {
            await api.deletePost(postId);
            navigate('/posts');
          } catch (error) {
            console.log('게시글 삭제 실패', error);
            alert('게시글 삭제에 실패했습니다.');
          }
        },
      });
    });
    //게시글 상단 조립 완료
    actions.append(editButton, deleteButton);
    const user = getCurrentUser();
    if (user.id === post.authorId) {
      topRow.append(author, actions);
    }
    else {
      topRow.append(author);
    }


    //게시글 조립 시작
    const postArea = document.createElement('div');
    postArea.className = 'post-detail__image';
    const image = document.createElement('img');
    image.src = getImageUrl(post.postImageUrl);
    postArea.appendChild(image);

    const content = document.createElement('p');
    content.className = 'post-detail__content';
    content.textContent = post.content;

    const metaInfo = document.createElement('div');
    metaInfo.className = 'post-detail__metaInfo';
    const metaInfoData = [
      { label: '관심', value: post.likes },
      { label: '댓글', value: post.comments },
      { label: '조회', value: post.views },
    ];
    metaInfoData.forEach(({ label, value }) => {
      const box = document.createElement('div');
      box.className = 'metaInfo-box';
      box.innerHTML = `
      <span>${label} ${value}</span>`;
      metaInfo.appendChild(box);
    });
    // 게시글 조립 완료


    const layoutContainer = document.createElement('div');
    layoutContainer.className = 'post-detail__layout';

    // 왼쪽 영역: 이미지 + 작성자 정보
    const leftSection = document.createElement('div');
    leftSection.className = 'post-detail__left';
    leftSection.append(postArea, topRow); // 이미지 아래 작성자

    // 오른쪽 영역: 제목 + 내용 + 메타정보
    const rightSection = document.createElement('div');
    rightSection.className = 'post-detail__right';
    rightSection.append(title, content, metaInfo);

    const divider = document.createElement('div');
    divider.className = 'post-detail__divider';
    /*
        // 수정/삭제 버튼은 우측 상단에 두는 게 자연스러움 (작성자인 경우만)
        if (user.id === post.authorId) {
          leftSection.append(actions);
        }
    
    /*
        article.append(title, topRow, postArea, content, metaInfo);
        postDetailContainer.append(article);
        layoutContainer.append(leftSection, rightSection);
        article.append(leftSection, rightSection);
        */
    article.append(leftSection, divider, rightSection);
    postDetailContainer.append(article);
    postDetailContainer.appendChild(commentForm.element);
    postDetailContainer.appendChild(commentList.element);
    const cleanup = () => {
      commentForm.cleanup?.();
      commentList.cleanup?.();
    };
    fragment.appendChild(postDetailContainer);
    return {
      element: fragment,
      cleanup,
    };
  } catch (error) {
    console.error("실패", error.message);
  }
}
