<template>

  <el-container>
    <el-header>
      <Header>
        >&nbsp;商品审核
      </Header>
    </el-header>
    <el-main class="showMain">
      <!-- 条件查询 -->
      <el-card class="box">
        <div slot="header">
          <span>条件查询</span>
        </div>
        <div class="from-item">
          <el-form :model="searchFrom" ref="search" label-width="100px" label-suffix="">
            <el-row>
              <el-col :span="8">
                <el-form-item label="商铺名称">
                  <el-input size="medium" v-model="searchFrom.shopName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品名称">
                  <el-input size="medium" v-model="searchFrom.goodsName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类型">
                  <el-select v-model="searchFrom.isGlobalGoods">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="全球甄选" value="01"></el-option>
                    <el-option label="即时送" value="02"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品类型">
                  <el-select v-model="searchFrom.isRecommendGoods">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="已通过" value="02"></el-option>
                    <el-option label="待审批" value="03"></el-option>
                    <el-option label="驳回" value="04"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="">
                  <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <!-- 列表数据展示 -->
      <el-card class="box">
        <el-table
          :data="data"
          :height="clientHeight-435"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="商铺名称" prop="shopName"></el-table-column>
          <el-table-column show-overflow-tooltip label="商品名称" prop="goodsName"></el-table-column>
          <el-table-column show-overflow-tooltip label="商品类别" prop="isGlobalGoods"
                           :formatter="globalGoodsFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="价格(原价/平台价)">
            <template slot-scope="scope">
              <span>{{scope.row.price}}</span>/<span class="text-red">{{scope.row.couponRate}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="折扣" prop="discount"></el-table-column>
          <el-table-column show-overflow-tooltip label="折后价" prop="discountPrice"></el-table-column>
          <el-table-column show-overflow-tooltip label="商品单位">
            <template slot-scope="scope">
              <span>{{scope.row.noeUnit}}</span>/<span class="text-red">{{scope.row.twoNuit}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow label="审核状态">
            <template slot-scope="scope">
              <span v-if="scope.row.isRecommendGoods == '02'" class="text-green">通过</span>
              <span v-if="scope.row.isRecommendGoods == '03'" class="text-blue">申请中</span>
              <span v-if="scope.row.isRecommendGoods == '04'" class="text-red">驳回</span>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="page-bottom">
          <el-col :span="12">
            <el-pagination
              hide-on-single-page
              background
              :current-page="currentPage"
              @current-change="handlePageChange"
              layout="prev, pager, next"
              :total="total">
            </el-pagination>
          </el-col>
          <el-col :span="12">
            <el-form :inline="true">
              <el-form-item label="驳回理由">
                <el-input size="mini" v-model="reason" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="warning" @click="reject">驳回</el-button>
                <el-button size="mini" type="success" @click="pass">通过</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>
<script>

    import Header from '../../components/header'
    import {searchItem, pass, selected} from '../../api/goodsmanage/review'
    import Footer from "../../components/footer";


    export default {
        name: 'review',
        props: ['clientHeight'],
        components: {
            Footer,
            Header,
        },
        data() {
            return {
                searchFrom: {
                    shopName: '',
                    goodsName: '',
                    isGlobalGoods: '01',
                    isRecommendGoods: '03',
                },
                data: [],
                selectData: [],
                //理由
                reason: '',
                currentPage: 1,
                total: 1
            }
        },
        created() {
            this.handlePageChange();
        },
        methods: {
            handleSearch() {
                this.handlePageChange();
            },
            handlePageChange() {
                let shopName = this.searchFrom.shopName;
                let goodsName = this.searchFrom.goodsName;
                let isGlobalGoods = this.searchFrom.isGlobalGoods;
                let isRecommendGoods = this.searchFrom.isRecommendGoods;
                searchItem(shopName, goodsName, isGlobalGoods, isRecommendGoods).then(res => {
                    this.data = res.data;
                });
            },
            //选中或取消选中事件
            handleSelectionChange(val) {
                this.selectData = val;
            },
            reject() {

                if (this.selectData.length < 1) {
                    this.$message.warning('请选择要驳回的商品');
                    return false;
                }
                if (this.reason == "") {
                    this.$message.warning('请输入驳回的理由');
                    return false;
                }
                let temp = this.selectData.map(elem => {
                    return elem.id
                });
                temp = temp.join(",");
                selected(temp, this.reason).then(res => {
                    if (res.success) {
                        this.$message.success('已驳回');
                        this.handlePageChange();
                    }
                })


            },
            pass() {
                if (this.selectData.length < 1) {
                    this.$message.warning('请选中需要操作的数据');
                    return false;
                }
                let temp = this.selectData.map(elem => {
                    return elem.id
                });
                temp = temp.join(",");
                pass(temp).then(res => {
                    if (res.success) {
                        this.$message.success('已通过');
                        this.handlePageChange();
                    }
                });

            },
            globalGoodsFmt(row) {
                return row.isGlobalGoods == '02' ? '即时送' : '全球甄选';
            }
        }
    }
</script>
<style lang="scss" scoped>
  .showMain {
    padding: 10px;
    background-color: #E6E6E6;

    .box {
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .search-btn {
      width: 30%;
    }

    .add-category-btn {
      width: 45%;
    }

    .el-form-item {
      margin: 10px 0;
    }

    .text-blue {
      color: #409EFF;
    }

    .text-red {
      color: #F56C6C;
    }

    .text-green {
      color: #67C23A;
    }

    .page-bottom {
      margin-top: 10px;

      .el-form-item {
        margin: 0;
      }
    }

    .el-dialog {
      min-width: 600px;

      .dialog-input {
        margin: 20px auto;
      }
    }
  }
</style>

