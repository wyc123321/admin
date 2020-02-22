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
        <el-form-item label="姓名" prop="realName">
        <el-input v-model="ruleForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="ruleForm.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleType">
          <el-select style="width: 360px;" v-model="ruleForm.roleType" placeholder="请选择角色">
            <el-option label="管理员" value="0"></el-option>
            <el-option label="业务员" value="1"></el-option>
          </el-select>
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
  export default {
    name: "addUserDialog",
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
      var validatemobilephoneNumber = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号码'));
        } else {
          // var reg = /^[1][0-9]{10}$/;
          var reg = /^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号码'));

          } else {
            callback();
          }
        }
      };
      return {
        ruleForm: {
          realName: '',
          email: '',
          phoneNumber: '',
          roleType: '',
        },
        rules: {
          realName: [
            {required: true, message: '请输入姓名'},
            {min: 2, max: 10, message: '长度在 2 到 10 个字符'}
          ],
          roleType: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          phoneNumber: [
            {required: true, message: '请输入手机号码', trigger: 'change'},
            {validator: validatemobilephoneNumber}
          ],
          email: [
            {required: true, message: '邮箱不能为空'},
            {validator: checkEmail}
          ],
        },
        loading: false
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
            await this.addRole()
          } else {
            return false;
          }
        });
      },
      async addRole() {
        this.loading = true;
        let ruleForm = JSON.parse(JSON.stringify(this.ruleForm));
        ruleForm.roleType = Number(ruleForm.roleType);
        await this.$axios.post(process.env.API_BASE + 'user/add', ruleForm).then(response => {
          if (response.status == '200') {
            this.$emit('handleFormConfirm', 'addUserDialog')
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
        this.loading = false;
      },
      cancle() {
        this.$emit('handleFormClose', 'addUserDialog')
      },
    }
  }
</script>

<style scoped>

</style>
