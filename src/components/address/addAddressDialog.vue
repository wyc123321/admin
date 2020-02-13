<template>
  <el-dialog
    :title="formTitle"
    v-if="formShow"
    :visible="formShow"
    :before-close="cancle"
    :close-on-click-modal="false"
    :close-on-press-escape="false" append-to-body
    width="600px"
    top="8vh" class="addIncomeDialog">
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="mini">
        <el-form-item label="省" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="市" prop="email">
          <el-input v-model="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="区/县" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址名称" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="ruleForm.role" placeholder="请选择角色">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="cancle">取消</el-button>
      <el-button type="primary" size="mini" @click="handleSubmit()">确定</el-button>
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
          name: '',
          email: '',
          phone: '',
          role: '',
        },
        rules: {
          name: [
            {required: true, message: '请输入姓名'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符'}
          ],
          role: [
            {required: true, message: '请选择角色', trigger: 'change'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'change'},
            {validator: validatemobilephoneNumber}
          ],
          email: [
            {required: true, message: '邮箱不能为空'},
            {validator: checkEmail}
          ],
        }
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
      async handleSubmit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$emit('handleFormClose', 'addAddressDialog')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancle() {
        this.$emit('handleFormClose', 'addAddressDialog')
      },
    }
  }
</script>

<style scoped>

</style>
