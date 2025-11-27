const routes = [];

export function registerRoute(path, handler) {
  const regex = new RegExp(`^${path.replace(':id', '([^/]+)')}$`);
  routes.push({ regex, handler });
}

let notFoundHandler = () => {
  const div = document.createElement('div');
  div.textContent = '페이지를 찾을 수 없습니다.';
  return div;
};

export function registerNotFound(handler) {
  notFoundHandler = handler || notFoundHandler;
}

export function startRouter(render) {
  function handleRoute() {
    const { hash } = window.location;
    const path = hash.replace('#', '') || '/login';
    for (const { regex, handler } of routes) {
      const match = path.match(regex);

      if (!match) continue;

      const param = match[1];
      console.log('라우트 매칭됨:', handler.name);
      window.scrollTo(0, 0);
      const result = handler(param);

      if (result instanceof Promise) {
        result.then((resolved) => render(() => resolved));
      } else {
        render(() => result);
      }
      return;
    }
    render(notFoundHandler);
  }
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

export function navigate(path) {
  window.location.hash = path;
}

export function logout() {
  localStorage.removeItem('user');
  navigate('/login');
}