import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { navigate } from '../../core/router.js';
import { validationEmail, validationPassword, validationNickname } from '../../shared/validation.js';
import { api } from '../../shared/api/api.js';

export function SignupPage() {
  const fragment = document.createDocumentFragment();

  const signupContainer = document.createElement('main');
  signupContainer.className = 'page signup-page';

  signupContainer.innerHTML = `
    <section class="panel signup-panel tablet-only">
      <h1 class="page-title">회원가입</h1>

      <div class="profile-upload-wrapper">
        <input type="file" id="profileImage" accept="image/*" style="display: none;" />
        <div class="profile-placeholder" id="profilePlaceholder">
          <span class="plus-icon">+</span>
        </div>
        <img id="profilePreview" class="profile-preview"/>
      </div>
      <span class="helper-text" id="profileHelper"></span>

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

  const profileImageInput = $('profileImage');
  const profilePlaceholder = $('profilePlaceholder');
  const profilePreview = $('profilePreview');
  let selectedFile = null;

  const inputs = {
    email: $('email'),
    password: $('password'),
    pwCheck: $('pwCheck'),
    nickname: $('nickname'),
    profile: $('file'),
  };

  const helpers = {
    email: $('emailHelper'),
    password: $('passwordHelper'),
    pwCheck: $('pwCheckHelper'),
    nickname: $('nicknameHelper'),
    profile: $('profileHelper'),
  };

  profilePlaceholder.addEventListener('click', () => {
    profileImageInput.click();
  });
  profilePreview.addEventListener('click', () => {
    profileImageInput.click();
  });

  profileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        profileHelper.textContent = '*이미지 파일만 업로드 가능합니다.';
        e.target.value = '';
        selectedFile = null;
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        profileHelper.textContent = '*이미지 크기는 10MB를 초과할 수 없습니다.';
        e.target.value = '';
        selectedFile = null;
        return;
      }
      selectedFile = file;

      const preview = new FileReader();
      preview.onload = (e) => {
        profilePreview.src = e.target.result;
        profilePreview.classList.add('active');
        profilePlaceholder.classList.add('active');
      };
      preview.readAsDataURL(file);
      updateBtnState();
    }
  });

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
      valid.validator(inputs[field].value.trim())) && selectedFile !== null;

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

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = inputs.email.value.trim();
    const password = inputs.password.value.trim();
    const nickname = inputs.nickname.value.trim();

    if (!validationEmail(email) || !validationPassword(password) || !validationNickname(nickname)) {
      alert('입력값을 확인해주세요.');
      return;
    }
    if (!selectedFile){
      alert('프로필 이미지를 확인해주세요.');
    }

    try {
      console.log('회원가입 시도:', { email, password, nickname, profileImage: selectedFile.name });
      const result = await api.signup({ email, password, nickname, profileImage: selectedFile });
      console.log('회원가입 성공', result);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패', error.message)
      alert('프로필 이미지와 이메일, 비밀번호, 닉네임을 확인해주세요');
    }
  });


  toLoginBtn.addEventListener('click', () => navigate('/login'));

  fragment.appendChild(signupContainer);
  return fragment;
}
