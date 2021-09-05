<template>
  <div class="goods" id="goods">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>全部商品</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">搜索</el-breadcrumb-item>
        <el-breadcrumb-item v-else>分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="search">{{ search }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 分类标签 -->
    <div class="nav">
      <div class="product-nav">
        <div class="title">分类</div>
        <el-tabs type="card" v-model="activeName">
          <el-tab-pane
            v-for="item in categoryList"
            :key="item.category_id"
            :label="item.category_name"
            :name="'' + item.category_id"
          ></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="main">
      <div class="list">
        <MyList :list="product" v-if="product.length > 0"></MyList>
        <div v-else class="none-product">
          抱歉没有找到相关的商品，请看看其他的商品
        </div>
      </div>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="pageSize"
          :total="total"
          @current-change="currentChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Goods",
  data() {
    return {
      categoryList: [], // 分类列表
      categoryID: [], // 分类id
      product: [], // 商品列表
      total: 0, // 商品总量
      pageSize: 15, // 每页显示的商品数量
      currentPage: 1, // 当前页码
      activeName: "-1", // 分类列表当前选中的id
      search: "", // 搜索条件
    };
  },
  created() {
    this.getCategory();
  },
  activated() {
    // 初始化分类列表当前选中的id，商品总量和当前页码
    this.activeName = "-1";
    this.total = 0;
    this.currentPage = 1;
    // 如果路由没有传递参数，默认为显示全部商品
    if (Object.keys(this.$route.query).length == 0) {
      this.categoryID = [];
      this.activeName = "0";
      return;
    }
    // 如果路由传递了分类id(点击浏览更多时)，则显示对应的分类商品
    if (this.$route.query.categoryID != undefined) {
      this.categoryID = this.$route.query.categoryID;
      // 如果选中的是同一类商品，则修改分类列表当前选中的id
      if (this.categoryID.length == 1) {
        this.activeName = "" + this.categoryID[0];
      }
      return;
    }
    // 如果路由传递了search，则为搜索，显示对应的分类商品
    if (this.$route.query.search != undefined) {
      this.search = this.$route.query.search;
    }
  },
  watch: {
    // 监听点击了哪个分类标签，通过修改分类id，响应相应的商品
    activeName(val) {
      if (val == 0) {
        this.categoryID = [];
      }
      if (val > 0) {
        this.categoryID = [Number(val)];
      }
      // 初始化商品总量和当前页码
      this.total = 0;
      this.currentPage = 1;
      // 更新地址栏链接，方便刷新页面可以回到原来的页面
      this.$router.push({
        path: "/goods",
        query: { categoryID: this.categoryID },
      });
    },
    // 监听分类id，响应相应的商品
    categoryID() {
      this.getData();
      this.search = "";
    },
    // 监听搜索事件，响应相应的商品
    search(val) {
      if (val != "") {
        this.getProductBySearch(val);
      }
    },
    // 监听路由变化，更新路由传递搜索条件
    $route(val) {
      if (val.path == "/goods") {
        if (val.query.search != undefined) {
          this.activeName = "-1";
          this.currentPage = 1;
          this.total = 0;
          this.search = val.query.search;
        }
      }
    },
  },
  methods: {
    // 请求分类列表数据
    getCategory() {
      this.$axios
        .post("/api/product/getCategory", {})
        .then((res) => {
          const val = {
            category_id: 0,
            category_name: "全部",
          };
          res.data.category.unshift(val);
          this.categoryList = res.data.category;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    // 请求全部商品数据，或者请求分类商品数据
    getData() {
      const api =
        this.categoryID.length == 0
          ? "/api/product/getAllProduct"
          : "/api/product/getProductByCategory";
      this.$axios
        .post(api, {
          categoryID: this.categoryID,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.product = res.data.Product;
          this.total = res.data.total;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    // 通过搜索条件请求商品数据
    getProductBySearch() {
      this.$axios
        .post("/api/product/getProductBySearch", {
          search: this.search,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.product = res.data.Product;
          this.total = res.data.total;
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    },
    // 页码变化调用currentchange事件
    currentChange(currentPage) {
      this.currentPage = currentPage;
      // if (this.search != "") {
      //   this.getProductBySearch();
      // } else {
      this.getData();
      // }
    },
  },
};
</script>

<style scoped>
.goods {
  background-color: #f5f5f5;
}

/* 面包屑导航 */
.goods .breadcrumb {
  height: 50px;
  background-color: white;
}

.goods .breadcrumb .el-breadcrumb {
  width: 1225px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 30px;
}

/* 分类列表 */
.goods .nav {
  background-color: #fff;
}

.goods .nav .product-nav {
  width: 1225px;
  height: 40px;
  margin: 0 auto;
  line-height: 40px;
}

.nav .product-nav .title {
  float: left;
  width: 50px;
  font-size: 16px;
  font-weight: 700;
}

/* 主要内容 */
.goods .main {
  max-width: 1225px;
  margin: 0 auto;
}

.goods .main .list {
  overflow: auto;
  min-height: 650px;
  padding-top: 14.5px;
  margin-left: -13.7px;
}

.goods .main .pagination {
  height: 50px;
  text-align: center;
}

.goods .main .none-product {
  margin-left: 13.7px;
  color: #333;
}
</style>