<template>
    <el-container>
        <el-header>
            <Header>
                >&nbsp;红包查询
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
                                <el-form-item label="赞助单位">
                                    <el-input size="medium" v-model="searchForm.sponsorShopName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="生效日期">
                                    <el-date-picker
                                            size="medium"
                                            v-model="searchForm.validDateStart"
                                            type="date">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="结束日期">
                                    <el-date-picker
                                            size="medium"
                                            v-model="searchForm.validDateEnd"
                                            type="date">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="红包类型">
                                    <el-select v-model="searchForm.redPackageS">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="正常红包" value="01"></el-option>
                                        <el-option label="积分兑换红包" value="02"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="状态">
                                    <el-select v-model="searchForm.state">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="有效" value="00"></el-option>
                                        <el-option label="无效" value="99"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="">
                                    <el-button class="search-btn" type="primary" @click="handleSearch">查询</el-button>
                                    <el-button class="add-red-packet-btn" type="success" @click="addFormVisible = true">
                                        新增红包
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
                    <el-table-column show-overflow-tooltip label="红包金额" prop="amtUnit"></el-table-column>
                    <el-table-column show-overflow-tooltip label="生效日期" prop="validDate"></el-table-column>
                    <el-table-column show-overflow-tooltip label="失效日期" prop="invalidDate"></el-table-column>
                    <el-table-column show-overflow-tooltip label="红包数量" prop="shopName"></el-table-column>
                    <el-table-column show-overflow-tooltip label="新客户是否可用" prop="isNewCustUse"
                                     :formatter="isNewCustUseFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="老客户是否可用" prop="isOldCustUse"
                                     :formatter="isOldCustUseFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="特价商品是否可用" prop="isSpecialUse"
                                     :formatter="isSpecialUseFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="满多少可用" prop="fullAmtUse"
                                     :formatter="fullAmtUseFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="用户可以领取次数" prop="custReceiveCount"></el-table-column>
                    <el-table-column show-overflow-tooltip label="每单可使用红包数" prop="orderUseCount"></el-table-column>
                    <el-table-column show-overflow-tooltip label="红包类型" prop="redPackage"
                                     :formatter="redPackageFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="需要兑换的积分数" prop="needsPointCount"></el-table-column>
                    <el-table-column show-overflow-tooltip label="客户领取总金额" prop="custTotalAmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="客户领取使用金额" prop="custUseTotalAmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="创建日期" prop="createDate"
                                     :formatter="timeFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="状态" prop="state"
                                     :formatter="stateFmt"></el-table-column>
                    <el-table-column width="150px" label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.state == '00'"
                                    @click="handleLoseEfficacy(scope.$index, scope.row)">失效
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="info"
                                    disabled
                                    v-else>已失效
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
            <el-dialog title="新增红包" :visible.sync="addFormVisible" class="dialog-form">
                <el-form :model="addRedPackagerFrom">
                    <el-form-item label="发放单位" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addRedPackagerFrom.putinShopName"></el-input>
                    </el-form-item>
                    <el-form-item label="单个红包金额" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addRedPackagerFrom.redEnvelopesMoney" type="number" min="1"></el-input>
                    </el-form-item>
                    <el-form-item label="发放总数" :label-width="formLabelWidth" class="dialog-input">
                        <el-input-number v-model="addRedPackagerFrom.number" :min="1"></el-input-number>
                    </el-form-item>

                    <el-form-item label="生效日期" :label-width="formLabelWidth" class="dialog-input">
                        <el-date-picker
                                size="medium"
                                v-model="addRedPackagerFrom.validDateStr"
                                type="date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束日期" :label-width="formLabelWidth" class="dialog-input">
                        <el-date-picker
                                size="medium"
                                v-model="addRedPackagerFrom.invalidDateStr"
                                type="date">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="满减金额" :label-width="formLabelWidth" class="dialog-input">
                        <el-input v-model="addRedPackagerFrom.fullAmtUse" type="number" min="1"></el-input>
                    </el-form-item>
                    <el-form-item label="新客户是否可用"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-radio v-model="addRedPackagerFrom.isNewCustUse" label="01" border>可用</el-radio>
                        <el-radio v-model="addRedPackagerFrom.isNewCustUse" label="00" border>不可用</el-radio>
                    </el-form-item>
                    <el-form-item label="老客户是否可用"
                                  :label-width="formLabelWidth"
                                  class="dialog-input">
                        <el-radio v-model="addRedPackagerFrom.isOldCustUse" label="01" border>可用</el-radio>
                        <el-radio v-model="addRedPackagerFrom.isOldCustUse" label="00" border>不可用</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddRedPackager">确 定</el-button>
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
        name: "getRecruit",
        components: {
            Header,
            Footer
        },
        props: ['clientHeight'],
        data() {
            return {
                //搜索表单
                searchForm: {
                    sponsorShopName: '',
                    validDateStart: '',
                    validDateEnd: '',
                    redPackageS: '',
                    state: '',
                },
                //添加表单
                addRedPackagerFrom: {
                    putinShopName: 'putinShopName',
                    redEnvelopesMoney: 0,
                    number: 1,
                    validDateStr: 'validDateStr',
                    invalidDateStr: 'invalidDateStr',
                    fullAmtUse: 1,
                    isNewCustUse: '01',
                    isOldCustUse: '01',
                },
                //列表数据
                data: [
                    {
                        amtUnit: 'amtUnit',
                        validDate: 'validDate',
                        invalidDate: 'invalidDate',
                        shopName: 'shopName',
                        isNewCustUse: '00',
                        isOldCustUse: '00',
                        isSpecialUse: '00',
                        fullAmtUse: '00',
                        custReceiveCount: 'custReceiveCount',
                        orderUseCount: 'orderUseCount',
                        redPackage: '01',
                        needsPointCount: 'needsPointCount',
                        custTotalAmt: 'custTotalAmt',
                        custUseTotalAmt: 'custUseTotalAmt',
                        createDate: 'createDate',
                        state: '00',
                    }
                ],
                addFormVisible: false,
                total: 1,
                currentPage: 1,
                formLabelWidth: '150px'
            }
        },
        methods: {
            //执行搜索
            handleSearch() {
                //console.log("handleSearch");
            },
            //分页
            handlePageChange() {
                //console.log("handlePageChange");
            },
            //保存
            handleAddRedPackager() {
                //console.log("handleAddRedPackager");
            },
            //失效
            handleLoseEfficacy(index, row) {
                //console.log('handleDispose', index, row);
            },
            // 新客户是否可用
            isNewCustUseFmt(row) {
                return row.isNewCustUse == '00' ? '不可用' : '可用';
            },
            // 老客户是否可用
            isOldCustUseFmt(row) {
                return row.isOldCustUse == '00' ? '不可用' : '可用';
            },
            // 特价商品是否可用
            isSpecialUseFmt(row) {
                return row.isSpecialUse == '00' ? '不可用' : '可用';
            },
            // 满多少可用
            fullAmtUseFmt(row) {
                return row.fullAmtUse == '00' ? '不可用' : '可用';
            },
            // 红包类型
            redPackageFmt(row) {
                return row.redPackage == '01' ? '正常红包' : '积分兑换红包';
            },
            //时间格式化(创建时间)
            timeFmt(row) {
                return new Date(row.createDate).toLocaleDateString().replace(/\//g, "-")
            },
            //状态格式化
            stateFmt(row) {
                return row.state == '00' ? '已生效' : '已失效';
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

        .add-red-packet-btn {
            width: 45%;
        }

        .el-form-item {
            margin: 10px 0;
        }
    }
</style>
