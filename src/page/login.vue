<template>
  <div>
    <header class="header">
      <!-- <img src="../assets/sgdj_logo.png" class="logo" /> -->
      <span class="serviceTel">
        客服电话：
        <span>029-81115971</span>
      </span>
    </header>
    <div class="container">
      <div class="bg_img">
        <img src="../assets/signbg.png" alt />
      </div>
      <div class="login">
        <h2 class="title">登录</h2>
        <el-form ref="form" :model="loginForm" label-suffix=":" :rules="rules">
          <el-form-item label prop="username">
            <el-input class="user" v-model="loginForm.username" placeholder="请输入用户名" autofocus></el-input>
          </el-form-item>
          <el-form-item label prop="password">
            <el-input
              class="password"
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              autofocus
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="identify_pic_val">
                  <el-input
                    class="password"
                    v-model="loginForm.identify_pic_val"
                    placeholder="验证码"
                    autofocus
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <img :src="imgUrl" alt @click="changeIdentify" />
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label class="button">
            <el-button @click="login" type="primary">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <footer class="footer">
      <p class="title">Copyright &copy; 2020 第一劳务科技有限公司</p>
    </footer>
  </div>
</template>
<script>
import { JSEncrypt } from "jsencrypt";
import loginApi from "../api/user/login";
import api from "../config/api";
import config from "../config/config";

export default {
  components: {},
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        custToken: "",
        identify_pic_val: ""
      },
      imgUrl: "",
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        identify_pic_val: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    changeIdentify() {
      let str = (parseInt(Math.random() * 100000, 10) + 1).toString();
      this.loginForm.custToken = str;
      this.imgUrl = config.baseUrl + "/pictureValidate?custToken=" + str;
    },
    login() {
      let publicKey =
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfzggZEJXQ4ESFzcpMAQWL5IxpGVK1tGMQMfyNpcsp/D2mDPM9dxblKDDV/f+H0pmt8PoG8oNaoZdZwD+fCnUJnycCLKF3XZPZrgLcMEY2VrCjABr2/HyjazcDWu8IX1CkRtxe4RhgORWUDgMdMG7UgqXnqB71vg2ar4bVmux8eQIDAQAB"; // 从后台获取公钥
      let encryptor = new JSEncrypt(); // 新建JSEncrypt对象
      encryptor.setPublicKey(publicKey); // 设置公钥
      let rsaPassWord = encryptor.encrypt(this.loginForm.password); // 对密码进行加密
      loginApi.login(
          this.loginForm.custToken,
          this.loginForm.username,
          this.loginForm.identify_pic_val,
          rsaPassWord
        )
        .then(result => {
          this.$message({
            type: result.success ? "success" : "warning",
            message: result.error.msg
          });
          if (result.success && result.data) {
            let paramsArray = result.data.children;
            let token = result.temporaryData.token;
            let proxyId = result.temporaryData.proxyId;
            api._setSessionStorage(
              "userPermission",
              JSON.stringify(paramsArray)
            );
            api._setSessionStorage("authorization", token);
            api._setSessionStorage("proxyId", proxyId);
            api._setSessionStorage("token", token);
            api._setHeader({ token: token });
            this.$router.push({
              path: "/index",
              query: paramsArray
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "登录失败"
          });
        });
    }
  },
  beforeMount() {
    let number = parseInt(Math.random() * 100000, 10) + 1;
    let string = number.toString();
    this.loginForm.custToken = string;
    this.imgUrl = config.baseUrl + "/pictureValidate?custToken=" + string;
  }
};
</script>
<style scoped>
.header {
  padding: 0 15px;
  margin: 15px auto;
  height: 70px;
  max-width: 70rem;
  display: flex;
  justify-content: space-between;
}

.header .logo {
  width: 200px;
  height: 65px;
}

.header .serviceTel {
  line-height: 70px;
}

.login {
  padding: 40px;
  position: absolute;
  width: 300px;
  text-align: center;
  top: 25%;
  right: 13%;
  background-color: #fff;
}

.login .title {
  font-size: 24px;
  text-align: left;
  margin-bottom: 20px;
}

.login button {
  width: 100%;
}

.login .button {
  width: 100%;
  margin-top: 30px;
}

.login input {
  margin: 10px auto;
}

.user {
  margin-bottom: 10px;
}

.bg_img {
  max-height: 700px;
  overflow: hidden;
}

.bg_img img {
  min-width: 70rem;
}

.footer {
  height: 40px;
}

.footer .title {
  font-size: 14px;
  padding: 20px 0;
  color: #ccc;
  text-align: center;
}
</style>

