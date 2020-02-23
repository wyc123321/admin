<template>
  <el-dialog
    :title="formTitle"
    v-if="formShow"
    :visible="formShow"
    :before-close="cancle"
    :close-on-click-modal="false"
    :close-on-press-escape="false" append-to-body
    width="500px"
    top="8vh" class="addIncomeDialog">
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini">
        <el-form-item label="添加金额" prop="amount">
          <el-input v-model="ruleForm.amount" @blur="blur($event,'amount')"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captchaCode">
          <div class="captchaCode">
            <el-input v-model="ruleForm.captchaCode"></el-input>
            <img :src="imgSrc" alt="" @click="getCode">
          </div>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="emailCode">
          <div class="captchaCode">
            <el-input v-model="ruleForm.emailCode"></el-input>
            <el-button size="mini" @click="getEmailCode" :loading="loading1" :disabled="computeTime>0">{{computeTime>0 ?
              `已发送(${computeTime}s)` : '获取邮箱验证码'}}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancle">取消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import qs from 'qs'

  export default {
    name: "addMoneyDialog",
    data() {
      var amount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('添加金额不能为空'));
        } else if (value<0) {
          callback(new Error("添加金额必须大于0"));
        } else {
          callback();
        }
      };
      var captchaCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入图片验证码'));
        } else {
          if (value.length!=5) {
            callback(new Error('图片验证码为5位字符'));
          } else {
            callback();
          }
        }
      };
      var emailCode = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入邮箱验证码'));
        } else {
          if (value.length!=4) {
            callback(new Error('邮箱验证码为4位字符'));
          } else {
            callback();
          }
        }
      };
      return {
        ruleForm: {
          amount: '',
          emailCode: '',
          captchaId: '',
          captchaCode: '',
        },
        rules: {
          amount: [
            {required: true, message: '添加金额不能为空'},
            {validator: amount}
          ],
          captchaCode: [
            {required: true, message: '请输入图片验证码'},
            {validator: captchaCode}
          ],
          emailCode: [
            {required: true, message: '请输入邮箱验证码'},
            {validator: emailCode}
          ],
        },
        loading: false,
        loading1: false,
        imgSrc: '',
        computeTime: 0, // 计时的时间
      }
    },
    props: {
      formShow: {
        type: Boolean
      },
      formData: {
        type: Object
      },
      formTitle: {
        type: String
      },
    },
    methods: {
      handleSubmit() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            await this.addMoeny()
          } else {
            return false;
          }
        });
      },
      async addMoeny() {
        this.loading = true;
        let ruleForm = {
          "amount": Number(this.ruleForm.amount),
          "emailCode": this.ruleForm.emailCode,
          "toUserId": this.formData.id
        }
        await this.$axios.post(process.env.API_BASE + 'user/addBalance', ruleForm).then(response => {
          if (response.status == '200') {
            this.$emit('handleFormConfirm', 'addMoneyDialog')
            this.$message.success('添加成功');
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
        this.loading = false;
      },
      cancle() {
        this.$emit('handleFormClose', 'addMoneyDialog')
      },
      async getCode() {
        await this.$axios.get(process.env.API_BASE + 'common/getCaptcha?date=' + Date.now())
          .then((response) => {
            if (response.status == '200') {
              this.imgSrc = response.data.base64Code;
              this.ruleForm.captchaId = response.data.key;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {

          });
      },
      async getEmailCode() {
        let captchaCode = this.ruleForm.captchaCode.trim();
        if (!captchaCode) {
          this.$message.error('请填写图片验证码');
          return;
        }
        if (captchaCode.length < 5) {
          this.$message.error('图片验证码为5位字符');
          return
        }
        let formData = {
          captchaId: this.ruleForm.captchaId,
          captchaCode: this.ruleForm.captchaCode
        }
        this.loading1 = true;
        await this.$axios.post(process.env.API_BASE + 'user/getEmailCode?' + qs.stringify(formData))
          .then(response => {
            if (response.status == '200') {
              // 如果当前没有计时
              if (!this.computeTime) {
                // 启动倒计时
                this.computeTime = 60;
                this.intervalId = setInterval(() => {
                  this.computeTime--;
                  if (this.computeTime <= 0) {
                    // 停止计时
                    clearInterval(this.intervalId)
                  }
                }, 1000)
              }
            } else {

            }
          })
          .catch(error => {
            this.ruleForm.captchaCode = '';
            this.getCode()
          });
        this.loading1 = false;
      },
      blur(event, value) {
        event.target.value = Number(event.target.value).toFixed(2);
        if (event.target.value > 1000000000.00) {
          event.target.value = "0.00";
        } else {
          if (event.target.value == "NaN") {
            event.target.value = "0.00";
          }
          if (event.target.value < 0) {
            event.target.value = "0.00";
          }
        }
        this.ruleForm[value] = event.target.value;
      },
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

  .captchaCode button {
    width: 150px;
    margin-left: 15px;
    cursor: pointer;
  }
</style>
