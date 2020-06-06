<template>
  <el-container>
    <el-header>
      <Header>
        >&nbsp;品类管理
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
                <el-form-item label="分类名称">
                  <el-input size="medium" v-model="searchForm.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="">
                  <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                  <!--                                    <el-button class="add-category-btn" type="success" @click="addFormVisible = true">-->
                  <!--                                        新增分类-->
                  <!--                                    </el-button>-->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>

      <!-- 列表数据展示 -->
      <el-card class="box">
        <el-table :data="data" :height="clientHeight-325" border>
          <el-table-column show-overflow-tooltip label="名称" prop="name"></el-table-column>

          <el-table-column label="图片">
            <template slot-scope="scope">
              　　<img :src="scope.row.imgUrl" class="img_pic" />
            </template>
          </el-table-column>
          <el-table-column show-overflow width="150px" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <!--                            <el-button-->
              <!--                                    size="mini"-->
              <!--                                    type="danger"-->
              <!--                                    @click="handleDelete(scope.$index, scope.row)">删除-->
              <!--                            </el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <div class="page">
          <!--                    <el-pagination-->
          <!--                            hide-on-single-page-->
          <!--                            background-->
          <!--                            :current-page="currentPage"-->
          <!--                            @current-change="handlePageChange"-->
          <!--                            layout="prev, pager, next"-->
          <!--                            :total="total">-->
          <!--                    </el-pagination>-->
        </div>
      </el-card>
      <!-- 添加数据 -->
      <el-dialog title="新增分类" :visible.sync="addFormVisible" class="dialog-form">
        <el-form :model="addCategoryFrom" inline>
          <el-form-item label="分类名称" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="addCategoryFrom.name"></el-input>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth" class="dialog-input">
            <el-upload action="test" class="avatar-uploader" :show-file-list="false" :before-upload="()=>{return false;}"
              :on-change="handleAddImageChange">
              <img v-if="addCategoryFrom.imgUrl" :src="addCategoryFrom.imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAddCategory">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑数据 -->
      <el-dialog title="分类编辑" :visible.sync="editFormVisible" class="dialog-form">
        <el-form :model="editCategoryForm" inline>
          <el-form-item label="分类名称" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="editCategoryForm.name"></el-input>
          </el-form-item>
          <el-form-item label="图片" :label-width="formLabelWidth" class="dialog-input">
            <el-upload action="test" class="avatar-uploader" :show-file-list="false" :before-upload="()=>{return false;}"
              :on-change="handleEditImageChange">
              <img v-if="editCategoryForm.imgUrl" :src="editCategoryForm.imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleUpdateCategory">确 定</el-button>
        </div>
      </el-dialog>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>

<script>
  import Header from "../../components/header";
  import Footer from "../../components/footer";
  import ToCategory from "../../api/goodsmanage/category";
  import config from '../../config/config';

  export default {
    name: "toCategory",
    components: {
      Footer,
      Header
    },
    props: ['clientHeight'],
    data() {
      return {
        //搜索表单
        searchForm: {
          categoryName: '',
        },
        //列表数据
        data: [],
        total: 1,
        currentPage: 1,
        addFormVisible: false,
        editFormVisible: false,
        addCategoryFrom: {},
        editCategoryForm: {},
        formLabelWidth: '200px',
        tempFile: ''
      }
    },
    created() {
      this.handleSearch();
    },
    methods: {
      //执行搜索
      handleSearch() {
        let searchForm = this.searchForm;
        ToCategory.searchItemList(searchForm.name).then(res => {
          if (res.data) {
            let data = res.data.map(elem => {
              elem.imgUrl = config.baseUrl + '/outByteImgById?id=' + elem.imgUrl;
              return elem;
            });
            this.data = data;
          }
        });
      },
      // Edit 改变图片上传验证
      handleEditImageChange(file) {
        this.tempFile = file;
        let tempFile = URL.createObjectURL(file.raw);
        //更新对象
       this.editCategoryForm = Object.assign({}, this.editCategoryForm, {imgUrl: tempFile});
        // this.editCategoryForm.img = file.raw;
      },
      // Add 改变图片上传验证
      handleAddImageChange(file) {
        this.tempFile = file;
        this.addCategoryFrom.img = file.raw;
      },

      handleAddCategory() {
        this.addFormVisible = false;
        //console.log("handleAddCategory");
      },
      handlePageChange() {
        //console.log("handlePageChange");
      },
      handleEdit(index, row) {
        this.editFormVisible = true;
        this.editCategoryForm = row;
        //console.log(this.editCategoryForm)
      },
      // 编辑更新
      handleUpdateCategory() {
        this.editFormVisible = false;
        let editForm = this.editCategoryForm;
        let loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        ToCategory.updateCategoryShop(this.tempFile, editForm.id, editForm.name).then(res => {
          loading.close();
          if (res.success) {
            this.handleSearch();
            this.$message.success("修改成功");
            this.tempFile = "";
          } else {
            this.$message.warning("修改失败");
          }
        });
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.data.splice(index, 1);
          //console.log("handleDelete", index, row)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      timeFmt(row, column, cellValue, index) {
        return new Date(row.receiveDate).toLocaleDateString().replace(/\//g, "-");
      }
    }
  }
</script>

<style lang="scss" scoped>
  .img_pic {
    width: 40px;
    height: 40px;
  }

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

  }
</style>
