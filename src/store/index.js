import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        userPermission:[],
        authorization:'',
        proxyId:'',
    },
    mutations:{
        getPermission(state,result){
            state.userPermission=result

        },
        authorization(state,res){
            state.authorization= res
            let token = sessionStorage.getItem("authorization")
            axios.defaults.headers.common['token'] = token;
        },
        // logout(state) {
        //     state.authorization = undefined
        //     sessionStorage.removeItem('authorization')
        // },
        getProxyId(state,proxyId){
            state.proxyId=proxyId

        }

    }
})
