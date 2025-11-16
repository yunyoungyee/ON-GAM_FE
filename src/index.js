import { render } from './core/dom.js';
import { startRouter, registerRoute, registerNotFound } from './core/router.js';
import { LoginPage } from './features/Login/loginPage.js';
import { SignupPage } from './features/Signup/signupPage.js';
import { PostListPage } from './features/Post/postListPage.js';
import { PostCreatePage } from './features/PostCreate/postCreatePage.js';
import { PostDetailPage } from './features/PostDetail/postDetailPage.js';
import { PostEditPage } from './features/PostEdit/postEditPage.js';
import { ProfileEditPage } from './features/ProfileEdit/profileEditPage.js';
import { PasswordEditPage } from './features/PasswordEdit/passwordEditPage.js';

registerRoute('/login', LoginPage);
registerRoute('/signup', SignupPage);
registerRoute('/posts', PostListPage);
registerRoute('/posts/create', PostCreatePage);
registerRoute('/posts/:id', PostDetailPage);
registerRoute('/posts/edit/:id', PostEditPage);
registerRoute('/profile/edit', ProfileEditPage);
registerRoute('/password/edit', PasswordEditPage);

// 커스텀 404 확장 가능
registerNotFound(() => {
  const div = document.createElement('div');
  div.textContent = '페이지를 찾을 수 없습니다.';
  div.style.padding = '40px';
  return div;
});

startRouter((Component) => {
  render(Component);
});
