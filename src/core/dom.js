export function render(component) {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error('#app element is missing.');
  }

  root.innerHTML = '';
  const tree = typeof component === 'function' ? component() : component;
  if (tree instanceof Node) {
    root.appendChild(tree);
  }
}

export function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}
