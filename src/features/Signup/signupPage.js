import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { navigate } from '../../core/router.js';
import { validationEmail, validationPassword, validationNickname } from '../../shared/validation.js';
import { api } from '../../shared/api/api.js';

export function SignupPage() {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader({ showBack: true, showProfile:false}));

  const signupContainer = document.createElement('main');
  signupContainer.className = 'page signup-page';

  signupContainer.innerHTML = `
    <section class="panel signup-panel tablet-only">
      <h1 class="page-title">회원가입</h1>

      <div class="profile-placeholder">+</div>
      <span class="helper-text profile-helper"></span>

      <form class="form-stack" id="signup-form">
        <div class="form-field">
          <label for="email">이메일*</label>
          <input id="email" name="email" type="text" placeholder="이메일을 입력하세요" />
          <span class="helper-text" id="emailHelper"></span>
        </div>
        <div class="form-field">
          <label for="password">비밀번호*</label>
          <input id="password" name="password" type="password" placeholder="비밀번호를 입력하세요" />
          <span class="helper-text" id="passwordHelper"></span>
        </div>
        <div class="form-field">
          <label for="pwCheck">비밀번호 확인*</label>
          <input id="pwCheck" name="pwCheck" type="password" placeholder="비밀번호를 한번 더 입력하세요" />
          <span class="helper-text" id="pwCheckHelper"></span>
        </div>
        <div class="form-field">
          <label for="nickname">닉네임*</label>
          <input id="nickname" name="nickname" type="text" placeholder="닉네임을 입력하세요" />
          <span class="helper-text" id="nickname"></span>
        </div>

        <div class="actions">
          <div id="signup-btn-container"></div>
          <button type="button" class="link-to-login">로그인하러 가기</button>
        </div>
      </form>
    </section>
  `;

  const signupForm = signupContainer.querySelector('#signup-form');
  const signupBtnContainer = signupContainer.querySelector('#signup-btn-container');
  const toLoginBtn = signupContainer.querySelector('.link-to-login');
  const $ = (id) => signupContainer.querySelector(`#${id}`);

  const inputs = {
    email: signupContainer.querySelector('#email'),
    password: signupContainer.querySelector('#password'),
    pwCheck: signupContainer.querySelector('#pwCheck'),
    nickname: signupContainer.querySelector('#nickname'),
  };
  
  const helpers = {
    email: $('emailHelper'),
    password: $('passwordHelper'),
    pwCheck: $('pwCheckHelper'),
    nickname: $('nicknameHelper'),
  };

  const signupBtn = createButton({
    label: '회원가입',
    type: 'submit',
    fullWidth: true,
  });
  signupBtn.disabled = true;
  signupBtnContainer.appendChild(signupBtn);

  const validation = {
    email: {
      validator: (value) => validationEmail(value),
      messages: {
        empty: '*이메일을 입력해주세요.',
        invalid:
          '올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)',
      },
    },
    password: {
      validator: (value) => validationPassword(value),
      messages: {
        empty: '*비밀번호를 입력해주세요.',
        invalid:
          '*비밀번호는 8~20자, 대/소문자·숫자·특수문자를 모두 포함해야 합니다.',
      },
    },
    pwCheck: {
      validator: (value) => value === inputs.password.value.trim(),
      messages: {
        empty: '*비밀번호 확인을 입력해주세요.',
        invalid: '*비밀번호가 일치하지 않습니다.',
      },
    },
    nickname: {
      validator: (value) => validationNickname(value),
      messages: {
        empty: '*닉네임을 입력해주세요.',
        invalid: '*닉네임은 공백 없이 최대 10자까지 가능합니다.',
      },
    },
  };

  function helperText(field, message = '') {
    if (helpers[field]) helpers[field].textContent = message;
  }

  function updateBtnState() {
    const isValid = Object.entries(validation).every(([field, valid]) =>
      valid.validator(inputs[field].value.trim())
    );
    signupBtn.classList.toggle('active', isValid);
    signupBtn.disabled = !isValid;
  }

  function handleInput(field) {
    const { validator, messages } = validation[field];
    const value = inputs[field].value.trim();
    let message = '';

    if (!value) {
      message = messages.empty;
    } else if (!validator(value)) {
      message = messages.invalid;
    }
    helperText(field, message);
    updateBtnState();
  }

  Object.keys(validation).forEach((field) => {
    inputs[field].addEventListener('input', () => handleInput(field));
  });

  signupForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    const email = inputs.email.value.trim();
    const password = inputs.password.value.trim();
    const nickname = inputs.nickname.value.trim();

    if (!validationEmail(email) || !validationPassword(password) || !validationNickname(nickname)) {
      alert('입력값을 확인해주세요.');
      return;
    }

    try{
      //TODO: profileImage 구현하기
      const profileImage = 'fake_img.jpg'; // 임시 이미지 경로
      console.log('회원가입 시도:', { email, password, nickname, profileImage});
      const result = await api.signup({email, password, nickname, profileImage});
      console.log('회원가입 성공', result);
      navigate('/login');
    } catch(error){
      console.error('회원가입 실패', error.message)
      alert('프로필 이미지와 이메일, 비밀번호, 닉네임을 확인해주세요');
    }
  });


  toLoginBtn.addEventListener('click', () => navigate('/login'));

  fragment.appendChild(signupContainer);
  return fragment;
}
