import { navigate, logout } from '../../core/router.js';

export function createHeader(options = {}) {
  const { 
    title = '아무 말 대잔치', 
    showBack = false, 
    showProfile = true, 
    menuItems = [
      {label: '회원정보수정', path: '/profile/edit'},
      {label: '비밀번호수정', path: '/password/edit'},
      {label: '로그아웃', onClick: logout},
    ]} = options;
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

  const center = document.createElement('div');
  center.className = 'app-header__center';
  center.textContent = title;

  const right = document.createElement('div');
  right.className = 'app-header__right';
  const avatarButton = document.createElement('button');
  avatarButton.type = 'button';
  avatarButton.className = 'avatar-button';
  avatarButton.innerHTML = '<span>🙂</span>';
  if(!showProfile){
    avatarButton.style.display ='none';
  }
  right.appendChild(avatarButton);

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

  avatarButton.addEventListener('click', () => {
    dropdown.classList.toggle('header-dropdown--open');
  });

  right.appendChild(dropdown);
  header.append(left, center, right);
  return header;
}
