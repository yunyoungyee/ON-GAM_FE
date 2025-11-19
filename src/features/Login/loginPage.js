import { createButton } from '../../shared/components/button.js';
import { navigate } from '../../core/router.js';
import { validationEmail, validationPassword } from '../../shared/validation.js';
import { api } from '../../shared/api/api.js';
import { createField } from '../../shared/components/formField.js';
import { createEmotionCharacter, scatterPosition, moveEyes } from "./characters.js";

export function LoginPage() {
  const fragment = document.createDocumentFragment();

  const loginContainer = document.createElement('main');
  loginContainer.className = 'page login-page';

  const title = document.createElement('h2');
  title.className = 'title';
  const mini1 = document.createElement('span');
  mini1.textContent ='emoti';
  const mini2 = document.createElement('span');
  mini2.textContent = 'ON';
  const mini3 = document.createElement('span');
  mini3.className = 'ghost';
  mini3.textContent =': 溫';
  title.append(mini1,mini2,mini3);

  const text = document.createElement('div');
  text.classList ='text';
  text.textContent = '당신의 감정에 따뜻함을 더하다';

  const card = document.createElement('div');
  card.className = 'login-card';
  const loginForm = document.createElement('form');
  const field = document.createElement('div');
  field.className = 'login-area';
  const {
    field: emailField,
    input: emailInput,
  } = createField('이메일', 'email', '이메일을 입력하세요');
  const {
    field: pwField,
    input: pwInput,
    helper: loginHelper,
  } = createField('비밀번호', 'password', '비밀번호를 입력하세요');
  field.append(emailField, pwField);
  const loginBtn = createButton({
    label: '로그인',
    type: 'submit',
    fullWidth: true,
  });
  loginBtn.disabled = true;
  loginForm.append(field, loginBtn);

  const actions = document.createElement('div');
  actions.className = 'actions'
  const signupBtn = document.createElement('button');
  signupBtn.className = 'link-to-signup';
  signupBtn.textContent = '회원가입';
  actions.append(signupBtn);
  card.append(title, text, loginForm, actions);

  function updateBtnState() {
    const isValidEmail = validationEmail(emailInput.value.trim());
    const isValidPassword = validationPassword(pwInput.value.trim());
    const isValid = isValidEmail && isValidPassword;
    loginBtn.classList.toggle('active', isValid);
    mini2.classList.toggle('highlight',isValid );
    signupBtn.classList.toggle('highlight',isValid );
    loginContainer.classList.toggle('highlight', isValid);
    card.classList.toggle('highlight',isValid);
    loginBtn.disabled = !isValid;
  }

  function helperText(message) {
    loginHelper.textContent = message;
  }

  emailInput.addEventListener('input', () => {
    const email = emailInput.value.trim();
    if (email.length === 0 || !validationEmail(email)) {
      helperText('*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
    } else {
      helperText('');
    }
    updateBtnState();
  });

  //TODO: 이메일 확인하는 POST 작성 후. api.js추가
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (validationEmail(email)) {
      console.log("API 호출 이메일 중복 확인");
    }
  })

  pwInput.addEventListener('input', () => {
    const password = pwInput.value.trim();
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
    const email = emailInput.value.trim();
    const password = pwInput.value.trim();

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


  const characterArea = document.createElement('div');
  characterArea.className = 'character-area'; // JS에서 이 클래스를 통해 캐릭터를 찾지 않으므로 이름은 자유롭게 정의

  const emotionList = ["happy", "sad", "angry", "anxious", "tired"];

  emotionList.forEach(type => {
    const character = createEmotionCharacter(type);
    // data-emotion은 JS에서 사용하지 않아도 되지만, 스타일링/디버깅에 유용합니다.
    character.dataset.emotion = type;
    characterArea.appendChild(character);
    scatterPosition(characterArea, character);
  });

  // 4. 페이지 최종 조립
  loginContainer.append(card, characterArea);


  // 5. 인터랙션: 눈알이 마우스를 따라오기 (페이지 로드 후, 이벤트 리스너는 한 번만 추가)
  // 페이지가 DOM에 추가된 후에 실행되어야 하지만, 여기서는 최상위 container를 반환하므로,
  // 이 시점에서 document에 이벤트 리스너를 추가하는 것은 괜찮습니다.
  document.addEventListener('mousemove', moveEyes);
  fragment.appendChild(loginContainer);
  return fragment;
}