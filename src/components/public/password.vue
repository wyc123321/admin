<template>
  <el-dialog
    title="修改用户密码"
    :visible="formShow"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false" append-to-body
    width="500px">
    <div class="dialog">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="90px" size="small">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" show-password auto-complete="new-password"
                    v-model="formData.oldPassword"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="password">
          <el-input type="password" show-password
                    v-model="formData.password"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" show-password
                    v-model="formData.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captchaCode">
          <div class="captchaCode">
            <el-input v-model="formData.captchaCode"></el-input>
            <img :src="imgSrc" alt="" @click="getCode">
          </div>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="mini">取消</el-button>
      <el-button type="primary" @click="handleConfirm('ruleForm')" size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.formData.confirmPassword !== '') {
            this.$refs.ruleForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var captchaCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空'));
        } else {
          callback();
        }
      }
      return {
        formData: {
          oldPassword: "",
          password: "",
          confirmPassword: "",
          captchaCode: "",
          captchaId: "",
        },
        rules: {
          oldPassword: [{required: true, message: '请输入原始密码'}],
          password: [{required: true, validator: validatePass}],
          confirmPassword: [{required: true, validator: validatePass2}],
          captchaCode: [
            {validator: captchaCode,required: true, trigger: 'blur'}
          ]
        },
        imgSrc: ''
      }
    },
    props: {
      formShow: {
        type: Boolean
      }
    },
    methods: {
      handleClose() {
        this.formData = {
          oldPassword: "",
          password: "",
          confirmPassword: "",
          captchaId: "",
          captchaCode: "",
        };
        this.$emit("handleFormClose", "passwordChange");
      },
      handleConfirm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let formData = JSON.parse(JSON.stringify(this.formData));
            delete formData.confirmPassword
            let loading = this.$loading({
              lock: true,
              text: '正在提交，请稍候',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            await this.$axios.post(process.env.API_BASE + 'user/changePassword', formData)
              .then((response) => {
                if (response.status == '200') {
                  this.$message.success("修改密码成功");
                  this.handleClose();
                } else {
                  this.$message.error(response.data.message);
                }
              })
              .catch(function (error) {
                console.log(error)
              });
              loading.close();
          } else {
            return false;
          }
        });
      },
      async getCode() {
        await this.$axios.get(process.env.API_BASE + 'common/getCaptcha?date=' + Date.now())
          .then((response) => {
            if (response.status == '200') {
              this.imgSrc = response.data.base64Code;
              this.formData.captchaId = response.data.key;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {

          });
      }
    },
    async created() {
      await this.getCode()
    }
  }
</script>
<style scoped>
  .captchaCode {
    display: flex;
    align-items: center;
  }

  .captchaCode img {
    width: 150px;
    margin-left: 15px;
    cursor: pointer;
  }
</style>

