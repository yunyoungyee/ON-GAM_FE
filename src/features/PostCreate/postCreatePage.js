import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { api } from '../../shared/api/api.js';
import { navigate } from '../../core/router.js';
import { getCurrentUser } from '../../shared/util.js';

export function PostCreatePage() {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader({ showBack: true }));

  const postCreateContainer = document.createElement('main');
  postCreateContainer.className = 'page post-create-page';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = '게시글 작성';

  const form = document.createElement('div');
  form.className = 'form-stack post-create__form';
  const { field: titleField, input: titleInput } = createField();
  const { field: contentField, textarea: contentTextarea } = createTextarea();
  const helperField = createHelperText();
  form.append(
    titleField,
    contentField,
    helperField,
    createUploadField(),
  );

  const actions = document.createElement('div');
  actions.className = 'actions';
  const button = createButton({
    label: '완료',
    fullWidth: false,
  });
  button.classList.add("post-submit");
  actions.appendChild(button);


  titleInput.addEventListener('blur', () =>{
    const title = titleInput.value.trim();
    if(title.length>26){
      helperText(helperField, '*제목은 최대 26글자까지 가능합니다.');
    } else{
      helperText(helperField, '');
    }
  });

  button.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const content = contentTextarea.value.trim();

    if (!title || !content) {
      helperText(helperField, '*제목,내용을 모두 작성해주세요.');
      return;
    } else if(title.length>26){
      helperText(helperField, '*제목은 최대 26글자까지 가능합니다.');
      return;
    }

    const user = getCurrentUser();
    if(!user){
      alert('로그인 후 이용해주세요.');
      return;
    }

    try{
      const post = {
        title,
        content,
        userId: user.id,
      };
      console.log('게시글 생성 시도', post);
      const result = await api.createPost(post);
      console.log('게시글 생성 성공',result);
      navigate('/posts');

    } catch (error) {
      console.error('게시글 생성 실패:',error);
      alert('게시글 작성에 실패했습니다.');
    }
  });

  postCreateContainer.append(title, form, actions);
  fragment.appendChild(postCreateContainer);
  return fragment;
}

export function createField() {
  const field = document.createElement('div');
  field.className = 'form-field';
  const label = document.createElement('label');
  label.textContent = '제목*';
  const input = document.createElement('input');
  input.placeholder = '제목을 입력해주세요. (최대 26글자)';
  field.append(label, input);
  return { field, input };
}

export function createTextarea() {
  const field = document.createElement('div');
  field.className = 'form-field';
  const label = document.createElement('label');
  label.textContent = '내용*';
  const textarea = document.createElement('textarea');
  textarea.placeholder = '내용을 입력해주세요.';
  field.append(label, textarea);
  return { field, textarea };
}

export function createHelperText() {
  const helper = document.createElement('span');
  helper.className = 'helper-text';
  helper.textContent = '';
  return helper;
}

export function helperText(helperField, message) {
  helperField.textContent = message;
}

export function createUploadField() {
  const field = document.createElement('div');
  field.className = 'form-field';
  const label = document.createElement('label');
  label.textContent = '이미지';

  const uploadBox = document.createElement('label');
  uploadBox.className = 'upload-box';
  const button = document.createElement('span');
  button.className = 'upload-box__button';
  button.textContent = '파일 선택';
  const filename = document.createElement('span');
  filename.className = 'upload-box__filename';
  filename.textContent = '파일을 선택해주세요.';

  const input = document.createElement('input');
  input.type = 'file';
  input.hidden = true;
  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    filename.textContent = file ? file.name : '파일을 선택해주세요.';
  });

  uploadBox.append(button, filename, input);
  field.append(label, uploadBox);
  return field;
}