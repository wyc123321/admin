<template>
  <div class="root">
    <div class="search">
      <div>
        <span>邮箱：</span>
        <el-input v-model.trim="email" placeholder="请输入内容" size="mini"></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="addUser">新增</el-button>
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
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="phoneNumber"
        header-align="center"
        align="center"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="roleType"
        header-align="center"
        align="center"
        :formatter="formatter"
        label="角色">
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
      <v-addUserDialog :formShow="addUserShow" v-if="addUserShow"
                       @handleFormConfirm="handleFormConfirm"
                       @handleFormClose="handleFormClose"
                       :formData="formData"
                       :formTitle="formTitle"></v-addUserDialog>
    </div>
  </div>
</template>

<script>
  import addUserDialog from './addUserDialog'

  export default {
    name: "user",
    data() {
      return {
        userInput: '',
        tableData: [],
        page: 1,
        addUserShow: false,
        formTitle: '新增角色',
        formData: {},
        email: '',
        count: 0,
        roleList: [
          {
            label: '管理员',
            value: 0
          },
          {
            label: '业务员',
            value: 1
          },
        ]
      }
    },
    components: {
      'v-addUserDialog': addUserDialog,
    },
    methods: {
      handleFormClose(code) {
        if (code == "addUserDialog") {
          this.addUserShow = false;
        }
      },
      async handleFormConfirm(code, data) {
        if (code == "addUserDialog") {
          this.addUserShow = false;
          this.page = 1;
          await this.getListData()
        }
      },
      addUser() {
        this.addUserShow = true;
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
      async search() {
        if (!this.email.trim()) {
          this.$message.error('请输入搜索内容');
          return;
        }
        this.page = 1;
        await this.getListData()
      },
      async getListData() {
        this.email = this.email.trim();
        let form = {
          "email": this.email,
          "pageNum": this.page
        };
        let formData = JSON.parse(JSON.stringify(form));
        for (var key in formData) {
          if (!formData[key]) {
            delete formData[key]
          }
        }
        await this.$axios.post(process.env.API_BASE + 'user/list', formData).then(response => {
          if (response.status == '200') {
            this.tableData = response.data.recordList
            this.count = response.data.recordCount
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
      },
      handleCommand(command) {
        console.log(command)
        if (command[1] == "edit") {
          this.addUserShow = true;
          this.formTitle = '编辑角色';
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
        await this.$axios.post(process.env.API_BASE + 'user/forbidden?userId='+row.id)
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
      formatter(row, column, cellValue, index) {
        let result = this.roleList.find((item) => {
          return item.value == cellValue
        });
        if (result) {
          return result.label;
        }
      }
    },
    async created() {
      const loading = this.$loading({
        lock: true,
        text: '加载.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
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
