const routes = [];

export function registerRoute(path, handler) {
  const regex = new RegExp(`^${path.replace(':id', '([^/]+)')}$`);
  routes.push({regex, handler});
}

//기본 폴백 함수 겸 안전장치
let notFoundHandler = () => {
  const div = document.createElement('div');
  div.textContent = '페이지를 찾을 수 없습니다.';
  return div;
};

//404 커스텀 페이지
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
      window.scrollTo(0, 0); //화면 전환시 무조건 상단으로 이동
      const result = handler(param);

      if(result instanceof Promise){
        result.then((resolved)=>render(()=>resolved));
      } else{
        render(()=>result);
      }
        return;
      }
    render(notFoundHandler); // 일치하는 정규식 없으면 폴백
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