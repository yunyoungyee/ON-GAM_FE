export function createButton(options = {}) {
  const { label = '버튼', onClick, type = 'button', variant = 'primary', fullWidth = true } = options;
  const button = document.createElement('button');
  button.type = type;
  button.className = ['ui-button', `ui-button--${variant}`, fullWidth ? 'ui-button--full' : '']
    .filter(Boolean)
    .join(' ');
  button.textContent = label;
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}
