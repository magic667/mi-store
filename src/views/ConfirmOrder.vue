<template>
  <div id="confirmOrder" class="confirmOrder">
    <!-- 头部 -->
    <div class="confirmOrder-header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>确认订单</p>
        <router-link to></router-link>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 选择地址 -->
      <div class="section-address">
        <p class="title">收货地址</p>
        <div class="address-body">
          <ul>
            <li
              :class="item.id == confirmAddress ? 'in-section' : ''"
              v-for="item in address"
              :key="item.id"
            >
              <h2>{{ item.name }}</h2>
              <p class="phone">{{ item.phone }}</p>
              <p class="address">{{ item.address }}</p>
            </li>
            <li class="add-address">
              <i class="el-icon-circle-plus-outline"></i>
              <p>添加新地址</p>
            </li>
          </ul>
        </div>
      </div>

      <!-- 商品及优惠券 -->
      <div class="section-goods">
        <p class="title">商品及优惠券</p>
        <div class="goods-list">
          <ul>
            <li v-for="item in getCheckGoods" :key="item.id">
              <img :src="$target + item.productImg" />
              <span class="pro-name">{{ item.productName }}</span>
              <span class="pro-price">{{ item.price }}元 x {{ item.num }}</span>
              <span class="pro-status"></span>
              <span class="pro-total">{{ item.price * item.num }}元</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <p class="shipment">包邮</p>
      </div>

      <!-- 发票 -->
      <div class="section-invoice">
        <p class="title">发票</p>
        <p class="invoice">电子发票</p>
        <p class="invoice">个人</p>
        <p class="invoice">商品明细</p>
      </div>

      <!-- 结算列表 -->
      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">{{ getCheckNum }}件</span>
            </li>
            <li>
              <span class="title">商品总价：</span>
              <span class="value">{{ getTotalPrice }}元</span>
            </li>
            <li>
              <span class="title">活动优惠：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">优惠券抵扣：</span>
              <span class="value">-0元</span>
            </li>
            <li>
              <span class="title">运费：</span>
              <span class="value">0元</span>
            </li>
            <li class="total">
              <span class="title">应付总额：</span>
              <span class="value">
                <span class="total-price">{{ getTotalPrice }}</span
                >元
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 结算导航 -->
      <div class="section-bar">
        <div class="btn">
          <router-link to="/shoppingCart" class="btn-base btn-return"
            >返回购物车</router-link
          >
          <a
            href="javascript:void(0);"
            @click="addOrder"
            class="btn-base btn-primary"
            >结算</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { mapGetters } from "vuex";

export default {
  name: "confirmOrder",
  data() {
    return {
      // 虚拟地址数据
      // 地址id
      confirmAddress: 1,
      // 地址列表
      address: [
        {
          id: 1,
          name: "陈同学",
          phone: "13580018623",
          address: "广东 广州市 白云区 江高镇 ***",
        },
        {
          id: 2,
          name: "陈同学",
          phone: "13580018623",
          address: "广东 茂名市 化州市 杨梅镇 ***",
        },
      ],
    };
  },
  created() {
    if (this.getCheckNum < 1) {
      this.notifyError("请勾选商品后再结算");
      this.$router.push({ path: "/shoppingCart" });
    }
  },
  computed: {
    // 结算商品数量，商品数量总计，结算商品信息
    ...mapGetters(["getCheckNum", "getTotalPrice", "getCheckGoods"]),
  },
  methods: {
    ...mapActions(["deleteShoppingCart"]),
    // 添加订单
    addOrder() {
      this.$axios
        .post("/api/user/order/addOrder", {
          user_id: this.$store.getters.getUser.user_id,
          products: this.getCheckGoods,
        })
        .then((res) => {
          let products = this.getCheckGoods;
          switch (res.data.code) {
            // "001" 代表结算成功
            case "001":
              for (let i = 0; i < products.length; i++) {
                const temp = products[i];
                // 删除已经结算的购物车商品
                this.deleteShoppingCart(temp.id);
              }
              // 提示结算结果
              this.notifySucceed(res.data.msg);
              // 跳转我的订单页面
              this.$router.push({ path: "order" });
              break;
            default:
              // 提示失败信息
              this.notifyError(res.data.msg);
          }
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
  },
};
</script>

<style scoped>
.confirmOrder {
  padding-bottom: 20px;
  background-color: #f5f5f5;
}

/* 头部 */
.confirmOrder .confirmOrder-header {
  margin-bottom: 20px;
  background-color: #fff;
  border-bottom: 20px;
}

.confirmOrder .confirmOrder-header .header-content {
  width: 1225px;
  height: 80px;
  margin: 0 auto;
}

.confirmOrder .confirmOrder-header .header-content p {
  float: left;
  margin-right: 20px;
  line-height: 80px;
  font-size: 28px;
  color: #424242;
}

.confirmOrder .confirmOrder-header .header-content p i {
  line-height: 80px;
  font-size: 45px;
  color: #ff6700;
}

/* 主要内容 */
.confirmOrder .content {
  width: 1225px;
  padding: 48px 0 0;
  margin: 0 auto;
  background-color: #fff;
}

/* 选择地址 */
.confirmOrder .content .section-address {
  overflow: hidden;
  margin: 0 48px;
}

.confirmOrder .content .section-address .title {
  margin-bottom: 20px;
  line-height: 20px;
  font-size: 18px;
  color: #333;
}

.confirmOrder .content .address-body li {
  float: left;
  width: 220px;
  height: 178px;
  padding: 15px 24px 0;
  margin: 0 17px 24px 0;
  border: 1px solid #e0e0e0;
  color: #333;
}

.confirmOrder .content .address-body .in-section {
  border: 1px solid #ff6700;
}

.confirmOrder .content .address-body li h2 {
  margin-bottom: 10px;
  line-height: 30px;
  font-size: 18px;
  font-weight: 400;
}

.confirmOrder .content .address-body li p {
  font-size: 14px;
  color: #757575;
}

.confirmOrder .content .address-body li .address {
  overflow: hidden;
  max-width: 180px;
  max-height: 88px;
  line-height: 22px;
  padding: 10px 0;
}

.confirmOrder .content .address-body .add-address {
  line-height: 30px;
  text-align: center;
}

.confirmOrder .content .address-body .add-address i {
  padding-top: 50px;
  text-align: center;
  font-size: 30px;
}

/* 商品及优惠券 */
.confirmOrder .content .section-goods {
  margin: 0 48px;
}

.confirmOrder .content .section-goods p .title {
  line-height: 40px;
  font-size: 18px;
  color: #333;
}

.confirmOrder .content .section-goods .goods-list {
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.confirmOrder .content .section-goods .goods-list li {
  overflow: hidden;
  padding: 10px 0;
  color: #424242;
}

.confirmOrder .content .section-goods .goods-list li img {
  float: left;
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.confirmOrder .content .section-goods .goods-list li .pro-name {
  float: left;
  width: 650px;
  line-height: 30px;
}

.confirmOrder .content .section-goods .goods-list li .pro-price {
  float: left;
  width: 150px;
  line-height: 30px;
  text-align: center;
}

.confirmOrder .content .section-goods .goods-list li .pro-status {
  float: left;
  width: 99px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.confirmOrder .content .section-goods .goods-list li .pro-total {
  float: left;
  width: 190px;
  line-height: 30px;
  text-align: center;
  color: #ff6700;
}

/* 配送方式 */
.confirmOrder .content .section-shipment {
  overflow: hidden;
  padding: 25px 0;
  margin: 0 48px;
  border-bottom: 1px solid #e0e0e0;
}

.confirmOrder .content .section-shipment .title {
  float: left;
  width: 150px;
  line-height: 38px;
  font-size: 18px;
  color: #333;
}

.confirmOrder .content .section-shipment .shipment {
  float: left;
  line-height: 38px;
  font-size: 14px;
  color: #ff6700;
}

/* 发票 */
.confirmOrder .content .section-invoice {
  overflow: hidden;
  padding: 25px 0;
  margin: 0 48px;
  border-bottom: 1px solid #e0e0e0;
}

.confirmOrder .content .section-invoice .title {
  float: left;
  width: 150px;
  line-height: 38px;
  font-size: 18px;
  color: #ff6700;
}

.confirmOrder .content .section-invoice .invoice {
  float: left;
  margin-right: 20px;
  line-height: 38px;
  font-size: 14px;
  color: #ff6700;
}

/* 结算列表 */
.confirmOrder .content .section-count {
  margin: 0 48px;
  padding: 20px 0;
  overflow: hidden;
}
.confirmOrder .content .section-count .money-box {
  float: right;
  text-align: right;
}
.confirmOrder .content .section-count .money-box .title {
  float: left;
  width: 126px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #757575;
}
.confirmOrder .content .section-count .money-box .value {
  float: left;
  min-width: 105px;
  height: 30px;
  display: block;
  line-height: 30px;
  color: #ff6700;
}
.confirmOrder .content .section-count .money-box .total .title {
  padding-top: 15px;
}
.confirmOrder .content .section-count .money-box .total .value {
  padding-top: 10px;
}
.confirmOrder .content .section-count .money-box .total-price {
  font-size: 30px;
}

/* 结算导航CSS */
.confirmOrder .content .section-bar {
  padding: 20px 48px;
  border-top: 2px solid #f5f5f5;
  overflow: hidden;
}
.confirmOrder .content .section-bar .btn {
  float: right;
}
.confirmOrder .content .section-bar .btn .btn-base {
  float: left;
  margin-left: 30px;
  width: 158px;
  height: 38px;
  border: 1px solid #b0b0b0;
  font-size: 14px;
  line-height: 38px;
  text-align: center;
}
.confirmOrder .content .section-bar .btn .btn-return {
  color: rgba(0, 0, 0, 0.27);
  border-color: rgba(0, 0, 0, 0.27);
}
.confirmOrder .content .section-bar .btn .btn-primary {
  background: #ff6700;
  border-color: #ff6700;
  color: #fff;
}
</style>