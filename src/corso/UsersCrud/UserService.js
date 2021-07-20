import axios from 'axios';

export class UserService {

  getUsers(page, limit)  {
    const url = `http://localhost:3000/users?_page=${page+1}&_limit=${limit}`
    return axios.get(url).then(res => ({
      data: res.data,
      totalRecords: res.headers['x-total-count']
    }))
  }

  createUser(data) {
    const url = 'http://localhost:3000/users'
    return axios.post(url, data).then(res => ({
      data: res.data
    }))
  }
}
