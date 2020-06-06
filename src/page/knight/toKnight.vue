<template>
    <el-container>
        <el-header>
            <Header>
                >&nbsp;骑士列表
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
                                <el-form-item label="用户编号">
                                    <el-input size="medium" v-model="searchForm.putinShopName"
                                              placeholder="请输入广告名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="用户状态">
                                    <el-select v-model="searchForm.advertType">
                                        <el-option label="以通过骑士" value="00"></el-option>
                                        <el-option label="申请中的骑士" value="01"></el-option>
                                        <el-option label="所有骑士" value=""></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="">
                                    <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                                    <el-button class="add-audit-btn" type="success" @click="addFormVisible = true">
                                        添加骑士
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
                    <el-table-column show-overflow-tooltip label="姓名" prop="username"></el-table-column>
                    <el-table-column show-overflow-tooltip label="学历" prop="education"></el-table-column>
                    <el-table-column show-overflow-tooltip label="经验"
                                     prop="knightExperience"></el-table-column>
                    <el-table-column show-overflow-tooltip label="住址" prop="address"></el-table-column>
                    <el-table-column show-overflow-tooltip label="状态" prop="state"></el-table-column>
                    <el-table-column width="150px" label="审核" prop="flowInLong">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="success"
                                    @click="handleEdit(scope.$index, scope.row)">通过
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    @click="handleDelete(scope.$index, scope.row)">驳回
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="提取金额" prop="hasPutForwardAmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="申请时间" prop="createDate"
                                     :formatter="timeFmt"></el-table-column>
                    <el-table-column width="150px" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
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
                            :total="total">
                    </el-pagination>
                </div>
            </el-card>

            <el-dialog title="添加骑士" :visible.sync="addFormVisible" class="dialog-form">
                <!--                <el-form :model="addKnightFrom">-->
                <!--                    <el-form-item label="商家名称" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-input v-model="addAuditFrom.putinShopName"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="连接地址" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-input v-model="addAuditFrom.forwordAddress"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="广告内容类型" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-select v-model="addAuditFrom.advertContentType" placeholder="请选择">-->
                <!--                            <el-option label="图片类型" value="01"></el-option>-->
                <!--                            <el-option label="文字类型" value="02"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="广告商家" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-select v-model="addAuditFrom.advertType" placeholder="请选择">-->
                <!--                            <el-option label="自营广告" value="01"></el-option>-->
                <!--                            <el-option label="商家广告" value="02"></el-option>-->
                <!--                        </el-select>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="图片" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-upload-->
                <!--                                action="test"-->
                <!--                                class="avatar-uploader"-->
                <!--                                :show-file-list="false"-->
                <!--                                :before-upload="()=>{return false;}"-->
                <!--                                :on-change="handleAddImageChange">-->
                <!--                            <img v-if="addAuditFrom.file" :src="addAuditFrom.file" class="avatar"/>-->
                <!--                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                <!--                        </el-upload>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="广告内容" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-input v-model="addAuditFrom.advertText"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="流量入口经度" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-input v-model="addAuditFrom.flowInLong"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                    <el-form-item label="流量入口纬度" :label-width="formLabelWidth" class="dialog-input">-->
                <!--                        <el-input v-model="addAuditFrom.flowInLat"></el-input>-->
                <!--                    </el-form-item>-->
                <!--                </el-form>-->
                <!--                <div slot="footer" class="dialog-footer">-->
                <!--                    <el-button @click="addFormVisible = false">取 消</el-button>-->
                <!--                    <el-button type="primary" @click="handleAddAudit">确 定</el-button>-->
                <!--                </div>-->
            </el-dialog>
            <el-dialog title="骑士信息编辑" :visible.sync="editFormVisible" class="dialog-form">
                <!--                 username: '',
                                    education: '',
                                    knightExperience: '',
                                    address: '',
                                    state: '00',
                                    hasPutForwardAmt: '',
                                    createDate: '',-->
                <el-form :model="editKnightForm">
                    <el-form-item label="名字"
                                  v-if="editKnightForm.username"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editFormVisible.username"></el-input>
                    </el-form-item>
                    <el-form-item label="学历"
                                  v-if="editKnightForm.education"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editKnightForm.education"></el-input>
                    </el-form-item>
                    <el-form-item label="经验"
                                  v-if="editKnightForm.knightExperience"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editKnightForm.knightExperience"></el-input>
                    </el-form-item>
                    <el-form-item label="住址"
                                  v-if="editKnightForm.address"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editKnightForm.address"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleUpdateKnight">确 定</el-button>
                </div>
            </el-dialog>
            <Footer></Footer>
        </el-main>
    </el-container>
</template>

<script>
    import Header from "../../components/header";
    import Footer from "../../components/footer";

    export default {
        name: "toKnight",
        components: {
            Header,
            Footer
        },
        props: ['clientHeight'],
        data() {
            return {
                //搜索表单
                searchForm: {
                    putinShopName: '',
                    advertType: '00',
                    advertContentType: '00',
                    auditState: '00',
                    state: '00'
                },
                //列表数据
                data: [
                    {
                        username: 'username',
                        education: 'education',
                        knightExperience: 'knightExperience',
                        address: 'address',
                        state: '00',
                        hasPutForwardAmt: 'hasPutForwardAmt',
                        createDate: 'createDate',
                    }
                ],
                //总数
                total: 90,
                //一页显示数
                currentPage: 30,
                addFormVisible: false,
                editFormVisible: false,
                addKnightFrom: {
                    username: '',
                    education: '',
                    knightExperience: '',
                    address: '',
                    state: '00',
                    hasPutForwardAmt: '',
                    createDate: '',
                },
                editKnightForm: {
                    username: '',
                    education: '',
                    knightExperience: '',
                    address: '',
                    state: '00',
                    hasPutForwardAmt: '',
                    createDate: '',
                },
                formLabelWidth: '150px'
            }
        },
        methods: {
            //执行搜索
            handleSearch() {
                //console.log("handleSearch")
            },
            //添加骑士
            handleAddAudit() {
                this.addFormVisible = false;
                //console.log("handleAddAudit")
            },
            //分页
            handlePageChange() {
                //console.log("handlePageChange")
            },
            //进入编辑页面
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.editKnightForm = row;
                //console.log("handleEdit", index, row)
            },
            //提交更新
            handleUpdateKnight() {
                this.editFormVisible = false;
                //console.log("handleUpdateKnight")
            },
            //删除信息
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
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
            //时间格式化
            timeFmt(row, column, cellValue, index) {
                return new Date(row.receiveDate).toLocaleDateString().replace(/\//g, "-")
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

        .add-audit-btn {
            width: 45%;
        }

        .el-form-item {
            margin: 10px 0;
        }
    }
</style>
