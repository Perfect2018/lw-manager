<template>

    <el-container>
        <el-header>
            <Header>
                >&nbsp;商户订单查询
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
                                <el-form-item label="订单号">
                                    <el-input v-model="searchForm.order"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="商户名称">
                                    <el-input v-model="searchForm.custrom"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="交易状态">
                                    <el-select v-model="searchForm.state">
                                        <el-option label="未出账" value=""></el-option>
                                        <el-option label="已出账" value=""></el-option>
                                        <el-option label="所有" value=""></el-option>
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
                <el-table :data="data" :height="clientHeight-415" border>
                    <el-table-column show-overflow-tooltip label="订单号" prop="orderNo"></el-table-column>
                    <el-table-column show-overflow-tooltip label="商户名称" prop="shopName"></el-table-column>
                    <el-table-column show-overflow-tooltip label="优惠金额" prop="subtractionAmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="支付总金额" prop="finalAmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="订单状态" prop="orderState"
                                     :formatter="orderStateFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="订单状态描述" prop="orderStateNote"></el-table-column>
                    <el-table-column show-overflow-tooltip label="收货时间" prop="receiveDate"></el-table-column>
                    <el-table-column show-overflow-tooltip label="是否出账" prop="isOutorder"
                                     :formatter="isOutorderFmt"></el-table-column>
                    <el-table-column show-overflow-tooltip label="评价客户" prop="evaluateCustNote"></el-table-column>
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
            <Footer></Footer>
        </el-main>

    </el-container>
</template>
<script>
    import Footer from '../../components/footer'
    import Header from '../../components/header'
    import * as getOrderShopApi from '../../api/order/getShopOrderPage'

    export default {
        name: 'getShopOrderPage',
        props: ['clientHeight'],
        components: {
            Header,
            Footer
        },
        data() {
            return {
                searchForm: {
                    order: '',
                    custrom: '',
                    state: '',

                },
                data: [],
                currentPage: 1,
                total: 1,
            }
        },
        computed: {},
        methods: {
            handleSearch() {
                getOrderShopApi.getList('1', this.searchForm.order, this.searchForm.custrom, this.searchForm.state)
                    .then((res) => {
                        this.data = res.list
                        this.total = res.total
                    })
            },
            handlePageChange(currentPage) {
                this.currentPage = currentPage
                getOrderShopApi.getList(currentPage, this.searchForm.order, this.searchForm.custrom, this.searchForm.state)
                    .then((result) => {
                        this.data = result.list
                    })
            },
            orderStateFmt(row, column, cellValue, index) {
                return row.orderState == "00" ? "已接单" :
                    row.orderState == "03" ? "已退单" :
                        row.orderState == "07" ? "已付款" : "申请失败"
                row.orderState == "08" ? "待付款" : "申请失败"
                row.orderState == "09" ? "配送中" : "配送完成"
            },
            isOutorderFmt(row, column, cellValue, index) {
                return row.isOutorder == "00" ? "已出账" : "未出账"
            },


        },

        beforeMount() {
            getOrderShopApi.getList('1', this.searchForm.order, this.searchForm.custrom, this.searchForm.state)
                .then((result) => {
                    this.data = result.list
                    this.total = result.total
                }).catch(() => {
                this.$message({
                    type: 'warning',
                    message: "请求超时，请重新登录"
                })
                this.$router.push({
                    path: '/'
                })
            })
        }

    }
</script>
<style lang="scss" scoped>
    .showMain {
        padding: 10px;

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
