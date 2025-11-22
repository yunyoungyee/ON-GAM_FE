import { navigate, logout } from '../../core/router.js';
import { getCurrentUser } from '../util.js';
import { getImageUrl } from '../api/api.js';
export function createHeader(options = {}) {
  const {
    showBack = false,
    showProfile = true,
    menuItems = [
      { label: '회원정보수정', path: '/profile/edit' },
      { label: '비밀번호수정', path: '/password/edit' },
      { label: '로그아웃', onClick: logout },
    ] } = options;
  const header = document.createElement('header');
  header.className = 'app-header';

  const left = document.createElement('div');
  left.className = 'app-header__left';
  if (showBack) {
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'app-header__back';
    backButton.textContent = '‹';
    backButton.addEventListener('click', () => {
      window.history.back();
    });
    left.appendChild(backButton);
  }

  const logo = document.createElement('img');
  logo.src = "../../../src/shared/assets/images/logo.png";
  logo.alt = '온감 로고';
  logo.className = 'header-logo';


  const user = getCurrentUser();
  const right = document.createElement('div');
  right.className = 'app-header__right';
  const profileBtn = document.createElement('button');
  profileBtn.type = 'button';
  profileBtn.className = 'profile-button';
  console.log(user.profileImageUrl);
  if (user && user.profileImageUrl) {
    const profileImg = document.createElement('img');
    profileImg.src = getImageUrl(user.profileImageUrl);
    profileBtn.appendChild(profileImg);
  }
  if (!showProfile) {
    profileBtn.style.display = 'none';
  }
  right.appendChild(profileBtn);

  const dropdown = document.createElement('div');
  dropdown.className = 'header-dropdown';
  menuItems.forEach((item) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = item.label;
    button.addEventListener('click', () => {
      if (item.path) {
        navigate(item.path);
      }
      if (item.onClick) {
        item.onClick();
      }
      dropdown.classList.remove('header-dropdown--open');
    });
    dropdown.appendChild(button);
  });

  profileBtn.addEventListener('click', () => {
    dropdown.classList.toggle('header-dropdown--open');
  });

  right.appendChild(dropdown);
  header.append(left, logo, right);
  return header;
}
