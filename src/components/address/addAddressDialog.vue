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
        <el-form-item label="地址" prop="selectedOptions">
          <el-cascader style="width: 460px;"
            v-model="ruleForm.selectedOptions"
            placeholder="请选择省市区"
            :options="cascaderData"
            @active-item-change="handleItemChange"
            :props="{
             value: 'regionCode',
             label: 'regionName',
             children: 'children'
            }"
          ></el-cascader>
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
  let id = 0;
  export default {
    name: "addAddressDialog",
    data() {
      return {
        ruleForm: {
          name: '',
          selectedOptions: [],
        },
        rules: {
          name: [
            {required: true, message: '请输入详细地址名称'},
            {min: 3, message: '最少3字符'}
          ],
          selectedOptions: [
            {required: true, message: '请选择地址', trigger: 'change'}
          ]
        },
        loading: false,
        cascaderData: [],
      }
    },
    props: {
      formShow: {
        type: Boolean
      },
      formTitle: {
        type: String
      }
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
        let  ruleForm  = JSON.parse(JSON.stringify(this.ruleForm)) ;
        let formData={
          name: ruleForm.name,
          regionCode: ruleForm.selectedOptions[ruleForm.selectedOptions.length-1]
        };
        await this.$axios.post(process.env.API_BASE + 'address/add', formData).then(response => {
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
      async getNodes(val) {
        let idArea;
        let sizeArea;
        if (!val) {
          idArea = null
          sizeArea = 0
        } else if (val.length === 1) {
          idArea = val[0]
          sizeArea = val.length // 3:一级 4:二级 6:三级
        } else if (val.length === 2) {
          idArea = val[1]
          sizeArea = val.length // 3:一级 4:二级 6:三级
        }
        await this.$axios.get(process.env.API_BASE + 'common/queryRegion', {
          params: {
            'parentCode': idArea
          }
        }).then(response => {
          if (response.data) {
            let Items = response.data
            if (sizeArea === 0) { // 初始化 加载一级 省
              this.cascaderData = Items.map((value, i) => {
                return {
                  regionCode: value.regionCode,
                  regionName: value.regionName,
                  children: []
                }
              })
            } else if (sizeArea === 1) { // 点击一级 加载二级 市
              this.cascaderData.map((value, i) => {
                if (value.regionCode === val[0]) {
                  if (!value.children.length) {
                    value.children = Items.map((value, i) => {
                      return {
                        regionCode: value.regionCode,
                        regionName: value.regionName,
                        children: []
                      }
                    })
                  }
                }
              })
            } else if (sizeArea === 2) { // 点击二级 加载三级 区
              console.log(3)
              this.cascaderData.map((value, i) => {
                if (value.regionCode === val[0]) {
                  value.children.map((value, i) => {
                    if (value.regionCode === val[1]) {
                      if (!value.children.length) {
                        value.children = Items.map((value, i) => {
                          return {
                            regionCode: value.regionCode,
                            regionName: value.regionName,
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          } else {
            console.log(response.data.msg)
          }
        }, error => {
          console.log(error)
        })
      },
      handleItemChange(val) {
        this.getNodes(val)
      }
    },
    mounted() {
      this.getNodes()
    }
  }
</script>

<style scoped>

</style>
