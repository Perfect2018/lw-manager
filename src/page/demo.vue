<template>
    <el-container>
        <el-header>
            <Header>
                >&nbsp;广告管理
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
                                <el-form-item label="商家名称">
                                    <el-input size="medium" v-model="searchForm.putinShopName"
                                              placeholder="请输入广告名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="广告类型">
                                    <el-select v-model="searchForm.advertType">
                                        <el-option label="全部" value="00"></el-option>
                                        <el-option label="自营广告" value="01"></el-option>
                                        <el-option label="普通广告" value="02"></el-option>
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
                                <el-form-item label="">
                                    <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                                    <el-button class="add-audit-btn" type="success" @click="addFormVisible = true">
                                        广告发布
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>

            <!-- 列表数据展示 -->
            <el-card class="box">
                <el-table ref="datagrid" :data="data" :height="clientHeight-415" border>
                    <el-table-column show-overflow-tooltip label="商家名称" prop="putinShopName"></el-table-column>
                    <el-table-column show-overflow-tooltip label="广告类型" prop="advertType"></el-table-column>
                    <el-table-column show-overflow-tooltip label="内容类型	"
                                     prop="advertContentType"></el-table-column>
                    <el-table-column show-overflow-tooltip label="连接地址	" prop="forwordAddress"></el-table-column>
                    <el-table-column show-overflow-tooltip label="审核状态" prop="knightTel"></el-table-column>
                    <el-table-column show-overflow-tooltip label="流量入口经度" prop="flowInLong"></el-table-column>
                    <el-table-column show-overflow-tooltip label="流量入口纬度" prop="flowInLat"></el-table-column>
                    <el-table-column show-overflow-tooltip label="创建时间" prop="createDate"
                                     :formatter="timeFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="状态" prop="state"></el-table-column>
                    <el-table-column show-overflow width="150px" label="操作">
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
            <!-- 添加数据 -->
            <el-dialog title="广告添加" :visible.sync="addFormVisible" class="dialog-form">
                <el-form :model="addAuditFrom">
                    <el-form-item label="商家名称" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addAuditFrom.putinShopName"></el-input>
                    </el-form-item>
                    <el-form-item label="连接地址" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addAuditFrom.forwordAddress"></el-input>
                    </el-form-item>
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
                                :on-change="handleAddImageChange">
                            <img v-if="addAuditFrom.file" :src="addAuditFrom.file" class="avatar"/>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="广告内容" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addAuditFrom.advertText"></el-input>
                    </el-form-item>
                    <el-form-item label="流量入口经度" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addAuditFrom.flowInLong"></el-input>
                    </el-form-item>
                    <el-form-item label="流量入口纬度" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addAuditFrom.flowInLat"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddAudit">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑数据 -->
            <el-dialog title="广告编辑" :visible.sync="editFormVisible" class="dialog-form">
                <el-form :model="editAuditForm">
                    <el-form-item label="商家名称"
                                  v-if="editAuditForm.putinShopName"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editAuditForm.putinShopName"></el-input>
                    </el-form-item>
                    <el-form-item label="连接地址"
                                  v-if="editAuditForm.forwordAddress"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editAuditForm.forwordAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="广告内容类型"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-select v-model="editAuditForm.advertContentType"
                                   placeholder="请选择">
                            <el-option label="图片类型" value="01"></el-option>
                            <el-option label="文字类型" value="02"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告商家"
                                  v-if="editAuditForm.advertType"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-select v-model="editAuditForm.advertType" placeholder="请选择">
                            <el-option label="自营广告" value="01"></el-option>
                            <el-option label="商家广告" value="02"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="图片"
                                  v-if="editAuditForm.advertContentType=== '01'"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-upload
                                action="test"
                                class="avatar-uploader"
                                :show-file-list="false"
                                :before-upload="()=>{return false;}"
                                :on-change="handleEditImageChange">
                            <img v-if="editAuditForm.file" :src="editAuditForm.file" class="avatar"/>
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="广告内容"
                                  v-if="editAuditForm.advertContentType=== '02'"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editAuditForm.advertText"></el-input>
                    </el-form-item>
                    <el-form-item label="流量入口经度"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editAuditForm.flowInLong"></el-input>
                    </el-form-item>
                    <el-form-item label="流量入口纬度"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editAuditForm.flowInLat"></el-input>
                    </el-form-item>
                    <el-form-item label=""
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
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
    import {imageToBase64} from '../../api/tools/imageTools'
    import Footer from "../components/footer";

    export default {
        name: "advertIndex",
        components: {
            Footer,
            Header
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
                        putinShopName: 'putinShopName',
                        advertType: 'advertType',
                        advertContentType: '01',
                        forwordAddress: 'forwordAddress',
                        knightTel: 'knightTel',
                        flowInLong: 'flowInLong',
                        flowInLat: 'flowInLat',
                        createDate: 'createDate',
                        state: '99',
                    }
                ],

                total: 1,
                currentPage: 1,
                addFormVisible: false,
                editFormVisible: false,
                addAuditFrom: {
                    putinShopName: '',
                    forwordAddress: '',
                    advertContentType: '01',
                    advertType: '01',
                    file: '',
                    advertText: '',
                    flowInLong: '',
                    flowInLat: ''
                },
                editAuditForm: {
                    putinShopName: '',
                    forwordAddress: '',
                    advertContentType: '01',
                    advertType: '01',
                    file: '',
                    advertText: '',
                    flowInLong: '',
                    flowInLat: '',
                },
                formLabelWidth: '120px'
            }
        },
        methods: {
            // Edit 改变图片上传验证
            handleEditImageChange(file) {
                this.editAuditForm.file = URL.createObjectURL(file.raw);
                imageToBase64(this.editAuditForm.file, 300, 300).then(res => {
                    //更新对象
                    this.editAuditForm = Object.assign({}, this.editAuditForm, {file: res});
                });
            },
            // Add 改变图片上传验证
            handleAddImageChange(file) {
                this.addAuditFrom.file = URL.createObjectURL(file.raw);
                imageToBase64(this.addAuditFrom.file, 300, 300).then(res => {
                    //更新对象
                    this.addAuditFrom = Object.assign({}, this.addAuditFrom, {file: res});
                });
            },

            handleSearch() {
                //console.log("handleSearch")
            },
            handleAddAudit() {
                this.addFormVisible = false;
                //console.log("handleAddAudit")
            },
            handlePageChange() {
                //console.log("handlePageChange")
            },
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.editAuditForm = row;
                //console.log("handleEdit", index, row)
            },
            handleUpdateAudit() {
                this.editFormVisible = false;
                //console.log("handleUpdateAudit")
            },
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
            timeFmt(row, column, cellValue, index) {
                return new Date(row.receiveDate).toLocaleDateString().replace(/\//g, "-")
            }
            ,

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

        .el-dialog {
            min-width: 600px;

            .dialog-input {
                margin: 20px auto;
            }
        }
    }
</style>
