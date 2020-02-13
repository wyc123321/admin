<template>
  <div class="root">
    <div class="search">
      <div>
        <span>省：</span>
        <el-input v-model.trim="userInput" placeholder="请输入省" size="mini"></el-input>
        <span class="span2">市：</span>
        <el-input v-model.trim="userInput" placeholder="请输入市" size="mini"></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
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
          <el-dropdown @command="handleCommand" @click="handleClick(scope.row)">
      <span class="el-dropdown-link">
        <img src="../../../static/img/more.png" alt="">
      </span>
            <el-dropdown-menu slot="dropdown" class="header-el-dropdown-menu">
              <el-dropdown-item  :command="[scope.row,'logout']">编辑</el-dropdown-item>
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
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        layout="sizes,total, prev, pager, next"
        :page-sizes="[20,50,100]"
        :page-size="limit"
        :current-page.sync="page"
        :total="userListData.count" class="page">
      </el-pagination>
      <v-addressDialog :formShow="addressDialogShow" v-if="addressDialogShow"
                       @handleFormConfirm="handleFormConfirm"
                       @handleFormClose="handleFormClose"
                       :formData="formData"
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
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        offset: 0,
        limit: 20,
        page: 1,
        //顶部检索类型，及初始值
        userListDataCondition: {
          where: {},
        },
        userListData: {
          rows: [],
          count: 200
        },
        addressDialogShow: false,
        formTitle: '新增地址',
        formData: {}
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
        }
      },
      add() {
        this.addressDialogShow = true;
      },
      // 每页多少条
      async handleSizeChange(val) {
        const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.limit = val;
        this.page = 1;
        await this.getListData();
        loading.close();
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
      getListData() {
        this.offset = (this.page - 1) * this.limit;
        this.userListDataCondition.where.offset = this.offset;
        this.userListDataCondition.where.limit = this.limit;
      },
      handleClick(row){
        console.log(row)
      },
      handleCommand(command) {
        console.log(command)
        if (command[1] == "password") {
          this.passwordChangeShow = true;
        }
        if (command[1] == "logout") {
          this.$confirm('确定退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            localStorage.removeItem('adminUser');
            this.$router.replace('/')
          }).catch(() => {

          });
        }
      },
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
