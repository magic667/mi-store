<template>
  <div class="home" id="home">
    <!-- 轮播图 -->
    <div class="block">
      <el-carousel height="460px">
        <el-carousel-item v-for="item in carousel" :key="item.carousel_id">
          <img
            style="height: 460px"
            :src="$target + item.imgPath"
            :alt="item.describes"
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 主要区域 -->
    <div class="main-box">
      <div class="main">
        <!-- 手机商品展示区域 -->
        <div class="phone">
          <div class="box-hd">
            <div class="title">手机</div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <div class="trans">
                <img :src="$target + 'public/imgs/phone/phone.png'" />
              </div>
            </div>
            <div class="list">
              <MyList :list="phoneList" :isMore="true"></MyList>
            </div>
          </div>
        </div>

        <!-- 家电商品展示区域 -->
        <div class="applicance" id="promo-menu">
          <div class="box-hd">
            <div class="title">家电</div>
            <div class="more" id="more">
              <MyMenu :val="2" @fromChild="getChildMsg">
                <template #1><span>热门</span></template>
                <template #2><span>电视影音</span></template>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img
                    :src="
                      $target + 'public/imgs/appliance/appliance-promo1.png'
                    "
                  />
                </li>
                <li>
                  <img
                    :src="
                      $target + 'public/imgs/appliance/appliance-promo2.png'
                    "
                  />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="applianceList" :isMore="true"></MyList>
            </div>
          </div>
        </div>

        <!-- 配件商品展示区域 -->
        <div class="accessory" id="promo-menu">
          <div class="box-hd">
            <div class="title">配件</div>
            <div class="more" id="more">
              <MyMenu :val="3" @fromChild="getChildMsg2">
                <template #1><span>热门</span></template>
                <template #2><span>保护套</span></template>
                <template #3><span>充电器</span></template>
              </MyMenu>
            </div>
          </div>
          <div class="box-bd">
            <div class="promo-list">
              <ul>
                <li>
                  <img
                    :src="
                      $target + 'public/imgs/accessory/accessory-promo1.png'
                    "
                  />
                </li>
                <li>
                  <img
                    :src="
                      $target + 'public/imgs/accessory/accessory-promo2.png'
                    "
                  />
                </li>
              </ul>
            </div>
            <div class="list">
              <MyList :list="accessoryList" :isMore="true"></MyList>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      carousel: [], // 轮播图数据
      phoneList: [], // 手机商品列表
      miTvList: [], // 小米电视商品列表
      applianceList: [], // 家电商品列表
      applianceHotList: [], //热门家电商品列表
      accessoryList: [], // 配件商品列表
      accessoryHotList: [], // 热门配件商品列表
      protectingShellList: [], // 保护套商品列表
      chargerList: [], // 充电器商品列表
      applianceActive: 1, // 家电当前选中的商品分类
      accessoryActive: 1, // 配件当前选中的商品分类
    };
  },
  created() {
    // 获取轮播图数据
    this.$axios
      .post("/api/resources/carousel", {})
      .then((res) => {
        this.carousel = res.data.carousel;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
    // 获取各类商品数据
    this.getPromo("手机", "phoneList");
    this.getPromo("电视机", "miTvList");
    this.getPromo("保护套", "protectingShellList");
    this.getPromo("充电器", "chargerList");
    // 热门家电，热门配件
    this.getPromo(
      ["电视机", "空调", "洗衣机"],
      "applianceList",
      "/api/product/getHotProduct"
    );
    this.getPromo(
      ["保护套", "保护膜", "充电器", "充电宝"],
      "accessoryList",
      "/api/product/getHotProduct"
    );
  },
  watch: {
    // 判断家电当前选中的商品分类，响应不同的商品数据
    applianceActive(val) {
      // 页面初始化时，显示的是热门家电列表
      // 此时需要把请求的家电列表数据赋值给热门家电列表
      if (this.applianceHotList == "") {
        this.applianceHotList = this.applianceList;
      }
      switch (val) {
        case 1:
          this.applianceList = this.applianceHotList;
          break;
        case 2:
          this.applianceList = this.miTvList;
          break;
      }
    },
    // 判断配件当前选中的商品分类，响应不同的商品数据
    accessoryActive(val) {
      // 页面初始化时，显示的是热门配件列表
      // 此时需要把请求的配件列表数据赋值给热门配件列表
      if (this.accessoryHotList == "") {
        this.accessoryHotList = this.accessoryList;
      }
      switch (val) {
        case 1:
          this.accessoryList = this.accessoryHotList;
          break;
        case 2:
          this.accessoryList = this.protectingShellList;
          break;
        case 3:
          this.accessoryList = this.chargerList;
          break;
      }
    },
  },
  methods: {
    // 封装获取各类商品数据方法
    getPromo(categoryName, val, api) {
      api = api != undefined ? api : "/api/product/getPromoProduct";
      this.$axios
        .post(api, {
          categoryName,
        })
        .then((res) => {
          this[val] = res.data.Product;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    // 获取家电模块子组件传过来的数据
    getChildMsg(val) {
      this.applianceActive = val;
    },
    // 获取配件模块子组件传过来的数据
    getChildMsg2(val) {
      this.accessoryActive = val;
    },
  },
};
</script>

<style scoped>
@import "../assets/css/index.css";
</style>