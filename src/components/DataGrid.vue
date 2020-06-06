<template>
    <div class="dg-main">
        <el-table
                :data="gridData"
                height="700"
                border
                style="width: 100%"
                size="small">
            <slot></slot>
        </el-table>

    </div>
</template>
<script>
    export default {
        name: 'DataGrid',
        data() {
            return {
                // 表格数据
                gridData: [],
                total: 1,
                currentPage: 1,
                // 是否显示进度条
                loading: false,
                // 保存多选选中的数据
                multSelection: [],
                triggerSelectEvent: true,
                mainHeight: '500px'
            }
        },
        props: {
            data: {
                type: Array,
                default: () => []
            },
        }

    }
</script>
<style scoped>
    .dg-main {
        overflow: hidden;
        margin: 0;
        flex: 1;
    }
</style>


