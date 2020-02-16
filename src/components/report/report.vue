<template>
  <div class="root">
    <div class="search">
      <div>
        <span>收货日期：</span>
        <el-date-picker
          size="mini"
          v-model="formData.entryDate"
          type="date"
          format="yyyy年 MM月 dd日"
          value-format="yyyyMMdd"
          :clearable="false"
          :editable="false"
          placeholder="请选择日期">
        </el-date-picker>
        <span class="span2">发货地：</span>
        <el-select v-model="formData.entryDate" placeholder="请选择" size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="span2">收货地：</span>
        <el-select v-model="formData.entryDate" placeholder="请选择" size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-download" size="mini">下载</el-button>
      </div>
    </div>
    <el-table
      size="mini"
      :data="tableData"
      stripe
      height="calc(100% - 70px)"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="55">
      </el-table-column>
      <el-table-column
        prop="deliveryCode"
        header-align="center"
        align="center"
        label="提煤单号">
      </el-table-column>
      <el-table-column
        prop="carNumber"
        header-align="center"
        align="center"
        label="车号">
      </el-table-column>
      <el-table-column
        prop="deliverDate"
        header-align="center"
        align="center"
        label="发货日期">
      </el-table-column>
      <el-table-column
        prop="arrivalDate"
        header-align="center"
        align="center"
        label="收货日期">
      </el-table-column>
      <el-table-column
        prop="deliverTon"
        header-align="center"
        align="center"
        label="发货吨数">
      </el-table-column>
      <el-table-column
        prop="arrivalTon"
        header-align="center"
        align="center"
        label="收货吨数">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="name"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="亏吨">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="lossFee"
        header-align="center"
        align="center"
        label="亏吨扣费">
      </el-table-column>
      <el-table-column
        prop="oilFee"
        header-align="center"
        align="center"
        label="运价">
      </el-table-column>
      <el-table-column
        prop="informationFee"
        header-align="center"
        align="center"
        label="信息费">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="name"-->
        <!--header-align="center"-->
        <!--align="center"-->
        <!--label="油票">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="extraTonFee"
        header-align="center"
        align="center"
        label="超吨费">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="实际金额">
      </el-table-column>
      <div slot="empty">
        <img src="../../../static/img/empty.svg" alt="">
        <p>暂无数据</p>
      </div>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "report",
    data() {
      return {
        userInput: '',
        formData: {
          entryDate: ''
        },
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
        page: 1,
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        count: 200
      }
    },
    methods: {
      async getListData() {
        // let form = {
        //   "email": this.email,
        //   "pageNum": this.page
        // };
        // let formData = JSON.parse(JSON.stringify(form));
        // for (var key in formData) {
        //   if (!formData[key]) {
        //     delete formData[key]
        //   }
        // }
        await this.$axios.post(process.env.API_BASE + 'wayBill/list',
        {
          "arrivalDate": "2020-02-02",
          "endAddressId": 0,
          "startAddressId": 0
        }).then(response => {
          if (response.status == '200') {
            this.tableData = response.data.wayBillList;
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
      },
      handleCommand(command) {
        if (command == "password") {
          this.passwordChangeShow = true;
        }
      },
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
    width: 180px !important;
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
