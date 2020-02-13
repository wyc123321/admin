<template>
  <div class="login">
    <!--v-lazy:background-image="imgUrl"-->
    <div class="loginBack">
      <div class="loginContent">
        <div class="loginLeft">
          <img src="../../../static/img/logo.png" alt="">
          <p class="p1">您好，欢迎您使用一诺快记官网后台管理系统</p>
        </div>
        <div class="loginRight">
          <el-form ref="form" :model="form" label-width="57px" :rules="rules">
            <el-form-item label=" " prop="">
              <p class="logoTitle">后台管理登录</p>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" @keyup.enter.native="onSubmit('form')" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="form.password" @keyup.enter.native="onSubmit('form')"
                        style="width: 300px"></el-input>
              <img src="" alt="">
            </el-form-item>
            <el-form-item>
              <el-button id="loginBtn" type="primary" @click="onSubmit('form')" style="width:300px">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <footer class="footer">
      Copyright ©2016 一诺快记 京ICP备09016670号
    </footer>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      var checkUser = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
        // if (!(/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,19}$/.test(value))) {
        //   callback(new Error("请填写字母开头的5位及以上的数字字母组合"));
        // }
        else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
        }
        if (!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(value))) {
          callback(new Error("请填写8到16位的数字字母组合"));
        } else {
          callback();
        }
      }
      return {
        form: {
          username: "",
          password: ""
        },
        rules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          username: [
            {validator: checkUser, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      async onSubmit(formName) {
        let valid = await this.$refs[formName].validate();
        if (valid) {
          let loading = this.$loading({
            lock: true,
            text: '正在加载，请稍候',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          //登录注册相关接口不能带token，所以单独处理
          var instance = this.$axios.create({
            headers: {'Content-Type': 'application/json'}
          });
          await instance.post(process.env.API_YINUO + 'api/login', this.form)
            .then((response) => {
              loading.close();
              if (response.data.success) {
                window.localStorage.setItem('adminUser',JSON.stringify(response.data.data))
                this.$router.replace({path: '/navigate'});
              } else {
                this.$message.error(response.data.message);
              }
            })
            .catch((error) => {
              loading.close();
              console.log(error);
              this.$message.error("登录失败，服务器错误")
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      },
    }
  }
</script>

<style scoped>
  .login {
    height: 100%;
    position: relative;
  }

  .loginBack {
    width: 100%;
    background-repeat: no-repeat;
    /*background: rgb(114, 178, 239);*/
    background: url("../../../static/img/back.jpg");
    background-size: 100% 100%;
    height: calc(100% - 40px);
  }

  .footer {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .loginLeft {
    color: white;
    text-align: center;
  }

  .loginLeft img {
    height: 60px;
    margin-bottom: 25px;
  }

  .loginLeft .p1 {
    font-size: 30px;
    line-height: 40px;
  }

  .loginLeft .p2 {
    font-family: ﻿FelixTitlingMT;
    font-size: 16px;
    line-height: 36px;
    color: rgb(254, 254, 255);
  }

  .loginContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 120px;
    box-sizing: border-box;
  }

  .loginBack[lazy="loading"] {
    background-size: 600px 375px;
    background-position: center;
  }

  .loginRight {
    background: white;
    padding: 50px 30px 30px 27px;
    border-radius: 4px;
    box-shadow: 0px 5px 10px 0px rgba(0, 64, 128, 0.05);
  }

  .logoTitle {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
</style>
