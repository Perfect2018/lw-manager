<template>
  <el-container>
    <el-aside :style="{width:'200px',height:clientHeight+'px',position: 'fixed',zIndex:10}">
      <Aside></Aside>
    </el-aside>
    <router-view :style="{marginLeft:'200px'}" :clientHeight="clientHeight"/>
  </el-container>
</template>

<script>
    import Aside from "../components/aside";

    export default {
        name: "manage",
        components: {Aside},
        data() {
            return {
                clientHeight: document.documentElement.clientHeight >= 700 ? document.documentElement.clientHeight : 700
            }
        },
        mounted() {
            let that = this;
            window.onresize = function () {
                let temp = `${document.documentElement.clientHeight}`;
                that.clientHeight = temp >= 700 ? temp : 700;
            }
        }
    }
</script>

<style scoped lang="scss">

  .el-aside {
    position: relative;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    user-select: none;
    overflow-x: hidden;
  }


</style>
