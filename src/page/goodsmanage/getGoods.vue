<template>
  <el-container>
    <el-header>
      <Header>>&nbsp;商品列表</Header>
    </el-header>
    <el-main class="showMain">
      <!-- 条件查询 -->
      <el-card class="box">
        <div slot="header">
          <span>条件查询</span>
        </div>
        <div class="from-item">
          <el-form :model="searchFrom" ref="search" label-width="100px" label-suffix>
            <el-row>
              <el-col :span="8">
                <el-form-item label="商铺名称">
                  <el-input size="medium" v-model="searchFrom.shopName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类型">
                  <el-select v-model="searchFrom.isGlobalGoods">
                    <el-option label="全部" value></el-option>
                    <el-option label="全球甄选" value="01"></el-option>
                    <el-option label="即时送" value="02"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="强制下架">
                  <el-select v-model="searchFrom.isLowerGoods">
                    <el-option label="全部" value="00"></el-option>
                    <el-option label="否" value="01"></el-option>
                    <el-option label="是" value="02"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">
                  <el-select v-model="searchFrom.state">
                    <el-option label="全部" value></el-option>
                    <el-option label="有效" value="00"></el-option>
                    <el-option label="无效" value="99"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label>
                  <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 列表数据展示 -->
      <el-card class="box">
        <el-table :data="data" :height="clientHeight-415" border>
          <el-table-column show-overflow-tooltip label="商品名称" prop="goodsName"></el-table-column>
          <el-table-column show-overflow-tooltip label="商铺名称" prop="shopName"></el-table-column>
          <el-table-column show-overflow-tooltip label="商品价格" prop="couponRate"></el-table-column>
          <el-table-column show-overflow-tooltip label="是否有效" prop="state" :formatter="stateFmt"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="商品类型"
            prop="isGlobalGoods"
            :formatter="isGlobalGoodsFmt"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="强制下架">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.isLowerGoods=='01'"
                @click="setLowerGoods(scope.$index, scope.row)"
              >强制下架</el-button>
              <el-button size="mini" type="info" disabled v-else>已强制下架</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="时令果蔬">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.isSeason=='02'"
                @click="setSeason(scope.$index, scope.row)"
              >时令果蔬</el-button>
              <el-button
                size="mini"
                type="warning"
                v-else
                @click="setSeason(scope.$index, scope.row)"
              >取消时令</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="特价折扣">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.isSpecialOffer=='02'"
                @click="setSpecialOffer(scope.$index, scope.row)"
              >特价折扣</el-button>
              <el-button
                size="mini"
                type="warning"
                v-else
                @click="setSpecialOffer(scope.$index, scope.row)"
              >取消特价</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="新品推荐">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.isNewProducts=='02'"
                @click="setNewProducts(scope.$index, scope.row)"
              >新品推荐</el-button>
              <el-button
                size="mini"
                type="warning"
                v-else
                @click="setNewProducts(scope.$index, scope.row)"
              >取消新品</el-button>
            </template>
          </el-table-column>
          <el-table-column show-overflow label="趣抢购">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.goodsTypes=='00'"
                @click="setGoodsTypes(scope.$index, scope.row)"
              >趣抢购</el-button>
              <el-button
                size="mini"
                type="warning"
                v-else
                @click="setGoodsTypes(scope.$index, scope.row)"
              >取消抢购</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          hide-on-single-page
          background
          :current-page="currentPage"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </el-card>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>
<script>
import Header from "../../components/header";
import Footer from "../../components/footer";
import { getGoodsList } from "../../api/goodsmanage/getgoods";
import { updatagoods } from "../../api/goodsmanage/getgoods";

export default {
  name: "getGoods",
  components: { Footer, Header },
  props: ["clientHeight"],
  data() {
    return {
      searchFrom: {
        shopName: "",
        isGlobalGoods: "",
        isLowerGoods: "01",
        state: "00"
      },
      data: [],
      currentPage: 1,
      total: 1
    };
  },
  created() {
    this.handlePageChange();
  },
  methods: {
    handleSearch() {
      this.handlePageChange();
    },
    //分页改变执行的方法
    handlePageChange(currentPage = this.currentPage) {
      this.currentPage = currentPage;
      getGoodsList(
        currentPage,
        this.searchFrom.shopName,
        this.searchFrom.isGlobalGoods,
        this.searchFrom.isLowerGoods,
        this.searchFrom.state
      ).then(res => {
        this.data = res.data.list;
        this.total = res.data.total;
      });
    },
    //强制下架
    setLowerGoods(index, row) {
      let temp = Object.assign({}, row);
      if (row.isLowerGoods == "01") {
        updatagoods(row.id, "3", "").then(res => {
          if (res.success) {
            temp.isLowerGoods = "03";
            this.data.splice(index, 1, temp);
            this.$message.success("下架成功");
          } else {
            this.$message.error(res.error.msg);
          }
        });
      } else if (row.isLowerGoods == "03") {
        this.$message.warning("该商品已下架");
      }
    },
    //设置时令蔬果
    setSeason(index, row) {
      let temp = Object.assign({}, row);
      if (row.isSeason == "01") {
        temp.isSeason = "02";
        this.data.splice(index, 1, temp);
        this.$message.success("取消成功");
      } else if (row.isSeason == "02") {
        temp.isSeason = "01";
        this.data.splice(index, 1, temp);
        this.$message.success("设置成功");
      }
    },
    //设置特价折扣
    setSpecialOffer(index, row) {
      //console.log(index, row);
      let temp = Object.assign({}, row);
      if (row.isSpecialOffer == "01") {
        temp.isSpecialOffer = "02";
        this.data.splice(index, 1, temp);
        this.$message.success("取消成功");
      } else if (row.isSpecialOffer == "02") {
        temp.isSpecialOffer = "01";
        this.data.splice(index, 1, temp);
        this.$message.success("设置成功");
      }
    },
    //设置新品推荐
    setNewProducts(index, row) {
      let temp = Object.assign({}, row);
      if (row.isNewProducts == "01") {
        temp.isNewProducts = "02";
        this.data.splice(index, 1, temp);
        this.$message.success("取消成功");
      } else if (row.isNewProducts == "02") {
        temp.isNewProducts = "01";
        this.data.splice(index, 1, temp);
        this.$message.success("设置成功");
      }
    },
    //设置趣抢购
    setGoodsTypes(index, row) {
      let temp = Object.assign({}, row);
      if (row.goodsTypes == "01") {
        updatagoods(row.id, "10", row.isGlobalGoods).then(res => {
          if (res.success) {
            temp.goodsTypes = "00";
            this.data.splice(index, 1, temp);
            this.$message.success("取消成功");
          } else {
            this.$message.error(res.error.msg);
          }
        });
      } else if (row.goodsTypes == "00") {
        updatagoods(row.id, "11", row.isGlobalGoods).then(res => {
          if (res.success) {
            temp.goodsTypes = "01";
            this.data.splice(index, 1, temp);
            this.$message.success("设置成功");
          } else {
            this.$message.error(res.error.msg);
          }
        });
      }
    },

    isGlobalGoodsFmt(row) {
      return row.isGlobalGoods == "01" ? "全球甄选" : "即时送";
    },
    stateFmt(row) {
      return row.state == "00" ? "有效商品" : "无效商品";
    }
  }
};
</script>
<style lang="scss" scoped>
.showMain {
  padding: 10px;
  background-color: #e6e6e6;

  .box {
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .search-btn {
    width: 30%;
  }

  .add-audit-btn {
    width: 45%;
  }

  .el-form-item {
    margin: 10px 0;
  }
}
</style>
