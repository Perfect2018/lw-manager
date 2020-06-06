<template>
    <div class="header_container">
             <el-button type='text' @click="goIndex" class="goIndex" style="margin-left:20px">首页</el-button>
             <el-button type='text' class="goIndex">
                <slot></slot>
             </el-button>
             <el-button type='text' style="color:#fff" @click="logout">退出登录</el-button>
    </div>
</template>
<script>
export default {
    data (){
        return {

        }
    },
    methods:{
        logout(){
            // this.$store.dispatch('logout')
            sessionStorage.removeItem('authorization');
            // var token= sessionStorage.getItem('authorization');
            // //console.log('token'+token)
            this.$router.push({
                path:'/'
            })
        },
        goIndex(){
            this.$router.push({
                path:'/index'
            })
        }
    }
    
}
</script>
<style scoped>
.header_container{
    width: 100%;
    height: 100%;
    background: #6791D9;
    color: #ffffff;
}
.el-button{
    float: right;
    margin-right: 20px;
    margin-top: 10px

}
.title{
  float: left;
  margin-left: 20px;
  margin-top: 0px;
}  
.goIndex{
    float:left;
    color:#ffffff;
    margin-right: 3px;
    margin-left: 0;
    font-size: 16px;
}

</style>


