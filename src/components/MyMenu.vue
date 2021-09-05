<template>
  <!-- 商品展示模块右上角菜单组件 -->
  <div class="myMenu" id="myMenu">
    <ul>
      <li
        v-for="item in val"
        :key="item.id"
        :class="activeClass == item ? 'active' : ''"
        @mouseover="mouseover(item)"
      >
        <router-link to>
          <slot :name="item"></slot>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "MyMenu",
  props: ["val"],
  data() {
    return {
      activeClass: 1,
    };
  },
  watch: {
    // 向父组件传过去当前要显示的商品分类，从而更新商品列表
    activeClass: function (val) {
      this.$emit("fromChild", val);
    },
  },
  methods: {
    // 通过mouseover事件控制当前显示的商品分类
    mouseover(val) {
      this.activeClass = val;
    },
  },
};
</script>

<style>
#myMenu li {
  float: left;
  margin-left: 30px;
}

#myMenu a:hover {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}

#myMenu .active a {
  color: #ff6700;
  border-bottom: 2px solid #ff6700;
}
</style>