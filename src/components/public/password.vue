<template>
  <el-dialog
    title="修改用户密码"
    :visible="passwordChangeShow"
    :before-close="handleClose"
    width="500px">
    <div class="dialog">
      <el-form  :model="formData" :rules="rules" ref="ruleForm" label-width="90px" size="small">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password"
                    v-model="formData.oldPassword"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password"
                    v-model="formData.newPassword"></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password"
                    v-model="formData.confirmPassword"></el-input>
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
    data(){
      var validatePass = (rule, value, callback)=>{
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if(!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(value))){
          callback(new Error("输入8到16位两种以上字符"));
        } else {
          // if (this.formUser.checkPass !== '') {
          //   this.$refs.formUser.validateField('checkPass');
          // }
          callback();
        }
      };
      var validatePass2 =(rule, value, callback)=>{
        if (value === '') {
          callback(new Error('请再次输入密码'));
        }else if(!(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,16}$/.test(value))){
          callback(new Error("输入8到16位两种以上字符"));
        } else if (value !== this.formData.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        formData:{
          oldPassword:"",
          newPassword:"",
          confirmPassword:""
        },
        rules:{
          oldPassword:[{ required: true,message:'请输入原始密码',trigger: 'blur'}],
          newPassword:[{ required: true,validator:validatePass,trigger: 'blur'}],
          confirmPassword:[{ required: true,validator:validatePass2,trigger: 'blur'}]
        }
      }
    },
    props:{
      passwordChangeShow:{
        type:Boolean
      }
    },
    methods:{
      handleClose(){
        this.formData = {
          oldPassword:"",
          newPassword:"",
          confirmPassword:""
        };
        this.$emit("handleFormClose", "passwordChange");
      },
      handleConfirm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var user = JSON.parse(sessionStorage.getItem('user'));
            this.formData.userId = user.id;
            var loading = this.$loading({
              lock: true,
              text: '正在提交，请稍候',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            var self = this;
            this.$axios.post(process.env.API_ACS + 'user/password/update',
              self.formData)
              .then(function (response) {
                if(response.data.success){
                  self.$message.success("修改密码成功");
                  self.handleClose();
                  loading.close();
                }
                else{
                  self.$message.error(response.data.message);
                  loading.close();
                }
              })
              .catch(function (error) {
                self.$message.error(error);
                loading.close();
              });
          } else {
            return false;
          }
        });
      }
    }
  }
</script>

