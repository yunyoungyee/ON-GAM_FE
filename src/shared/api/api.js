//아직은 헤더에 인증조건이 없지만 인증조건이 들어가면 headers를 강제시키는것을 수정해야 할 것 같음.

const URL = "http://localhost:8080";

async function request(endpoint,{method = "GET", body, headers={}}={}) {
  try{
    const options = {method, headers: {'Content-Type': 'application/json'}};
    if(body && method !=='GET'){
      options.body = JSON.stringify(body);
    }
    const response = await fetch(`${URL}${endpoint}`,options);

    if(!response.ok){
      const errorData = await response.json().catch(()=>({}));
      const error = new Error(errorData.message || `API 요청 실패 (${response.status})`);
      error.status = response.status;
      error.code = errorData.code;
      throw error;
    } 
    const data = await response.json().catch(()=>({}));
    return data;

  }catch(error){
    console.error(`API ERROR ${method} ${endpoint}:`,{
      message: error.message,
      status: error.status,
      code: error.code,
    });
    throw error;

  }
}

export const api = {
  login: (data) => request('/users/auth', { method: 'POST', body: data }),
  signup: (data) => request('/users', { method: 'POST', body: data }),
  logout: (userId) => request(`/users/auth/token?userId=${userId}`,{ method: 'POST'}), 
  updateNickname: (id, data) => request(`/users/${id}/nickname`,{ method: 'PATCH', body: data }),
  updatePassword: (id, data) => request(`/users/${id}/password`,{ method: 'PATCH', body: data}),
  deleteUser: (id) => request(`/users/${id}`,{ method: 'DELETE'}),
  getPosts: () => request('/posts'), 
  getPost: (id) => request(`/posts/${id}`),
  createPost: (data) => request('/posts', { method: 'POST', body: data }),
  updatePost: (id, data) => request(`/posts/${id}`, { method: 'PATCH', body: data }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  getCommentByPost: (postId) => request(`/comments/post?postId=${postId}`),
  createComment: (data) => request(`/comments`,{ method: 'POST', body: data }),
  updateComment: (id, data) => request(`/comments/${id}`,{ method: 'PATCH', body: data }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' })
};



