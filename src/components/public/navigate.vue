<template>
  <div class="navigate">
    <header>
      <div class="navLeft">
        <h1 @click="goTo"><img src="../../../static/img/logoFFF.png" alt=""></h1>
        <ul class="Nav">
          <li>
            <router-link to="/navigate/report">数据报表</router-link>
          </li>
          <li>
            <router-link to="/navigate/user">用户管理</router-link>
          </li>
          <li>
            <router-link to="/navigate/address">地址管理</router-link>
          </li>
        </ul>
      </div>
      <div>
        <el-dropdown  @command="handleCommand" class="dropdown">
          <span>{{email}}<i class="el-icon-caret-bottom"></i></span>
          <el-dropdown-menu slot="dropdown" class="header-el-dropdown-menu">
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <router-view></router-view>
    <v-password v-if="passwordChangeShow" :formShow="passwordChangeShow"
                @handleFormClose="handleFormClose"></v-password>
  </div>
</template>
<script>
  import password from './password'

  export default {
    name:'navigate',
    data() {
      return {
        email: '',
        passwordChangeShow: false
      }
    },
    components: {
      'v-password': password
    },
    methods: {
      //响应组件关闭事件
      handleFormClose(code) {
        if (code == "passwordChange") {
          this.passwordChangeShow = false;
        }

      },
      async handleFormConfirm(code, formData) {
        if (code == "notify") {

        }
      },
      handleCommand(command) {
        if (command == "password") {
          this.passwordChangeShow = true;
        }
        if (command == "logout") {
          this.$confirm('确定退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(async () => {
            await this.logout()
          }).catch(() => {

          });
        }
      },
      async logout() {
        await this.$axios.get(process.env.API_BASE + 'logout').then(response => {
          if (response.status == '200') {
            localStorage.removeItem('token')
            this.$router.replace('/')
            this.$message.success('退出登录成功');
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {

        })
      },
      init() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (user) {
          this.email = user.email
        }
      },
      goTo(){
        this.$router.replace('/navigate/report')
      }

    },
    created() {
      this.init()
    },

  }
</script>
<style>
  .navigate {
    height: calc(100% - 40px);
  }

  .navigate header {
    width: 100%;
    height: 64px;
    background: linear-gradient(90deg, rgba(63, 132, 255, 1), rgba(29, 98, 240, 1));
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
    margin-bottom: 30px;
  }

  .navigate header ul {
    display: flex;
  }

  .navigate .navLeft {
    display: flex;
  }

  .navigate .navLeft h1 img {
    width: 91px;
    cursor: pointer;
    margin-right: 92px;
  }

  .navigate .navLeft ul li a {
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    padding: 0 15px;
    display: block;
    border-radius: 4px;
  }

  .navigate .navLeft ul li a.router-link-active {
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    padding: 0 15px;
    background: rgba(255, 255, 255, 0.25);
    display: block;
    border-radius: 4px;
  }

  .navigate .navLeft ul li {
    margin-right: 30px;
  }

  .dropdown {
    color: rgba(255, 255, 255, 1) !important;
    font-size: 18px !important;
  }
</style>
