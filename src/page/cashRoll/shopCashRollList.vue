<template>
  <el-container>
    <el-header>
      <Header>
        >&nbsp;商户现金券
      </Header>
    </el-header>
    <el-main class="showMain">
      <!-- 条件查询 -->
      <el-card class="box">
        <div slot="header">
          <span>条件查询</span>
        </div>
        <div class="from-item">
          <el-form :model="searchForm" ref="search" label-width="100px" label-suffix="">
            <el-row>
              <el-col :span="8">
                <el-form-item label="手机号">
                  <el-input size="medium" v-model="searchForm.phone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">
                  <el-select v-model="searchForm.state">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="未领取" value="00"></el-option>
                    <el-option label="已领取" value="99"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="">
                  <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                  <el-button class="add-red-packet-btn" type="success" @click="addFormVisible = true">
                    新增券
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
      <!-- 列表数据展示 -->
      <el-card class="box">
        <el-table :data="data" :height="clientHeight-355" border>
          <el-table-column show-overflow-tooltip label="发券商户" prop="shopName"></el-table-column>
          <el-table-column show-overflow-tooltip label="领取人电话" prop="phoneNumber"></el-table-column>
          <el-table-column show-overflow-tooltip label="商户券总金额" prop="totalMoney"></el-table-column>
          <el-table-column show-overflow-tooltip label="领取时间" prop="receiveDate"
                           :formatter="isReceiveDateFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="创建时间" prop="createDate"
                           :formatter="isCreateDateFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="状态" prop="state"
                           :formatter="stateFmt"></el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            hide-on-single-page
            background
            :current-page="currentPage"
            @current-change="handlePageChange"
            layout="prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <!-- 添加数据 -->
      <el-dialog title="新增券" :visible.sync="addFormVisible" class="dialog-form">
        <el-form :model="addTicketFrom">
          <el-form-item label="发放商户" :label-width="formLabelWidth" class="dialog-input">
            <el-autocomplete
              class="w-input" v-model="addTicketFrom.shopName"
              value-key="shopName"
              :fetch-suggestions="querySearchTicket"
              placeholder="请输入内容"
              @select="handleSelectTicket"></el-autocomplete>
          </el-form-item>
          <el-form-item label="单个券金额" :label-width="formLabelWidth" class="dialog-input">
            <el-input class="w-input" v-model="addTicketFrom.money" placeholder="单位: ( 元 )"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" class="dialog-input">
            <el-input class="w-input" v-model="addTicketFrom.phone" placeholder="请输入11位手机号"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddTicket">确 定</el-button>
        </div>
      </el-dialog>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>

<script>
    import Header from "../../components/header";
    import Footer from "../../components/footer";
    import ShopCashRollList from "../../api/cashRoll/shopCashRollList.js";
    import Validate from "../../api/tools/validateTools.js";

    export default {
        name: "getTicket",
        components: {
            Header,
            Footer
        },
        props: ['clientHeight'],
        data() {
            return {
                //搜索表单
                searchForm: {
                    phone: '',
                    state: '',
                },
                //添加表单
                addTicketFrom: {
                    shopId: "",
                    shopName: "",
                    money: "",
                    phone: ""
                },
                //商铺列表
                shopList: [],
                //列表数据
                data: [],
                addFormVisible: false,
                total: 1,
                currentPage: 1,
                formLabelWidth: '150px'
            }
        },
        created() {
            this.handlePageChange();
            this.handleShopList();
        },
        methods: {
            //远程搜索(获取数据)
            querySearchTicket(queryString, cb) {
                if (this.shopList) {
                    let shopList = this.shopList;
                    shopList = queryString ? shopList.filter(state => {
                        return (state.shopName.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                    }) : shopList;
                    cb(shopList);
                }
            },
            //远程搜索(商铺选中)
            handleSelectTicket(item) {
                this.addTicketFrom.shopName = item.shopName;
                this.addTicketFrom.shopId = item.id;
            },
            //执行搜索
            handleSearch() {
                let phone = this.searchForm.phone;
                if (phone) {
                    if (!Validate.validatePhone(phone)) {
                        this.$message.warning("手机号格式不正确");
                        return;
                    }
                }
                this.handlePageChange();
            },
            //新增保存
            handleAddTicket() {
                let phone = this.addTicketFrom.phone;
                let money = this.addTicketFrom.money;
                if (!Validate.validateNumber(money)) {
                    this.$message.warning("金额格式不正确");
                    return;
                }
                if (!Validate.validatePhone(phone)) {
                    this.$message.warning("手机号格式不正确");
                    return;
                }
                this.addFormVisible = false;
                ShopCashRollList.addTicket(this.addTicketFrom.shopId, this.addTicketFrom.shopName, phone, money).then(res => {
                    this.addTicketFrom.phone = "";
                    this.$message.success("保存成功");
                    this.handlePageChange();
                });
            },
            //分页
            handlePageChange(currentPage = this.currentPage) {
                this.currentPage = currentPage;
                ShopCashRollList.searchItemList(currentPage, this.searchForm.phone, this.searchForm.state).then(res => {
                    if (res.success) {
                        this.data = res.data.list;
                    }
                });
            },
            //获取商铺
            handleShopList() {
                ShopCashRollList.getShopList().then(res => {
                    this.shopList = res.data;
                });
            },
            //时间格式化(创建时间)
            isCreateDateFmt(row) {
                return new Date(row.createDate).toLocaleDateString().replace(/\//g, "-")
            },
            //时间格式化(领取时间)
            isReceiveDateFmt(row) {
                return row.receiveDate == null ? "未领取" : new Date(row.receiveDate).toLocaleDateString().replace(/\//g, "-")
            },
            //状态格式化
            stateFmt(row) {
                return row.state == '00' ? '未领取' : '已领取';
            }
        }
    }
</script>

<style lang="scss" scoped>
  .showMain {
    padding: 10px;
    background-color: #E6E6E6;

    .w-input {
      width: 300px;
    }

    .box {
      border-radius: 8px;
      margin-bottom: 10px;
    }

    .search-btn {
      width: 30%;
    }

    .add-red-packet-btn {
      width: 45%;
    }

    .el-form-item {
      margin: 10px 0;
    }
  }
</style>
