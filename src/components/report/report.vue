<template>
  <div class="root">
    <div class="search">
      <div>
        <span>填表日期：</span>
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
        <span class="span2">价格：</span>
        <el-select v-model="formData.freightUnit" :clearable="true" @change="changeFreight" filterable placeholder="请选择"
                   size="mini">
          <el-option
            v-for="item in freightUnitList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        <!--<el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>-->
      </div>
      <div>
        <el-button type="primary" icon="el-icon-download" size="mini" @click="handleExport">下载</el-button>
      </div>
    </div>
    <el-table
      size="mini"
      :data="tableData"
      stripe
      ref="table"
      :summary-method="getSummaries"
      show-summary
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
        label="填表日期">
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
      <el-table-column
        prop="lossTon"
        header-align="center"
        align="center"
        label="亏吨">
      </el-table-column>
      <el-table-column
        prop="lossFee"
        header-align="center"
        align="center"
        label="亏吨扣费">
      </el-table-column>
      <el-table-column
        prop="freightUnit"
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
      <el-table-column
        prop="oilFee"
        header-align="center"
        align="center"
        label="油票">
      </el-table-column>
      <el-table-column
        prop="extraTonFee"
        header-align="center"
        align="center"
        label="超吨费">
      </el-table-column>
      <el-table-column
        prop="paymentAmount"
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
  import qs from 'qs'

  export default {
    name: "report",
    data() {
      return {
        userInput: '',
        formData: {
          arrivalDate: '',
          endAddressId: "",
          startAddressId: "",
          freightUnit: "",
        },
        tableData: [],
        page: 1,
        addressList: [],
        freightUnitList: [],
      }
    },
    methods: {
      async getListData() {
        let form = {
          "arrivalDate": this.formData.arrivalDate,
          "endAddressId": this.formData.endAddressId,
          "startAddressId": this.formData.startAddressId,
          "freightUnit": this.formData.freightUnit
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
      async getFreightUnitList() {
        let form = {
          "arrivalDate": this.formData.arrivalDate,
          "endAddressId": this.formData.endAddressId,
          "startAddressId": this.formData.startAddressId
        };
        let formData = JSON.parse(JSON.stringify(form));
        await this.$axios.post(process.env.API_BASE + '/wayBill/getFreightUnitList', formData).then(response => {
          if (response.status == '200') {
            this.freightUnitList = response.data;
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
      },
      async search() {
        this.freightUnitList = [];
        this.formData.freightUnit = '';
        if (this.formData.endAddressId && this.formData.startAddressId) {
          await this.getFreightUnitList()
        }
        await this.getListData();
      },
      async changeFreight() {
        await this.getListData();
      },
      async changeDate() {
        const loading = this.$loading({
          lock: true,
          text: '加载中.....',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.page = 1;
        this.freightUnitList = [];
        this.formData.freightUnit = '';
        if (this.formData.endAddressId && this.formData.startAddressId) {
          await this.getFreightUnitList()
        }
        await this.getListData();
        loading.close();
      },
      formatter(row, column, cellValue, index) {
        return moment(cellValue).format('YYYY-MM-DD');
      },
      getSummaries(param) {
        this.$nextTick(() => {
          this.$refs.table.doLayout();
        });
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          let xx = JSON.stringify(data);
          xx = JSON.parse(xx);
          const values = xx.map(item => {
            if (index == 1 || index == 2 || index == 3 || index == 4) {
              return NaN
            } else {
              return Number(item[column.property]);
            }
          });
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = Number(sums[index]).toFixed(2);
            let sum1 = sums[index].split('.')[0];
            let sum2 = sums[index].split('.')[1];
            sum1 = sum1.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            sums[index] = sum1 + '.' + sum2;
            // sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      async handleExport() {
        let formData = {
          "arrivalDate": this.formData.arrivalDate,
          "startAddressId": this.formData.startAddressId,
          "endAddressId": this.formData.endAddressId,
        };
        if (!formData.startAddressId) {
          this.$message.error('请选择发货地');
          return;
        }
        if (!formData.endAddressId) {
          this.$message.error('请选择收货地');
          return;
        }
        await this.$axios.get(process.env.API_BASE + '/wayBill/download?' + qs.stringify(formData), {responseType: 'arraybuffer'}).then(response => {
          if (response.status == '200') {
            let startAddressName = '';
            let endAddressName = '';
            let startAddressResult = this.addressList.find((item) => {
              return formData.startAddressId == item.id
            });
            if (startAddressResult) {
              startAddressName = startAddressResult.name;
            }
            let endAddressResult = this.addressList.find((item) => {
              return formData.endAddressId == item.id
            });
            if (endAddressResult) {
              endAddressName = endAddressResult.name;
            }
            let arrivalDate = moment(formData.arrivalDate).format('YYYY年-MM月-DD日');
            let fileName = "通茂煤运-" + startAddressName + '-' + endAddressName + '-' + arrivalDate + "-数据报表";
            let blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
            let filename = fileName;
            let a = document.createElement('a');
            a.innerHTML = filename;
            a.download = fileName + ".xlsx";
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            let evt = document.createEvent("MouseEvents");
            evt.initEvent("click", false, false);
            a.dispatchEvent(evt);
            document.body.removeChild(a);
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
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
