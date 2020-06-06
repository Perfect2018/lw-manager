<template>
  <el-container>
    <el-header>
      <Header>>&nbsp;客户列表</Header>
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
                <el-form-item label="名称">
                  <el-input size="medium" v-model="searchFrom.name" placeholder="请输入名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号">
                  <el-input size="medium" v-model="searchFrom.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否认证">
                  <el-select v-model="searchFrom.isAuth">
                    <el-option label="全部" value></el-option>
                    <el-option label="已认证" value="01"></el-option>
                    <el-option label="未认证" value="00"></el-option>
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
          <!-- <el-row>
            <el-col :span="8">
              <el-radio-group v-model="listType" style>
                <el-radio-button label="00">全部</el-radio-button>
                <el-radio-button label="01">黑名单</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>-->
        </div>
      </el-card>

      <!-- 列表数据展示 -->
      <el-card class="box">
        <el-table :data="data" :height="clientHeight-415" border>
          <el-table-column show-overflow-tooltip label="编号" prop="id"></el-table-column>
          <el-table-column show-overflow-tooltip label="客户名称" prop="username"></el-table-column>
          <el-table-column show-overflow-tooltip label="性别" prop="sex" :formatter="sexFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="联系方式" prop="phone"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="注册日期"
            prop="createDate"
            :formatter="timeFmt"
          ></el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="下单量" prop="orderCount"></el-table-column> -->
          <el-table-column show-overflow width="300px" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleBanned(scope.$index, scope.row)"
                v-if="scope.row.state=='00'"
              >禁言</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleBanned(scope.$index, scope.row)"
                v-if="scope.row.state!='00'"
              >已禁言</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleDelete(scope.$index, scope.row)"
              >删除该用户发帖</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <el-pagination
            hide-on-single-page
            background
            :current-page="currentPage"
            @current-change="handlePageChange"
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </el-card>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>

<script>
import Header from "../../components/header";
import Footer from "../../components/footer";
import api from "../../config/api";

export default {
  name: "getCustList",
  components: {
    Footer,
    Header
  },
  props: ["clientHeight"],
  data() {
    return {
      //搜索表单
      searchFrom: {
        name: "",
        phone: "",
        isAuth: ""
      },
      //查询条件
      listType: "00",
      userListType: "00",
      //列表数据
      data: [],
      showUser: {},
      total: 1,
      currentPage: 1,
      showFormVisible: false
    };
  },
  created() {
    // this.handleSearch();
    this.handlePageChange();
  },
  methods: {
    // 禁言
    handleBanned(index, row) {
      console.log(row);
      api
        ._post("/lw-manager/cust/updateState", {
          state: row.state,
          id: row.id
        })
        .then(res => {
          if (res.success) {
            if (row.state == "00") {
              this.data[index].state = "99";
              this.$message.success("禁言成功");
            } else {
              this.data[index].state = "00";
              this.$message.success("取消禁言成功");
            }
          } else {
            this.$message.error("操作失败");
          }
          // console.log(res)
        });
    },
    handleSearch() {
      var phone = this.searchFrom.phone;
      var username = this.searchFrom.name;
      var isAuth = this.searchFrom.isAuth;
      //   var pageNum = this.currentPage;
      api
        ._post("/lw-manager/cust/getCustList", {
          phone,
          username,
          isAuth,
          pageNum: this.currentPage
        })
        .then(res => {
          console.log(res);
          if (res.success) {
            this.data = res.data;
            if (res.data.length == 0) {
              this.$message.success("暂无数据");
            }
          }
        });
    },

    handlePageChange(currentPage = this.currentPage) {
      this.currentPage = currentPage;
      this.handleSearch();
    },

    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            ._post("/lw-manager/cust/deleteCustMessage", {
              custId: row.id
            })
            .then(res => {
              if (res.success) {
                // this.data.splice(index, 1);
                //console.log("handleDelete", index, row)
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    timeFmt(row) {
      return new Date(row.createDate).toLocaleDateString().replace(/\//g, "-");
    },
    sexFmt(row) {
      return row.sex == 1 ? "男" : "女";
    }
  }
};
</script>

<style lang="scss" scoped>
.showMain {
  padding: 10px;
  background-color: #e6e6e6;

  .el-radio-group {
    margin-left: 100px;
    width: 100%;
  }

  .box {
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .search-btn {
    width: 30%;
  }

  .el-form-item {
    margin: 10px 0;
  }

  .show-user {
    .user-detail {
      border-right: 1px solid #ddd;

      .user-img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 25px;
      }

      .el-form-item {
        margin: 5px 0;
      }
    }

    .user-type {
      margin-bottom: 20px;
    }
  }
}
</style>
