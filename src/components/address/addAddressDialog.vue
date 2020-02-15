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
        <el-form-item label="地址" prop="regionCode">
          <el-select v-model="ruleForm.regionCode" filterable placeholder="请选择地址">
            <el-option
              v-for="item in regionList"
              :key="item.regionCode"
              :label="item.regionName"
              :value="item.regionCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入详细地址名称"></el-input>
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
    name: "addAddressDialog",
    data() {
      return {
        ruleForm: {
          name: '',
          regionCode: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入详细地址名称'},
            {min: 3, message: '最少3字符'}
          ],
          regionCode: [
            {required: true, message: '请选择地址', trigger: 'change'}
          ]
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
      regionList: {
        type: Array
      },
    },
    methods: {
      handleSubmit() {
        this.$refs['ruleForm'].validate(async (valid) => {
          if (valid) {
            await this.addAddress()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      async addAddress() {
        this.loading = true;
        await this.$axios.post(process.env.API_BASE + 'address/add', this.ruleForm).then(response => {
          if (response.status == '200') {
            this.$emit('handleFormConfirm', 'addAddressDialog')
            this.$message.success('添加成功');
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
        this.loading = false;
      },
      cancle() {
        this.$emit('handleFormClose', 'addAddressDialog')
      },
    }
  }
</script>

<style scoped>

</style>
