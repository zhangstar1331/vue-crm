import {
	SET_ORGDATA,
	SET_DATA
} from './mutation-type'
export default {
	getData({commit},orgBtnData){
		commit(SET_ORGDATA,{orgBtnData})
	},
	setData({commit},params){
		commit(SET_DATA,{params})
	}
}




