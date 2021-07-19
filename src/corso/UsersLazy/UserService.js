import axios from 'axios';

export class UserService {

    // getUsersSmall() {
    //     return axios.get('assets/demo/data/users-small.json').then(res => res.data.data);
    // }

    getUsers (page, limit)  {
      const url = `http://localhost:3000/users?_page=${page+1}&_limit=${limit}`
      console.debug({url})
      return axios.get(url).then(res => ({
        data: res.data,
        totalRecords: res.headers['x-total-count']
      }))
    }

    // getUsersWithOrdersSmall() {
    //     return axios.get('assets/demo/data/users-orders-small.json').then(res => res.data.data);
    // }
}