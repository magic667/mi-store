<template>
  <div id="app" name="app">
    <!-- 顶部导航栏 -->
    <div class="top-bar">
      <div class="nav">
        <ul>
          <li v-if="!this.$store.getters.getUser">
            <el-button type="text" @click="login">登录</el-button>
            <span class="sep">|</span>
            <el-button type="text" @click="register = true">注册</el-button>
          </li>
          <li v-else>
            欢迎
            <el-popover placement="top" width="180" v-model="visible">
              <p>确定退出登录吗？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button type="text" size="mini" @click="visible = false"
                  >取消</el-button
                >
                <el-button type="primary" size="mini" @click="logout"
                  >确定</el-button
                >
              </div>
              <el-button type="text" slot="reference">{{
                this.$store.getters.getUser.userName
              }}</el-button>
            </el-popover>
          </li>
          <li>
            <router-link to="/order">我的订单</router-link>
          </li>
          <li>
            <router-link to="/collect">我的收藏</router-link>
          </li>
          <li :class="getNum > 0 ? 'shopCart-full' : 'shopCart'">
            <router-link to="/shoppingCart">
              <i class="el-icon-shopping-cart-full"></i>购物车
              <span class="num">({{ getNum }})</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- 顶栏容器 -->
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#409eff"
        router
      >
        <div class="logo">
          <router-link to="/">
            <img src="./assets/imgs/mi.png" />
          </router-link>
        </div>
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/goods">全部商品</el-menu-item>
        <div class="so">
          <el-input
            @keydown.enter.native="searchClick"
            placeholder="请输入搜索内容"
            v-model="search"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchClick"
            ></el-button>
          </el-input>
        </div>
      </el-menu>
    </el-header>

    <!-- 登陆模块 -->
    <MyLogin></MyLogin>
    <!-- 注册模块 -->
    <MyRegister :register="register" @fromChild="isRegister"></MyRegister>

    <!-- 主要区域容器 -->
    <el-main>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </el-main>

    <!-- 底栏容器 -->
    <el-footer>
      <div class="footer">
        <div class="ng-promise-box">
          <div class="ng-promise">
            <p class="text">
              <a href="javascript:;" class="icon1">7天无理由退换货</a>
              <a href="javascript:;" class="icon2"> 满99元全场免邮</a>
              <a href="javascript:;" class="icon3" style="margin-right: 0"
                >100%品质保证</a
              >
            </p>
          </div>
        </div>
        <div class="mod-help">
          <p>
            <router-link to="/" @click.native="backTop">首页</router-link>
            <span>|</span>
            <router-link to="/goods" @click.native="backTop"
              >全部商品</router-link
            >
          </p>
          <p class="copyright">商城版权所有 &copy; 2012-2021</p>
        </div>
      </div>
    </el-footer>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import MyLogin from "./components/MyLogin.vue";

export default {
  components: { MyLogin },
  beforeUpdate() {
    this.activeIndex = this.$route.path;
  },
  data() {
    return {
      // 顶部导航栏选中的标签
      activeIndex: "",
      // 搜索条件
      search: "",
      // 是否显示注册组件
      register: false,
      // 是否退出登录
      visible: false,
    };
  },
  created() {
    // 判断用户是否已经登录(防止页面刷新后状态变化)
    if (sessionStorage.getItem("user")) {
      // 如果已经登录，设置vuex登录状态
      this.setUser(JSON.parse(sessionStorage.getItem("user")));
    }
  },
  computed: {
    ...mapGetters(["getUser", "getNum"]),
  },
  watch: {
    // 获取vuex的登录状态
    getUser(val) {
      if (val === "") {
        // 用户没有登录, 清空购物车和喜欢按钮样式
        this.setShoppingCart([]);
        this.$store.dispatch("clearMyLikeType");
      } else {
        // 用户已经登录,获取该用户的购物车信息
        this.$axios
          .post("/api/user/shoppingCart/getShoppingCart", {
            user_id: val.user_id,
          })
          .then((res) => {
            if (res.data.code == "001") {
              // 001 为成功，更新vuex购物车状态
              this.setShoppingCart(res.data.shoppingCartData);
            } else {
              // 提示失败信息
              this.notifyError(res.data.msg);
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
        // 从后台获取该用户收藏信息
        this.$axios
          .post("/api/user/collect/getCollect", {
            user_id: this.$store.getters.getUser.user_id,
          })
          .then((res) => {
            if (res.data.code == "001") {
              // 更新详情页收藏商品的喜欢按钮样式
              this.$store.dispatch("setMyCollect", res.data.collectList);
              this.$store.dispatch("changeMyLikeType");
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
    },
  },
  methods: {
    ...mapActions(["setUser", "setShowLogin", "setShoppingCart"]),
    backTop() {
      window.scroll(0, 0);
    },
    login() {
      // 点击登录按钮，通过更改vuex的showLogin值显示登录组件
      this.setShowLogin(true);
    },
    // 退出登录
    logout() {
      this.visible = false;
      // 清空本地登录信息
      sessionStorage.setItem("user", "");
      // 清空vuex登录信息
      this.setUser("");
      this.notifySucceed("成功退出登录");
    },
    // 接收注册子组件传过来的数据
    isRegister(val) {
      this.register = val;
    },
    // 点击搜索按钮
    searchClick() {
      if (this.search != "") {
        // 跳转到全部商品页面，并传递搜索条件
        this.$router.push({
          path: "/goods",
          query: { search: this.search },
        });
        this.search = "";
      }
    },
  },
};
</script>

<style>
/* 全局css */
* {
  margin: 0;
  padding: 0;
  border: 0;
  list-style: none;
}

#app .el-header {
  padding: 0;
}

#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}

#app .el-footer {
  padding: 0;
}

a,
a:hover {
  text-decoration: none;
}

/* 顶部导航栏 */
.top-bar {
  height: 40px;
  margin-bottom: 20px;
  background-color: #3d3d3d;
}

.top-bar .nav {
  width: 1225px;
  margin: 0 auto;
}

.top-bar .nav ul {
  float: right;
}

.top-bar .nav li {
  float: left;
  height: 40px;
  margin-left: 20px;
  color: #b0b0b0;
  font-size: 14px;
  text-align: center;
  line-height: 40px;
}

.top-bar .nav .sep {
  color: #b0b0b0;
  font-size: 12px;
  margin: 0 5px;
}

.top-bar .nav .el-button {
  color: #b0b0b0;
}

.top-bar .nav .el-button:hover {
  color: #fff;
}

.top-bar .nav li a {
  color: #b0b0b0;
}

.top-bar .nav a:hover {
  color: #fff;
}

.top-bar .nav .shopCart {
  width: 120px;
  background-color: #424242;
}

.top-bar .nav .shopCart:hover {
  background-color: #fff;
}
.top-bar .nav .shopCart:hover a {
  color: #ff6700;
}

.top-bar .nav .shopCart-full {
  width: 120px;
  background: #ff6700;
}
.top-bar .nav .shopCart-full a {
  color: #fff;
}

/* 顶栏容器 */
.el-header .el-menu {
  max-width: 1225px;
  margin: 0 auto;
}

.el-header .logo {
  float: left;
  width: 189px;
  height: 60px;
  margin-right: 100px;
}
.el-header .logo img {
  height: 60px;
}

.el-header .so {
  float: right;
  margin-top: 10px;
  width: 300px;
}

/* 底栏容器 */
.footer {
  width: 100%;
  padding-bottom: 20px;
  background-color: #2f2f2f;
  text-align: center;
}

.footer .ng-promise-box {
  margin: 0 auto;
  border-bottom: 1px solid #3d3d3d;
  line-height: 145px;
}

.footer .ng-promise p a {
  display: inline-block;
  height: 40px;
  margin-right: 210px;
  padding-left: 44px;
  font-size: 20px;
  color: #fff;
  line-height: 40px;
  background: url("./assets/imgs/us-icon.png") no-repeat 0 0;
}

.footer .ng-promise p .icon2 {
  background: url("./assets/imgs/us-icon.png") no-repeat 0 -40px;
}

.footer .ng-promise p .icon3 {
  background: url("./assets/imgs/us-icon.png") no-repeat 0 -80px;
}

.footer .mod-help {
  text-align: center;
  color: #888888;
}

.footer .mod-help p {
  margin: 20px 0 16px 0;
}

.footer .mod-help p a {
  color: #888888;
}

.footer .mod-help p a:hover {
  color: #fff;
}

.footer .mod-help p span {
  padding: 0 22px;
}
</style>
