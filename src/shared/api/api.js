const URL = "http://localhost:8080";

async function request(endpoint, { method = "GET", body, headers = {} } = {}) {
  try {
    const isFormData = body instanceof FormData;
    const options = {
      method,
      headers: isFormData ? { ...headers } : { 'Content-Type': 'application/json', ...headers }
    };
    if (body && method !== 'GET') {
      options.body = isFormData ? body : JSON.stringify(body);
    }
    const response = await fetch(`${URL}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `API 요청 실패 (${response.status})`);
      error.status = response.status;
      error.code = errorData.code;
      throw error;
    }
    const data = await response.json().catch(() => ({}));
    return data;

  } catch (error) {
    console.error(`API ERROR ${method} ${endpoint}:`, {
      message: error.message,
      status: error.status,
      code: error.code,
    });
    throw error;

  }
}

function createFormData(data, fileFields = []) {
  const formData = new FormData();
  const jsonData = {};
  Object.entries(data).forEach(([key, value]) => {
    if (fileFields.includes(key)) {
      if (value) {
        formData.append(key, value);
      }
    } else {
      jsonData[key] = value;
    }
  });

  if (Object.keys(jsonData).length > 0) {
    formData.append('data', new Blob([JSON.stringify(jsonData)], {
      type: 'application/json'
    }));
  }
  return formData;
}
export function getImageUrl(imgPath) {
  if (!imgPath) return null;
  if (imgPath.startsWith('http')) return imgPath;
  return `${URL}${imgPath}`;
}

export const api = {
  login: (data) => request('/users/auth', { method: 'POST', body: data }),
  signup: (data) => {
    const formData = createFormData(data, ['profileImage']);
    return request('/users', { method: 'POST', body: formData });
  },
  logout: (userId) => request(`/users/auth/token?userId=${userId}`, { method: 'POST' }),
  updateProfile: (id, data) => {
    const formData = createFormData(data, ['profileImage']);
    return request(`/users/${id}/nickname`, { method: 'PATCH', body: formData });
  },
  updatePassword: (id, data) => request(`/users/${id}/password`, { method: 'PATCH', body: data }),
  deleteUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getPosts: () => request('/posts'),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (data) => {
    const formData = createFormData(data, ['postImage']);
    return request('/posts', { method: 'POST', body: formData });
  },
  updatePost: (id, data) => {
    const formData = createFormData(data, ['postImage']);
    return request(`/posts/${id}`, { method: 'PATCH', body: formData });
  },
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  getCommentByPost: (postId) => request(`/comments/post?postId=${postId}`),
  createComment: (data) => request(`/comments`, { method: 'POST', body: data }),
  updateComment: (id, data) => request(`/comments/${id}`, { method: 'PATCH', body: data }),
  deleteComment: (id) => request(`/comments/${id}`, { method: 'DELETE' })
};



