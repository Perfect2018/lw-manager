<template>
  <el-container>
    <el-header>
      <Header>>&nbsp;广告管理</Header>
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
                <el-form-item label="广告名称">
                  <el-input size="medium" v-model="searchForm.putinShopName" placeholder="请输入广告名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="广告类型">
                  <el-select v-model="searchForm.advertType">
                    <el-option label="全部" value="00"></el-option>
                    <el-option label="自营广告" value="01"></el-option>
                    <el-option label="商家广告" value="02"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="内容类型">
                  <el-select v-model="searchForm.advertContentType">
                    <el-option label="全部" value="00"></el-option>
                    <el-option label="图片类型" value="01"></el-option>
                    <el-option label="文字类型" value="02"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="审核状态">
                  <el-select v-model="searchForm.auditState">
                    <el-option label="全部" value="00"></el-option>
                    <el-option label="待审核" value="01"></el-option>
                    <el-option label="审核中" value="02"></el-option>
                    <el-option label="已经通过" value="03"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="广告状态">
                  <el-select v-model="searchForm.state">
                    <el-option label="正在使用的" value="00"></el-option>
                    <el-option label="已经下架的" value="99"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label>
                  <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                  <el-button
                    class="add-audit-btn"
                    type="success"
                    @click="addFormVisible = true"
                  >广告发布</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 列表数据展示 -->
      <el-card class="box">
        <el-table :data="data" :height="clientHeight-385" border>
          <el-table-column show-overflow-tooltip label="商家名称" prop="putinShopName"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="广告类型"
            prop="advertType"
            :formatter="advertTypeFmt"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="内容类型"
            prop="advertContentType"
            :formatter="advertContentTypeFmt"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="连接地址" prop="forwordAddress"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="审核状态"
            prop="knightTel"
            :formatter="auditStateFmt"
          ></el-table-column>
          <!--          <el-table-column show-overflow-tooltip label="流量入口经度" prop="flowInLong"></el-table-column>-->
          <!--          <el-table-column show-overflow-tooltip label="流量入口纬度" prop="flowInLat"></el-table-column>-->
          <el-table-column
            show-overflow-tooltip
            label="创建时间"
            prop="createDate"
            :formatter="timeFmt"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="状态" prop="state" :formatter="stateFmt"></el-table-column>
          <el-table-column show-overflow width="150px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 添加数据 -->
      <el-dialog title="广告添加" :visible.sync="addFormVisible" class="dialog-form">
        <el-form :model="addAuditFrom">
          <el-form-item label="商家名称" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="addAuditFrom.putinShopName"></el-input>
          </el-form-item>
          <!--          <el-form-item label="连接地址" :label-width="formLabelWidth" class="dialog-input">-->
          <!--            <el-input v-model="addAuditFrom.forwordAddress"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="广告内容类型" :label-width="formLabelWidth" class="dialog-input">
            <el-select v-model="addAuditFrom.advertContentType" placeholder="请选择">
              <el-option label="图片类型" value="01"></el-option>
              <el-option label="文字类型" value="02"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告商家" :label-width="formLabelWidth" class="dialog-input">
            <el-select v-model="addAuditFrom.advertType" placeholder="请选择">
              <el-option label="自营广告" value="01"></el-option>
              <el-option label="商家广告" value="02"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth" class="dialog-input">
            <el-upload
              action="test"
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="()=>{return false;}"
              :on-change="handleAddImageChange"
            >
              <img v-if="addAuditFrom.file" :src="addAuditFrom.file" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!--          <el-form-item label="广告内容" :label-width="formLabelWidth" class="dialog-input">-->
          <!--            <el-input v-model="addAuditFrom.advertText"></el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="流量入口经度" :label-width="formLabelWidth" class="dialog-input">-->
          <!--            <el-input v-model="addAuditFrom.flowInLong"></el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="流量入口纬度" :label-width="formLabelWidth" class="dialog-input">-->
          <!--            <el-input v-model="addAuditFrom.flowInLat"></el-input>-->
          <!--          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddAudit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑数据 -->
      <el-dialog title="广告编辑" :visible.sync="editFormVisible" class="dialog-form">
        <el-form :model="editAuditForm">
          <el-form-item
            label="商家名称"
            v-if="editAuditForm.putinShopName"
            :label-width="formLabelWidth"
            class="dialog-input"
          >
            <el-input v-model="editAuditForm.putinShopName"></el-input>
          </el-form-item>
          <!--          <el-form-item label="连接地址"-->
          <!--                        v-if="editAuditForm.forwordAddress"-->
          <!--                        :label-width="formLabelWidth"-->
          <!--                        class="dialog-input">-->
          <!--            <el-input v-model="editAuditForm.forwordAddress"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label="广告内容类型" :label-width="formLabelWidth" class="dialog-input">
            <el-select v-model="editAuditForm.advertContentType" placeholder="请选择">
              <el-option label="图片类型" value="01"></el-option>
              <el-option label="文字类型" value="02"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="广告商家"
            v-if="editAuditForm.advertType"
            :label-width="formLabelWidth"
            class="dialog-input"
          >
            <el-select v-model="editAuditForm.advertType" placeholder="请选择">
              <el-option label="自营广告" value="01"></el-option>
              <el-option label="商家广告" value="02"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="图片"
            v-if="editAuditForm.advertContentType=== '01'"
            :label-width="formLabelWidth"
            class="dialog-input"
          >
            <el-upload
              action="test"
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="()=>{return false;}"
              :on-change="handleEditImageChange"
            >
              <img v-if="!editAuditForm.file" :src="editAuditForm.imgUrl" class="avatar-o" />
              <img v-if="editAuditForm.file" :src="editAuditForm.file" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <!--          <el-form-item label="广告内容"-->
          <!--                        v-if="editAuditForm.advertContentType=== '02'"-->
          <!--                        :label-width="formLabelWidth"-->
          <!--                        class="dialog-input">-->
          <!--            <el-input v-model="editAuditForm.advertText"></el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="流量入口经度"-->
          <!--                        :label-width="formLabelWidth"-->
          <!--                        class="dialog-input">-->
          <!--            <el-input v-model="editAuditForm.flowInLong"></el-input>-->
          <!--          </el-form-item>-->
          <!--          <el-form-item label="流量入口纬度"-->
          <!--                        :label-width="formLabelWidth"-->
          <!--                        class="dialog-input">-->
          <!--            <el-input v-model="editAuditForm.flowInLat"></el-input>-->
          <!--          </el-form-item>-->
          <el-form-item label :label-width="formLabelWidth" class="dialog-input">
            <el-radio v-model="editAuditForm.state" label="99" border>下架广告</el-radio>
            <el-radio v-model="editAuditForm.state" label="00" border>使用广告</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateAudit">确 定</el-button>
        </div>
      </el-dialog>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>

<script>
import Header from "../../components/header";
import Footer from "../../components/footer";
import AdvertIndex from "../../api/advert/advertIndex";
import config from "../../config/config";

export default {
  name: "advertIndex",
  components: {
    Header,
    Footer
  },
  props: ["clientHeight"],
  data() {
    return {
      //搜索表单
      searchForm: {
        putinShopName: "",
        advertType: "00",
        advertContentType: "00",
        auditState: "00",
        state: "00"
      },
      //列表数据
      data: [],
      addFormVisible: false,
      editFormVisible: false,
      addAuditFrom: {},
      editAuditForm: {},
      formLabelWidth: "150px",
      tempFile: ""
    };
  },
  created() {
    this.handleSearch();
  },
  methods: {
    //执行搜索
    handleSearch() {
      let searchForm = this.searchForm;
      AdvertIndex.searchItemList(
        searchForm.putinShopName,
        searchForm.advertType,
        searchForm.advertContentType,
        searchForm.auditState,
        searchForm.state
      ).then(res => {
        if (res.data) {
          this.data = res.data;
        }
      });
    },
    // Edit 改变图片上传验证
    handleEditImageChange(file) {
      this.tempFile = file;
      let tempFile = URL.createObjectURL(file.raw);
      //更新对象
      this.editAuditForm = Object.assign({}, this.editAuditForm, {
        file: tempFile
      });
    },
    // Add 改变图片上传验证
    handleAddImageChange(file) {
      this.tempFile = file;
      let tempFile = URL.createObjectURL(file.raw);
      //更新对象
      this.addAuditFrom = Object.assign({}, this.addAuditFrom, {
        file: tempFile
      });
    },
    //保存
    handleAddAudit() {
      this.addFormVisible = false;
      let addForm = this.addAuditFrom;
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      AdvertIndex.save(
        this.tempFile,
        "",
        addForm.putinShopName,
        addForm.advertContentType,
        addForm.advertType,
        "99"
      ).then(res => {
        loading.close();
        this.tempFile = "";
        if (res.success) {
          this.$message.success("添加成功");
          this.addAuditFrom = {};
        } else {
          this.$message.warning("添加失败");
        }
      });
    },
    handlePageChange() {
      //console.log("handlePageChange");
    },
    handleEdit(index, row) {
      this.editFormVisible = true;
      this.editAuditForm = row;
      this.editAuditForm.imgUrl =
        config.baseUrl + "/outByteImgById?id=" + row.advertImgId;
      //console.log("handleEdit", index, row);
    },
    //更新
    handleUpdateAudit() {
      this.editFormVisible = false;
      let editForm = this.editAuditForm;
      let loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      AdvertIndex.save(
        this.tempFile,
        editForm.id,
        editForm.putinShopName,
        editForm.advertContentType,
        editForm.advertType,
        editForm.state
      ).then(res => {
        loading.close();
        this.tempFile = "";
        if (res.success) {
          this.$message.success("修改成功");
          this.editAuditForm = {};
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let temp = this.data[index];
          AdvertIndex.deleteAdvert(temp.id).then(res => {
            if (res.success) {
              this.data.splice(index, 1);
              this.$message.success("删除成功!");
            } else {
              this.$message.error("删除失败!");
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
    timeFmt(row, column, cellValue, index) {
      return new Date(row.createDate).toLocaleDateString().replace(/\//g, "-");
    },
    advertTypeFmt(row) {
      return row.advertType == "01" ? "自营广告" : "商家广告";
    },
    advertContentTypeFmt(row) {
      return row.advertContentType == "01" ? "图片类型" : "文字类型";
    },
    stateFmt(row) {
      return row.state == "00" ? "使用中" : "已下架";
    },
    auditStateFmt(row) {
      let msg = "";
      switch (row.auditState) {
        case "01":
          msg = "待审核";
          break;
        case "02":
          msg = "审核中";
          break;
        case "03":
          msg = "通过";
          break;
        case "04":
          msg = "未通过";
          break;
      }
      return msg;
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
