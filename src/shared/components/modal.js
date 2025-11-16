import { createButton } from './button.js';

export function createModal(options) {
  const { title = '확인', description = '', confirmText = '확인', cancelText = '취소', onConfirm, onCancel } = options;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal-card';

  const heading = document.createElement('h3');
  heading.textContent = title;

  const body = document.createElement('p');
  body.textContent = description;

  const actions = document.createElement('div');
  actions.className = 'modal-actions';

  const cancelButton = createButton({
    label: cancelText,
    variant: 'ghost',
    onClick: () => {
      overlay.remove();
      if (onCancel) onCancel();
    },
    fullWidth: false,
  });

  const confirmButton = createButton({
    label: confirmText,
    onClick: () => {
      overlay.remove();
      if (onConfirm) onConfirm();
    },
    fullWidth: false,
  });

  actions.append(cancelButton, confirmButton);
  modal.append(heading, body, actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  return overlay;
}
