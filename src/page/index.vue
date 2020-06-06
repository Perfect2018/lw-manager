<template>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <ul class="information">
        <li>
          <div class="item">
            <p>总用户数</p>
            <p>{{ptTradeCountDay}}人</p>
          </div>
        </li>
        <li>
          <div class="item">
            <p>较昨日比率(%)</p>
            <p>{{countRate}}%</p>
          </div>
        </li>
        <li>
          <div class="item">
            <p>新增用户数（人）</p>
            <p>{{addCustCountToday}} 人</p>
          </div>
        </li>
        <li>
          <div class="item">
            <p>认证用户数</p>
            <p>{{cumulativeNumberOfCustomers}}人</p>
          </div>
        </li>
        <!-- <li>
          <div class="item">
            <p>平均客单价（元）</p>
            <p>{{avgCustPrice}}元</p>
          </div>
        </li> -->
        <!-- <li>
          <div class='item' >
            <p>今日访问量（人）</p>
            <p>{{ptVisitCountToday}}人</p>
          </div>
        </li>-->
        <li>
          <div class="item">
            <p>信息总数</p>
            <p>{{dayAmt}}条</p>
          </div>
        </li>
        <li>
          <div class="item">
            <p>较昨日比率（%）</p>
            <p>{{amtRate}}%</p>
          </div>
        </li>
        <li>
          <div class="item">
            <p>新增信息数（条）</p>
            <p>{{addShopCountToday}}条</p>
          </div>
        </li>
        <li>
          <div class="item">
            <p>历史信息数（条）</p>
            <p>{{cumulativeNumberOfMerchants}}个</p>
          </div>
        </li>
      </ul>
      <div class="myechart">
        <div id="myechart1"></div>
        <div id="myechart2"></div>
        <div id="myechart3"></div>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import Aside from "../components/aside";
import Header from "../components/header";
import indexApi from "../api/index";

var echarts = require("echarts");
export default {
  name: "index",
  components: {
    Aside,
    Header
  },
  data() {
    return {
      dayAmt: "", //日交易金额
      ptTradeAmtCountYestoday: "", //昨日交易金额
      amtRate: "100",
      countRate: "100",
      avgCustPrice: "", //平均客单价
      ptTradeCountDay: "", //交易量
      ptTradeCountYestoday: "", //昨日交易量
      addShopCountToday: "", //新增商户数
      addCustCountToday: "", //新增客户数
      cumulativeNumberOfMerchants: "", //累计商户
      cumulativeNumberOfCustomers: "", //累计用户
      ptVisitCountToday: "" //今日访问量
      // date:[],
      // shop:[],
      // addShop:[],
      // user:[],
      // addUser:[],
    };
  },
  computed: {},
  methods: {},

  mounted() {
    indexApi.getCount().then(res => {
      var data = res.data;
      var date = data.date;
      var shop = data.messageYesterday;
      var addShop = data.messageUp;
      // 基于准备好的dom，初始化echarts实例
      var myChart3 = echarts.init(document.getElementById("myechart1"));
      // 绘制图表
      var option = {
        title: {
          text: "信息数",
          textStyle: {
            color: "#1E1F38"
          },
          padding: [0, 0, 10, 15] // 位置
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          data: ["信息数量", "新增信息数量"]
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: date,
            name: "日期"
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "信息数量",
            type: "bar",
            stack: "sum",
            barWidth: 20,
            itemStyle: {
              // 图形的形状
              color: "#6693D7"
            },
            data: shop
          },
          {
            name: "新增信息数量",
            type: "bar",
            stack: "sum",
            barWidth: 20,
            itemStyle: {
              color: "#FF3332"
            },
            data: addShop
          }
        ]
      };
      myChart3.setOption(option);
    });

    indexApi
      .getUserCount()
      .then(res => {
        var data = res.data;
        var date = data.date;
        var user = data.custYesterday;
        var addUser = data.custUp;
        var myChart2 = echarts.init(document.getElementById("myechart2"));
        var option = {
          title: {
            text: "用户数",
            textStyle: {
              color: "#1E1F38"
            },
            padding: [0, 0, 10, 15]
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: ["用户数量", "新增用户数量"]
          },
          toolbox: {},
          calculable: true,
          xAxis: [
            {
              type: "category",
              data: date,
              name: "日期"
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "用户数量",
              type: "bar",
              stack: "sum2",
              barWidth: 20,
              itemStyle: {
                color: "#223146"
              },
              data: user
            },
            {
              name: "新增用户数量",
              type: "bar",
              stack: "sum2",
              barWidth: 20,
              itemStyle: {
                color: "#32FFAE"
              },
              data: addUser
            }
          ]
        };
        myChart2.setOption(option);
      })
      .catch(() => {});

    var myCharts1 = echarts.init(document.getElementById("myechart3"));
    myCharts1.setOption({
      title: {
        text: "客户分布",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        x: "left",
        data: ["未央区", "莲湖区", "高新区", "长安区", "雁塔区"]
      },
      toolbox: {
        show: true,
        feature: {
          magicType: {
            show: true,
            type: ["pie", "funnel"],
            option: {
              funnel: {
                x: "25%",
                width: "50%",
                funnelAlign: "left",
                max: 1548
              }
            }
          }
        }
      },
      calculable: true,
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: [
            { value: 335, name: "未央区" },
            { value: 310, name: "莲湖区" },
            { value: 234, name: "高新区" },
            { value: 135, name: "长安区" },
            { value: 1548, name: "雁塔区" }
          ]
        }
      ]
    });
  },

  beforeMount() {
    indexApi
      .getData()
      .then(res => {
        // 总用户数
        this.ptTradeCountDay=res.data.custCount
        // 新增用户数
        this.addCustCountToday=res.data.newCust
        // 认证用户
        this.cumulativeNumberOfCustomers=res.data.isAuth
        // 信息总数
        this.dayAmt=res.data.messageCount
        // 新增信息数
        this.addShopCountToday=res.data.newMessageCount
        // 历史信息数
        this.cumulativeNumberOfMerchants=res.data.historyMessage
      })
  }
};
</script>
<style scoped>
.myechart {
  min-width: 1000px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

#myechart1,
#myechart2,
#myechart3 {
  min-width: 400px;
  height: 350px;
}

.information {
  height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

li {
  width: 25%;
  box-sizing: border-box;
  min-width: 200px;
  padding: 10px;
  text-align: center;
}

.item {
  height: 140px;
  margin-top: 30px;
  background-color: #6693d7;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
}

.item > p {
  color: #ffffff;
  font-size: 25px;
  font-weight: bold;
  padding-top: 10px;
}
</style>
