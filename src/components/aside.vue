<template>
    <div class="aside_container">
        <div class="title">
            第一劳务
        </div>
        <el-menu default-active="/"
                 router
                 unique-opened
                 active-text-color='#29A88D'
                 background-color="#253149"
                 text-color="#fff"
                 @open="handleOpen"
                 @close="handleClose">
            <div v-for="item in routers" :key="item.functionName">
                <el-submenu :index="item.url" v-if="item.checked">
                    <template slot="title">
                        <span>{{item.functionName}}</span>
                    </template>
                    <el-menu-item :index="val.url" v-for="val in item.children" :key="val.functionName"
                                  @click="handleClick(val.url)">
                        <template slot="title">
                            <span class="el-menu-item-title">{{val.functionName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item :index="item.url" v-else>
                    <template slot="title">
                        <span>{{item.functionName}}</span>
                    </template>
                </el-menu-item>
            </div>
        </el-menu>
    </div>

</template>
<script>
    import * as testApi from '../api/index'

    export default {
        name: 'Aside',
        data() {
            return {
                routers: []
            }

        },
        methods: {
            handleOpen(key, keyPath) {
                //console.log(key, keyPath);

            },
            handleClose: function (key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClick(url) {
                //console.log(url);

            },

        },
        beforeMount() {
            let array = JSON.parse(sessionStorage.getItem("userPermission"))
            this.routers = array;

        }

    }
</script>
<style scoped>
    .aside_container {
        /*position: fixed;*/
        width: 200px;
        height: 100%;
        background: #253149;
        overflow-x: hidden;
    }

    .title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        background-color: #253149;
        color: #6592D7;
        padding-left: 13px;
        font-size: 20px;
        font-weight: bold;
        box-sizing: border-box;
    }


    .el-submenu__title > span {
        font-size: 17px;
        padding-left: 30px;
    }

    .el-menu-item-title {
        font-size: 17px;
        padding-left: 30px;
    }

</style>
