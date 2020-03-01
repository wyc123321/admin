<template>
  <div id="app">
    <router-view/>
    <footer class="footer" v-if="$route.meta.isShow">
      Copyright2020 鄂尔多斯市通茂煤炭运销有限公司版权所有
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  * {
    margin: 0px;
    padding: 0px;
  }

  body, html {
    height: 100%;
    overflow: hidden;
    background: rgb(248, 247, 252);
  }


  a {
    text-decoration: none
  }

  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .el-dialog__header {
    background: rgba(45, 50, 68, 1) !important;
    color: #ffffff !important;
    height: 30px;
    border-radius: 2px;
    font-size: 14px;
  }

  .el-dialog__header .el-dialog__title {
    color: #ffffff !important;
    font-size: 16px;
  }

  .el-dialog__footer {
    border-top: 1px solid #d5d5d5 !important;
    background: rgba(248, 248, 248, 1) !important;
  }

  ul, li {
    list-style: none;
  }

  .root {
    height: calc(100% - 110px);
    padding: 30px 20px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 6px 0px rgba(221, 226, 255, 0.53);
    margin: 0 30px;
  }

  .footer {
    height: 60px;
    text-align: center;
    font-size: 14px;
    color: #999;
  }

  .root .el-table::before {
    height: 0px !important;
  }

  .root table thead {
    background-color: #F8F7FC !important;
  }

  .root table thead tr th {
    background-color: #F8F7FC !important;
  }

  .el-dropdown {
    cursor: pointer !important;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition-delay: 99999s !important;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out !important;
  }
</style>
