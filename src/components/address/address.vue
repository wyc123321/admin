<template>
  <div class="root">
    <div class="search">
      <div>
        <span>省：</span>
        <el-select v-model="ruleForm.province" @change="change" size="mini" filterable placeholder="请选择省份">
          <el-option
            v-for="item in provinceList"
            :key="item.regionCode"
            :label="item.regionName"
            :value="item.regionCode">
          </el-option>
        </el-select>
        <span class="span2">市：</span>
        <el-select v-model="ruleForm.city" size="mini" filterable placeholder="请选择城市">
          <el-option
            v-for="item in cityList"
            :key="item.regionCode"
            :label="item.regionName"
            :value="item.regionCode">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="add">新增</el-button>
      </div>
    </div>
    <el-table
      size="mini"
      :data="tableData"
      stripe
      height="calc(100% - 70px)"
      style="width: 100%">
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="省">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="市">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="区/县">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="地址名称">
      </el-table-column>
      <el-table-column label="操作" width="150" align="center"
                       header-align="center">
        <template slot-scope="scope">
          <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <img src="../../../static/img/more.png" alt="">
      </span>
            <el-dropdown-menu slot="dropdown" class="header-el-dropdown-menu">
              <!--<el-dropdown-item :command="[scope.row,'edit']">编辑</el-dropdown-item>-->
              <el-dropdown-item :command="[scope.row,'forbidden']">禁用账号</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <div slot="empty">
        <img src="../../../static/img/empty.svg" alt="">
        <p>暂无数据</p>
      </div>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handlePageChange"
        :current-page.sync="page"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :total="count" class="page">
      </el-pagination>
      <v-addressDialog :formShow="addressDialogShow" v-if="addressDialogShow"
                       @handleFormConfirm="handleFormConfirm"
                       @handleFormClose="handleFormClose"
                       :formTitle="formTitle"></v-addressDialog>
    </div>
  </div>
</template>

<script>
  import addressDialog from './addAddressDialog'

  export default {
    name: "addressComponent",
    data() {
      return {
        userInput: '',
        tableData: [],
        page: 1,
        addressDialogShow: false,
        formTitle: '新增地址',
        formData: {},
        count: 0,
        provinceList: [],
        cityList: [],
        regionCode: '',
        ruleForm: {
          province: '',
          city: ''
        }
      }
    },
    components: {
      'v-addressDialog': addressDialog,
    },
    methods: {
      handleFormClose(code) {
        if (code == "addAddressDialog") {
          this.addressDialogShow = false;
        }
      },
      async handleFormConfirm(code, data) {
        if (code == "addAddressDialog") {
          this.addressDialogShow = false;
          this.page = 1;
          this.regionCode='';
          await this.getListData();
        }
      },
      add() {
        this.addressDialogShow = true;
      },
      //翻页触发的方法
      async handlePageChange(val) {
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.page = val;
        await this.getListData();
        loading.close();
      },
      async search(){
        if(!this.ruleForm.province){
          this.$message.error('请选择省份');
          return;
        }
        this.regionCode=this.ruleForm.province
        if(this.ruleForm.city){
          this.regionCode=this.ruleForm.city
        }
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.page = 1;
        await this.getListData();
        loading.close();
      },
      async getListData() {
        this.regionCode = this.regionCode.trim();
        let form = {
          "regionCode": this.regionCode,
          "pageNum": this.page
        };
        let formData = JSON.parse(JSON.stringify(form));
        for (var key in formData) {
          if (!formData[key]) {
            delete formData[key]
          }
        }
        await this.$axios.post(process.env.API_BASE + 'address/list', formData).then(response => {
          if (response.status == '200') {
            this.tableData = response.data.recordList;
            this.count = response.data.recordCount;
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
      },
      handleCommand(command) {
        console.log(command)
        if (command[1] == "edit") {
          this.addressDialogShow = true;
          this.formTitle = '编辑地址';
          this.formData = {}
        }
        if (command[1] == "delete") {
          this.$confirm('确定退出删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {

          }).catch(() => {

          });
        }
        if (command[1] == "forbidden") {
          this.$confirm('确定禁用吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(async () => {
            await this.forbidden(command[0])
          }).catch(() => {

          });
        }
      },
      async forbidden(row) {
        await this.$axios.post(process.env.API_BASE + 'address/forbidden', {
          addressId: row.id
        })
          .then((response) => {
            if (response.status == '200') {
              this.$message.success("禁用成功");
            } else {
              this.$message.error(response.data.message);
            }
          })
          .catch(function (error) {
            this.$message.error(error);
          });
        await this.getListData();
      },
      async change() {
        this.ruleForm.city = '';
        await this.$axios.get(process.env.API_BASE + 'common/queryRegion', {
          params: {
            'parentCode': this.ruleForm.province
          }
        })
          .then((response) => {
            if (response.status == '200') {
              this.cityList = response.data;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(function (error) {
            this.$message.error(error);
          });
      },
      async queryRegion() {
        await this.$axios.get(process.env.API_BASE + 'common/queryRegion')
          .then((response) => {
            if (response.status == '200') {
              this.provinceList = response.data;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch(function (error) {
            this.$message.error(error);
          });
      },
    },
    async created() {
      const loading = this.$loading({
        lock: true,
        text: '加载中.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.queryRegion();
      await this.getListData();
      loading.close();
    }
  }
</script>

<style scoped>
  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .search .el-input {
    width: 300px !important;
  }

  .search div span {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
  }

  .span2 {
    margin-left: 20px;
  }

  .pagination {
    height: 40px;
    display: flex;
    background: white;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
