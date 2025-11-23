import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { validationPassword } from '../../shared/validation.js';
import { getCurrentUser } from '../../shared/util.js';
import { api } from '../../shared/api/api.js';
import { navigate } from '../../core/router.js';
import { createField } from '../../shared/components/formField.js';

export function PasswordEditPage() {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader());

  const main = document.createElement('main');
  main.className = 'page password-edit-page';

  const panel = document.createElement('section');
  panel.className = 'panel password-panel tablet-only';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = '비밀번호 수정';

  const fields = document.createElement('div');
  fields.className = 'form-stack';
  const {
    field: pwField,
    input: pwInput, 
    helper: pwHelper,
  } = createField('비밀번호', 'password','비밀번호를 입력하세요', ' ');
  const {
    field: pwCheckField,
    input: pwCheckInput,
    helper: pwCheckHelper,
  } = createField('비밀번호 확인','password', '비밀번호를 한번 더 입력하세요', ' ');
  fields.append(
    pwField,
    pwCheckField,
  );

  const actions = document.createElement('div');
  actions.className = 'actions';
  const button = createButton({
    label: '수정하기'
  });
  button.disabled = true;
  actions.appendChild(button);

  pwInput.addEventListener('blur', () => {
    const password = pwInput.value.trim();
    const pwCheck = pwCheckInput.value.trim();
    if (!password) {
      helperText(pwHelper, '*비밀번호를 입력해주세요.');
    } else if (!validationPassword(password)){
      helperText(pwHelper, '*비밀번호는 8~20자, 대/소문자·숫자·특수문자를 모두 포함해야 합니다.')
    } else if(pwCheck && !(password===pwCheck)){
      helperText(pwHelper, '*비밀번호 확인과 다릅니다.');
    } else{
      helperText(pwHelper,'');
    }
    handleInput();
  });

  pwCheckInput.addEventListener('blur', () => {
    const password = pwInput.value.trim();
    const pwCheck = pwCheckInput.value.trim();
    if(!pwCheck){
      helperText(pwCheckHelper, '*비밀번호를 한번 더 입력해주세요.');
    } else if(password && !(password===pwCheck)){
      helperText(pwCheckHelper,'*비밀번호와 다릅니다.');
    } else{
      helperText(pwCheckHelper,'');
    }
    handleInput();
  })

  function handleInput(){
  const validPw = pwHelper.textContent.trim() === '';
  const validPwCheck = pwCheckHelper.textContent.trim() === '';
  const blankCheck = pwCheckInput.value.trim() !=''; 

  const isValid = validPw && validPwCheck && blankCheck;

  // 항상 버튼 상태 업데이트
  button.classList.toggle('active', isValid);
  button.disabled = !isValid;
  }

  button.addEventListener('click', async () => {
    const user = getCurrentUser();
    const newPassword = pwInput.value.trim();
    try{
      console.log('비밀번호 수정 시도', newPassword);
      const result = await api.updatePassword(user.id, newPassword);
      console.log('비밀번호 수정 성공',result);
      navigate('/login');
    } catch (error) {
      console.error('비밀번호 수정 실패', error);
      alert('비밀번호 수정에 실패했습니다.');
    }
  })


  panel.append(title, fields, actions);
  main.appendChild(panel);
  fragment.appendChild(main);
  return fragment;
}

function helperText(helperField, message) {
  helperField.textContent = message;
}