import axios from 'axios';

export class UserService {

    // getUsersSmall() {
    //     return axios.get('assets/demo/data/users-small.json').then(res => res.data.data);
    // }

    getUsers() {
      return axios.get('http://localhost:3000/users').then(res => res.data);
    }

    // getUsersWithOrdersSmall() {
    //     return axios.get('assets/demo/data/users-orders-small.json').then(res => res.data.data);
    // }
}