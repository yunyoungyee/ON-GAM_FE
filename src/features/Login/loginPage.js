import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { navigate } from '../../core/router.js';
import { validationEmail, validationPassword } from '../../shared/validation.js';
import { api } from '../../shared/api/api.js';

export function LoginPage() {
  const fragment = document.createDocumentFragment();
  const header = createHeader({ showProfile: false });
  fragment.appendChild(header);

  const loginContainer = document.createElement('main');
  loginContainer.className = 'page login-page';
  loginContainer.innerHTML = `
    <section class="panel login-panel tablet-only">
      <h1 class="page-title">로그인</h1>
      <form class="form-stack" id="login-form">
        <div class="form-field">
          <label>이메일</label>
          <input id="email" type="email" placeholder="이메일을 입력하세요" />
        </div>
        <div class="form-field">
          <label>비밀번호</label>
          <input id="password" type="password" placeholder="비밀번호를 입력하세요" />
          <small class="helper-text" id="login-helper"></small>
        </div>
        <div class="actions">
          <div id="login-btn-container"></div>
          <button type="button" class="link-to-signup">회원가입</button>
        </div>
      </form>
    </section>
  `;

  const emailForm = loginContainer.querySelector('#email');
  const passwordForm = loginContainer.querySelector('#password');
  const loginHelper = loginContainer.querySelector('#login-helper');
  const loginForm = loginContainer.querySelector('#login-form');
  const signupBtn = loginContainer.querySelector('.link-to-signup');
  const loginBtnContainer = loginContainer.querySelector('#login-btn-container');
  
  const loginBtn = createButton({
    label: '로그인',
    type: 'submit',
    variant: 'primary',
    fullWidth: true,
  });
  loginBtn.disabled = true;
  loginBtnContainer.appendChild(loginBtn);

  function helperText(message) {
    loginHelper.textContent = message;
  }

  function updateBtnState() {
    const isValidEmail = validationEmail(emailForm.value.trim());
    const isValidPassword = validationPassword(passwordForm.value.trim());
    const isValid = isValidEmail && isValidPassword;
    loginBtn.classList.toggle('active', isValid);
    loginBtn.disabled = !isValid;
  }

  emailForm.addEventListener('input', () => {
    const email = emailForm.value.trim();
    if (email.length === 0 || !validationEmail(email)) {
      helperText('*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
    } else {
      helperText('');
    }
    updateBtnState();
  });

  //TODO: 이메일 확인하는 POST 작성 후. api.js추가
  emailForm.addEventListener('blur', () => {
    const email = emailForm.value.trim();
    if (validationEmail(email)) {
      console.log("API 호출 이메일 중복 확인");
    }
  })

  passwordForm.addEventListener('input', () => {
    const password = passwordForm.value.trim();
    if (password.length === 0) {
      helperText('*비밀번호를 입력해주세요.');
    } else if (!validationPassword(password)) {
      helperText('*비밀번호는 8~20자, 대/소문자·숫자·특수문자를 모두 포함해야 합니다.');
    } else {
      helperText('');
    }
    updateBtnState();
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailForm.value.trim();
    const password = passwordForm.value.trim();

    if (!validationEmail(email)) {
      helperText('*올바른 이메일 주소 형식을 입력해주세요.');
      return;
    }
    if (!validationPassword(password)) {
      helperText('*비밀번호 형식을 확인해주세요.');
      return;
    }
    try {
      console.log('로그인 시도:', { email, password });
      const result = await api.login({ email, password });
      console.log("로그인 성공", result);
      const user = result.data;
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/posts');
    } catch (error) {
      console.error("로그인 실패", error.message)
      alert('이메일 또는 비밀번호를 확인해주세요');
    }
  });

  signupBtn.addEventListener('click', () => navigate('/signup'));

  fragment.appendChild(loginContainer);
  return fragment;
}