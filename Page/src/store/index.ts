/*
 * ⭐ @Author: Shawkry
 * ⭐ @Date: 2022-02-08 00:06:07
 * ⭐ @LastEditTime: 2022-02-08 16:38:40
 * ⭐ @Description: vuex
 */
import { createStore } from 'vuex';

export default createStore({
    state: {
        user: localStorage.getItem("user_token") || null
    },
    mutations: {
        setUser: (state: any, value: any) => {
            state.user = value;
            localStorage.setItem('user_token', value);
        },
    },
    actions: {
        setUser(state) {
            state.commit('setUser');
        },
    },
    getters: {
        getUser(state) {
            return state.user;
        },
    }
});