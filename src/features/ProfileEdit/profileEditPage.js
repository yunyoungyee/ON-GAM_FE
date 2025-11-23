import { createHeader } from '../../shared/components/header.js';
import { createButton } from '../../shared/components/button.js';
import { createModal } from '../../shared/components/modal.js';
import { getCurrentUser } from '../../shared/util.js';
import { api, getImageUrl } from '../../shared/api/api.js';
import { navigate } from '../../core/router.js';

export function ProfileEditPage() {
  const user = getCurrentUser();
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createHeader());

  const main = document.createElement('main');
  main.className = 'page profile-edit-page';

  const panel = document.createElement('section');
  panel.className = 'panel profile-panel tablet-only';

  const title = document.createElement('h1');
  title.className = 'page-title';
  title.textContent = '회원정보수정';

  const container = document.createElement('div');
  container.className = 'profile-edit';

  const profileText = document.createElement('span');
  profileText.className = 'profile-edit__text';
  profileText.textContent = '프로필 사진*';

  const profileImage = document.createElement('div');
  profileImage.className = 'profile-edit__avatar';

  const initialImageUrl = getImageUrl(user.profileImageUrl);
  let selectedFile = null;
  const profilePreview = document.createElement('img');
  profilePreview.className = 'profile-edit__preview';
  profilePreview.src = initialImageUrl;
  profileImage.append(profilePreview);

  const changeBadge = document.createElement('span');
  changeBadge.className = 'profile-edit__badge';
  changeBadge.textContent = '변경';
  profileImage.append(changeBadge);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.hidden = true;

  changeBadge.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      selectedFile = file;

      const preview = new FileReader();
      preview.onload = (e) => {
        profilePreview.src = e.target.result;
        profilePreview.classList.add('active');
      };
      preview.readAsDataURL(file);
    }
  });


  //email
  const emailBlock = document.createElement('div');
  emailBlock.className = 'profile-email-block';
  const emailLabel = document.createElement('label');
  emailLabel.textContent = '이메일';
  const emailText = document.createElement('div');
  emailText.className = 'profile-email';
  emailText.textContent = user.email;
  emailBlock.append(emailLabel, emailText);

  //nickname
  const nicknameField = document.createElement('div');
  nicknameField.className = 'input-field';
  const nicknameLabel = document.createElement('label');
  nicknameLabel.textContent = '닉네임';
  const nicknameInput = document.createElement('input');
  nicknameInput.value = user.nickname;
  const nicknameHelper = document.createElement('span');
  nicknameHelper.className = 'helper-text';
  nicknameHelper.textContent = ""
  nicknameField.append(nicknameLabel, nicknameInput, nicknameHelper);

  //actions
  const actions = document.createElement('div');
  actions.className = 'actions';
  const updateButton = createButton({
    label: '수정하기',
    fullWidth: true,
  });
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'link-to-cancel';
  cancelBtn.textContent = '회원 탈퇴';
  actions.append(updateButton, cancelBtn);

  //toast
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = '수정 완료';

  function onToast() {
    toast.classList.add('active');
    setTimeout(function () {
      toast.classList.remove('active');
    }, 1000);
  }

  function helperText(message) {
    nicknameHelper.textContent = message;
  }

  updateButton.addEventListener('click', async () => {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
      helperText('*닉네임을 입력해주세요.');
      return;
    } else if (nickname.length > 10) {
      helperText('*닉네임은 최대 10자 까지 작성 가능합니다.');
      return;
    }
    try {
      const result = await api.updateProfile(user.id, {nickname,profileImage: selectedFile});
      onToast();
      helperText('');
    } catch (error) {
      if (error.status === 409) {
        helperText('*중복된 닉네임 입니다.');
      } else {
        console.error('닉네임 수정 실패:', error);
        alert('닉네임 수정에 실패했습니다.');
      }
    }
  })

  cancelBtn.addEventListener('click', async () => {
    createModal({
      title: '회원탈퇴 하시겠습니까?',
      description: '작성된 게시글과 댓글은 삭제됩니다.',
      onConfirm: async () => {
        try {
          await api.deleteUser(user.id);
          navigate('/login');
        } catch (error) {
          console.log('회원탈퇴 실패', error);
          alert('회원탈퇴에 실패했습니다.');
        }
      },
    });
  });

  container.append(emailBlock, nicknameField, actions, toast);

  panel.append(title, profileText, profileImage, fileInput, container);
  main.appendChild(panel);
  fragment.appendChild(main);
  return fragment;
}
