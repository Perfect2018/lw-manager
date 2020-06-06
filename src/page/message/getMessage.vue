<template>
  <el-container>
    <el-header>
      <Header>>&nbsp;意见列表</Header>
    </el-header>
    <el-main class="showMain">
      <!-- 条件查询 -->
      <el-card class="box">
        <div slot="header">
          <span>条件查询</span>
        </div>
        <div class="from-item">
          <el-form :model="searchForm" ref="search" label-width="100px" label-suffix>
            <el-row>
              <el-col :span="8">
                <el-form-item label="消息标题">
                  <el-input size="medium" v-model="searchForm.titleName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="消息类型">
                  <el-select v-model="searchForm.classType">
                    <el-option label="全部" value></el-option>
                    <el-option label="信息" value="01"></el-option>
                    <el-option label="资讯" value="02"></el-option>
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
        <el-table :data="list" :height="clientHeight-355" border>
          <!-- <el-table-column show-overflow-tooltip label="发布者姓名" prop="name"></el-table-column> -->
          <el-table-column show-overflow-tooltip label="消息标题" prop="titleName"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="发布时间"
            prop="submitDate"
            :formatter="timeFmt"
          ></el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="采纳结果" prop="result"
          :formatter="stateFmt"></el-table-column>-->
          <el-table-column show-overflow-tooltip label="发布内容" prop="describle"></el-table-column>
          <!-- <el-table-column
            show-overflow-tooltip
            label="创建时间"
            prop="createDate"
            :formatter="timeFmt"
          ></el-table-column>-->
          <el-table-column width="300px" label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleStick(scope.$index, scope.row)"
                v-if="scope.row.istop=='0'"
              >置顶</el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleStick(scope.$index, scope.row)"
                v-if="scope.row.istop!='0'"
              >已置顶</el-button>
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
  name: "getMessage",
  components: {
    Header,
    Footer
  },
  props: ["clientHeight"],
  data() {
    return {
      //搜索表单
      searchForm: {
        titleName: "",
        classType: "",
        result: "00"
      },
      //列表数据
      data: [
        {
          name: "name",
          opinionContent: "opinionContent",
          submitDate: "submitDate",
          result: "result",
          huifuneirong: "huifuneirong",
          createDate: "createDate",
          state: "01"
        }
      ],
      list: [],
      total: 1,
      currentPage: 1,
      formLabelWidth: "150px"
    };
  },
  //   created() {
  //     this.handlePageChange();
  //   },
  created() {
    // this.handleSearch();
    this.handlePageChange()
  },
  methods: {
    //执行搜索
    handleSearch() {
      var titleName = this.searchForm.titleName;
      var typeClass = this.searchForm.classType;
    //   var pageNum = this.currentPage;
      //   console.log(typeof this.searchForm.titleName);
      //   console.log(this.searchForm.classType);
      api
        ._post("/lw-manager/message/getMessageList", {
          titleName,
          typeClass,
          pageNum:this.currentPage
        })
        .then(res => {
          if (res.success) {
            this.list = res.data;
            if(res.data.length==0){
              this.$message.success("暂无数据")
            }
          }else{
            this.$message.warn("获取失败")
          }
        });
      //   this.handlePageChange();
    },
    //分页
    handlePageChange(currentPage = this.currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage);
      this.handleSearch();
    },
    //删除
    handleDelete(index, row) {
      api
        ._post("/lw-manager/message/deleteMessage", {
          messageId: row.id
        })
        .then(res => {
          if (res.success) {
            console.log(res);
            this.list.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功"
            });
          } else {
            this.$message({
              type: "warning",
              message: "删除失败"
            });
          }
        });
      //   console.log(row);
    },
    // 置顶
    handleStick(index, row) {
      console.log(index);
      api
        ._post("/lw-manager/message/upTopMessage", {
          istop: row.istop,
          messageId: row.id
        })
        .then(res => {
          if (res.success) {
            if (row.istop == 0) {
              this.list[index].istop=1
              this.list.unshift(this.list.splice(index, 1)[0]);
              this.$message.success("置顶成功")
            }else{
                // this.list[index].istop=0
            //   this.list.unshift(this.list.splice(index, 1)[0]);
              this.handleSearch()
              this.$message.success("取消置顶成功")
            }
          }else{
            this.$message.error("操作失败")
          }
        });
    },
    // 禁言
    handleBanned(index, row) {
      console.log(row);
      api
        ._post("/lw-manager/cust/updateState", {
          state: row.state,
          id: row.custId
        })
        .then(res => {
            if(res.success){
                this.$message.success('禁言成功')
            }
        //   if (res.success) {
        //     if (row.state == "00") {
        //       this.list[index].state = "99";
        //       this.$message.success("禁言成功");
        //     } else {
        //       this.list[index].state = "00";
        //       this.$message.success("取消禁言成功");
        //     }
        //   } else {
        //     this.$message.error("操作失败");
        //   }
          // console.log(res)
        });
    },
    //时间格式化(创建时间)
    timeFmt(row) {
      return new Date(row.createDate).toLocaleDateString().replace(/\//g, "-");
    },
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
