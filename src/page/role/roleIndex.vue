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
                    <el-form :model="searchForm" label-width="100px" label-suffix="">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="角色名称">
                                    <el-input size="medium" v-model="searchForm.roleName"
                                              placeholder="请输入广告名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="角色编号">
                                    <el-input size="medium" v-model="searchForm.roleCode"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="部门状态">
                                    <el-select v-model="searchForm.state">
                                        <el-option label="有效" value="00"></el-option>
                                        <el-option label="无效" value="99"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="">
                                    <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                                    <el-button class="add-role-btn" type="success" @click="addFormVisible = true">
                                        新增角色
                                    </el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>

            <!-- 列表数据展示 -->
            <el-card class="box">
                <el-table :data="data" :height="clientHeight-415" border>
                    <el-table-column show-overflow-tooltip label="职位编号" prop="roleCode"></el-table-column>
                    <el-table-column show-overflow-tooltip label="职位名称" prop="roleName"></el-table-column>
                    <el-table-column show-overflow-tooltip label="菜单权限">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="warning"
                                    @click="jurisdictionFormVisible=true">设置
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip label="添加时间" prop="createDate"
                                     :formatter="timeFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="最后修改时间" prop="lastUpdateDate"
                                     :formatter="timeFmt"></el-table-column>
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
            <!-- 设置权限-->
            <el-dialog title="设置权限" :visible.sync="jurisdictionFormVisible" class="dialog-form">
                <el-form :model="jurisdictionForm">
                    <el-form-item label="" :label-width="formLabelWidth" class="dialog-input">
                        <el-tree
                                :data="jurisdictionForm.data"
                                ref="jurisdictionTree"
                                show-checkbox
                                node-key="id"
                                :props="defaultProps">
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="jurisdictionFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSettingJurisdiction">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 添加数据 -->
            <el-dialog title="新增角色" :visible.sync="addFormVisible" class="dialog-form">
                <el-form :model="addRoleFrom">
                    <el-form-item label="角色编号" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addRoleFrom.roleCode"></el-input>
                    </el-form-item>
                    <el-form-item label="角色名称" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addRoleFrom.roleName"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addRoleFrom = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddRole">确 定</el-button>
                </div>
            </el-dialog>
            <!-- 编辑数据 -->
            <el-dialog title="角色编辑" :visible.sync="editFormVisible" class="dialog-form">
                <el-form :model="editRoleForm">
                    <el-form-item label="职位编号"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editRoleForm.roleCode"></el-input>
                    </el-form-item>
                    <el-form-item label="职位名称"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-input v-model="editRoleForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-radio v-model="editRoleForm.state" label="99" border>停用</el-radio>
                        <el-radio v-model="editRoleForm.state" label="00" border>启用</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="editFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleUpdateRole">确 定</el-button>
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
        name: "advertIndex",
        components: {
            Header,
            Footer
        },
        props: ['clientHeight'],
        data() {
            return {
                //搜索表单
                searchForm: {
                    roleCode: '',
                    state: '00'
                },
                //列表数据
                data: [
                    {
                        roleCode: 'roleCode',
                        roleName: 'roleName',
                        createDate: 'createDate',
                        lastUpdateDate: 'lastUpdateDate',
                    }
                ],
                addRoleFrom: {
                    roleCode: '',
                    roleName: '',
                },
                editRoleForm: {
                    roleCode: '',
                    roleName: '',
                    state: '00'
                },
                jurisdictionForm: {
                    data: [{
                        id: 1,
                        label: '一级 1',
                        children: [{
                            id: 4,
                            label: '二级 1-1',
                            children: [{
                                id: 9,
                                label: '三级 1-1-1'
                            }, {
                                id: 10,
                                label: '三级 1-1-2'
                            }]
                        }]
                    },
                        {
                            id: 2,
                            label: '一级 2',
                            children: [{
                                id: 5,
                                label: '二级 2-1'
                            }, {
                                id: 6,
                                label: '二级 2-2'
                            }]
                        },
                        {
                            id: 3,
                            label: '一级 3',
                            children: [{
                                id: 7,
                                label: '二级 3-1'
                            }, {
                                id: 8,
                                label: '二级 3-2'
                            }]
                        }],
                },
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                addFormVisible: false,
                editFormVisible: false,
                jurisdictionFormVisible: false,
                total: 1,
                currentPage: 1,
                formLabelWidth: '150px'
            }
        },
        methods: {

            handleSearch() {
                //console.log("handleSearch")
            },
            //设置角色权限
            handleSettingJurisdiction() {
                this.jurisdictionFormVisible = false;
                //console.log(this.$refs.jurisdictionTree.getCheckedNodes())
            },
            //添加角色
            handleAddRole() {
                this.addFormVisible = false;
                //console.log("handleAddRole")
            },
            //更新角色
            handleUpdateRole() {
                this.addFormVisible = false;
                //console.log(this.defaultProps)
                //console.log("handleUpdateRole")
            },
            handlePageChange() {
                //console.log("handlePageChange")
            },
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.editAuditForm = row;
                //console.log("handleEdit", index, row)
            },
            timeFmt(row) {
                return new Date(row.receiveDate).toLocaleDateString().replace(/\//g, "-");
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

        .add-role-btn {
            width: 45%;
        }

        .el-form-item {
            margin: 10px 0;
        }
    }
</style>
