import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { api } from '../../shared/api/api.js';
import { createField, createTextarea, createHelperText, helperText, createUploadField } from '../PostCreate/postCreatePage.js';
import { getCurrentUser } from '../../shared/util.js';
import { navigate } from '../../core/router.js';

export async function PostEditPage(postId) {
  // 게시글 API
  console.log("게시글 수정을 위한 요청 시도");
  const result = await api.getPost(postId);
  const post = result.data;

  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader({ showBack: true }));

  const postEditContainer = document.createElement('main');
  postEditContainer.className = 'page post-edit-page';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = '게시글 수정';

  const form = document.createElement('div');
  form.className = 'form-stack';
  const { field: titleField, input: titleInput } = createField();
  titleInput.value = post.title;
  const { field: contentField, textarea: contentTextarea } = createTextarea();
  contentTextarea.value = post.content;
  const helperField = createHelperText();
  const { field: uploadField, getFile} = createUploadField();
  form.append(
    titleField,
    contentField,
    helperField,
    uploadField,
  );

  const actions = document.createElement('div');
  actions.className = 'actions';
  const button = createButton({
    label: '수정하기',
    fullWidth: false,
  })
  button.classList.add("comment-submit");
  actions.appendChild(button);


  titleInput.addEventListener('blur', () => {
    const title = titleInput.value.trim();
    if (title.length > 26) {
      helperText(helperField, '*제목은 최대 26글자까지 가능합니다.');
    } else {
      helperText(helperField, '');
    }
  })

  button.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();

    if (!title || !content) {
      helperText(helperField, '*제목,내용을 모두 작성해주세요.');
      return;
    } else if (title.length > 26) {
      helperText(helperField, '*제목은 최대 26글자까지 가능합니다.');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    try {
      const userId = user.id;
      const editResult = await api.updatePost(postId,{title,content,userId, postImage: getFile()});
      console.log('게시글 수정 성공', editResult);
      navigate(`/posts/${postId}`);

    } catch (error) {
      console.error('게시글 생성 실패:', error);
      alert('게시글 작성에 실패했습니다.');
    }
  });

  postEditContainer.append(title, form, actions);
  fragment.appendChild(postEditContainer);
  return fragment;
}