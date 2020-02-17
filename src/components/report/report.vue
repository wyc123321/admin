<template>
  <div class="root">
    <div class="search">
      <div>
        <span>收货日期：</span>
        <el-date-picker
          size="mini"
          v-model="formData.arrivalDate"
          type="date"
          @change="changeDate"
          format="yyyy年 MM月 dd日"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
          placeholder="请选择日期">
        </el-date-picker>
        <span class="span2">发货地：</span>
        <el-select v-model="formData.startAddressId" :clearable="true" @change="search" filterable placeholder="请选择"
                   size="mini">
          <el-option
            v-for="item in addressList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span class="span2">收货地：</span>
        <el-select v-model="formData.endAddressId" :clearable="true" @change="search" filterable placeholder="请选择"
                   size="mini">
          <el-option
            v-for="item in addressList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-download" size="mini">下载</el-button>
      </div>
    </div>
    <el-table
      size="mini"
      :data="tableData"
      stripe
      height="calc(100% - 30px)"
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
        :formatter="formatter"
        label="发货日期">
      </el-table-column>
      <el-table-column
        prop="arrivalDate"
        header-align="center"
        align="center"
        :formatter="formatter"
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
  import moment from 'moment'

  export default {
    name: "report",
    data() {
      return {
        userInput: '',
        formData: {
          arrivalDate: '',
          endAddressId: "",
          startAddressId: ""
        },
        tableData: [],
        page: 1,
        addressList: []
      }
    },
    methods: {
      async getListData() {
        let form = {
          "arrivalDate": this.formData.arrivalDate,
          "endAddressId": this.formData.endAddressId,
          "startAddressId": this.formData.startAddressId
        };
        let formData = JSON.parse(JSON.stringify(form));
        for (var key in formData) {
          if (!formData[key]) {
            delete formData[key]
          }
        }
        await this.$axios.post(process.env.API_BASE + 'wayBill/list', formData).then(response => {
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
      async getAllAddressList() {
        await this.$axios.post(process.env.API_BASE + '/address/getALlList').then(response => {
          if (response.status == '200') {
            this.addressList = response.data;
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
      },
      async search() {
        await this.getListData()
      },
      async changeDate() {
        const loading = this.$loading({
          lock: true,
          text: '加载中.....',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.page = 1;
        await this.getListData();
        loading.close();
      },
      formatter(row, column, cellValue, index) {
        return  moment(cellValue).format('YYYY-MM-DD')
      }
    },
    async created() {
      const loading = this.$loading({
        lock: true,
        text: '加载中.....',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.formData.arrivalDate = moment().format('YYYY-MM-DD');
      await this.getListData();
      await this.getAllAddressList();
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
