import Vue from 'vue'
import { sessionStorage } from 'src/assets/js/storage';
// import { localStorage } from 'src/assets/js/storage';
import {
  SET_ORGDATA,
  SET_USER,
  SET_TOKEN,
  SET_POWER_DATA,
  SET_DATA
} from './mutation-type'
const key = 'token'
const mutations = {
  SET_USER(state, user) {
    state.user = user;
    sessionStorage.setItem('user', user);
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  SET_POWER_DATA(state){
  	state.powerData = state
  },
  [SET_ORGDATA](state,{orgBtnData}){
    state.orgBtnData = orgBtnData   
  },
  [SET_DATA](state,{params}){
    Object.keys(params).forEach(key => {
      // 需要替换的值
      const val = params[key]
      const arr = key.split(".");
      if (arr.length > 1) {
        let obj = state;
        while ((arr.length - 1) && (obj = obj[arr.shift()]));
        	obj[arr[0]] = val
      } else {
        	state[key] = val
      }
    }) 
  }
};

export default mutations;

