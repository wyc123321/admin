<template>
  <div class="login">
    <div class="loginBack">
      <div class="loginContent">
        <div class="loginRight">
          <el-form ref="form" :model="form" label-width="57px" :rules="rules">
            <el-form-item label=" " prop="">
              <p class="logoTitle"><img src="../../../static/img/logo.png" alt=""></p>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <div class="divContainer">
                <i class="email"></i>
                <el-input v-model="form.email" placeholder="请输入邮箱" @keyup.enter.native="onSubmit('form')"
                          style="width: 300px"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <div class="divContainer">
                <i class="password"></i>
                <el-input type="password" placeholder="请输入密码" v-model="form.password"
                          @keyup.enter.native="onSubmit('form')"
                          style="width: 300px"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="验证码" prop="captchaCode">
              <div class="codeWarp divContainer">
                <i class="code"></i>
                <el-input v-model="form.captchaCode" placeholder="请输入验证码" @keyup.enter.native="onSubmit('form')"
                          style="width: 300px"></el-input>
                <img :src="imgSrc" alt="" class="codeImg" @click="getCode">
              </div>
            </el-form-item>
            <el-form-item>
              <el-button id="loginBtn" type="primary" @click="onSubmit('form')" style="width:300px">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "login",
    data() {
      var checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('邮箱不能为空'));
        } else if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
          callback(new Error("请输入正确的邮箱"));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'));
        }
        // if (!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(value))) {
        //   callback(new Error("请填写8到16位的数字字母组合"));
        // }
        else {
          callback();
        }
      }
      var captchaCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空'));
        } else {
          callback();
        }
      }
      return {
        form: {
          "captchaCode": "",
          "captchaId": "",
          "email": "",
          "password": ""
        },
        rules: {
          password: [
            {validator: validatePass, trigger: 'blur'}
          ],
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ],
          captchaCode: [
            {validator: captchaCode, trigger: 'blur'}
          ]
        },
        imgSrc: require('../../../static/img/yanzhen.png')
      }
    },
    methods: {
      async onSubmit(formName) {
        let valid = await this.$refs[formName].validate();
        if (valid) {
          let loading = this.$loading({
            lock: true,
            text: '正在登录，请稍候',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          //登录注册相关接口不能带token，所以单独处理
          var instance = this.$axios.create({
            headers: {'Content-Type': 'application/json'}
          });
          await instance.post(process.env.API_BASE + 'login', this.form)
            .then((response) => {
              if (response.status == '200') {
                window.localStorage.setItem('token', JSON.stringify(response.data));
                window.localStorage.setItem('user', JSON.stringify(this.form));
                this.$router.replace({path: '/navigate'});
              } else {
                this.$message.error(response.data);
              }
            })
            .catch(async (error) => {
              if (error.response) {
                this.form.captchaCode = '';
                this.$message.error(error.response.data);
                await this.getCode();
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log('Error', error.message);
              }
              console.log(error.config);
            });
          loading.close();
        } else {
          console.log('error submit!!');
          return false;
        }
      },
      async getCode() {
        var instance = this.$axios.create({
          headers: {'Content-Type': 'application/json'}
        });
        await instance.get(process.env.API_BASE + 'common/getCaptcha?date=' + Date.now())
          .then((response) => {
            if (response.status == '200') {
              this.imgSrc = response.data.base64Code;
              this.form.captchaId = response.data.key;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            // console.log(error);
          });
      }
    },
    async created() {
      await this.getCode()
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
    background: url("../../../static/img/back.png");
    background-size: 100% 100%;
    height: 100%;
  }


  .loginContent {
    display: flex;
    align-items: center;
    justify-content: center;
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
    margin-left: -30px;
  }

  .logoTitle img {
    width: 166px;
  }

  .codeImg {
    width: 135px;
    cursor: pointer;
  }

  .codeWarp {
    position: relative;
  }

  .codeWarp img {
    position: absolute;
    height: 35px;
    right: 20px;
    top: 3px;
  }

  .divContainer {
    position: relative;
  }

  .divContainer .email {
    /*position: absolute;*/
    /*width: 20px;*/
    /*height: 20px;*/
    /*background: url("../../../static/img/email.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*z-index: 10;*/
    /*left: 15px;*/
    /*top: 10px;*/
  }
</style>
