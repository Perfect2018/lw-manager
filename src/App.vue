<template>
  <div id="app">
    <!--    <router-view v-if="alive"/>-->
    <router-view/>

  </div>
</template>

<script>

    export default {
        name: 'App',
        provide() {
            return {
                reload: this.reload
            }
        },
        data() {
            return {
                alive: true
            }
        },
        methods: {
            reload() {
                this.alive = false
                this.$nextTick(() => {
                    this.alive = true
                })
            }
        }
    }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, 'sans-serif';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    height: 100%;
    min-width: 1200px;
  }

  html, body {
    min-height: 700px;
    min-width: 1200px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .avatar-o {
    width: 178px;
    height: 178px;
    display: block;
    position: absolute;
    top: 0;
  }

  .el-header {
    padding: 0 !important;
  }

  .el-main, .el-footer {
    padding: 0;
  }

  .el-menu {
    border: none !important;
  }

  .el-dialog {
    min-width: 600px;
    max-width: 899px;

    .dialog-input {
      margin: 20px auto;
    }

  }
</style>
