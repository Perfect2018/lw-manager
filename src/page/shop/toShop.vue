<template>
  <el-container>
    <el-header>
      <Header>>&nbsp;商户管理</Header>
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
                <el-form-item label="商户名称">
                  <el-input size="medium" v-model="searchForm.shopName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="经营人员姓名">
                  <el-input size="medium" v-model="searchForm.operateName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="状态">
                  <el-select v-model="searchForm.state">
                    <el-option label="申请成功" value="00"></el-option>
                    <el-option label="申请中" value="01"></el-option>
                    <el-option label="申请失败" value="02"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否明星商户">
                  <el-select v-model="searchForm.isStarShop">
                    <el-option label="是" value="01"></el-option>
                    <el-option label="否" value="00"></el-option>
                    <el-option label="全部" value></el-option>
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
        <el-table class="shopTable" :data="data" :height="clientHeight-415" border>
          <el-table-column show-overflow-tooltip label="商户名称" prop="shopName"></el-table-column>
          <el-table-column show-overflow-tooltip label="经营人姓名" prop="operateName"></el-table-column>
          <el-table-column show-overflow-tooltip label="可提现金额" prop="hasAmt" :formatter="HasAmtFmt"></el-table-column>
          <el-table-column show-overflow-tooltip label="手机号码" prop="phone"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="可提现金额" prop="shopsumTotal"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            label="商户等级"
            prop="shopLevel"
            :formatter="LevelFmt"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="明星商户"
            prop="isStarShop"
            :formatter="isStarFmt"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="批发商户"
            prop="isWholesaleShop"
            :formatter="isWholesaleFmt"
          ></el-table-column>
          <!-- <el-table-column show-overflow-tooltip label="商户来源" prop="shopType" :formatter="typeFmt"></el-table-column> -->
          <el-table-column
            show-overflow-tooltip
            label="创建时间"
            prop="createDate"
            :formatter="timeFmt"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="商户状态" prop="state" :formatter="stateFmt"></el-table-column>
          <el-table-column show-overflow width="300px" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="showShop(scope.row)">查看详情</el-button>
              <el-button
                type="primary"
                size="small"
                @click="setShop(scope.$index,scope.row)"
                v-if="scope.row.shopState =='99'"
              >开启店铺</el-button>
              <el-button
                type="danger"
                size="small"
                @click="setShop(scope.$index,scope.row)"
                v-if="scope.row.shopState !='99'"
              >关闭店铺</el-button>
              <el-button
                type="danger"
                size="small"
                @click="setStar(scope.$index,scope.row)"
                v-if="scope.row.isStarShop=='01'"
              >取消明星</el-button>
              <el-button
                type="primary"
                size="small"
                @click="setStar(scope.$index,scope.row)"
                v-if="scope.row.isStarShop!='01'"
              >设为明星</el-button>
              <!-- start -->
              <el-button
                type="danger"
                size="small"
                @click="setFunds(scope.$index,scope.row)"
                v-if="scope.row.shopType=='99'"
              >取消冻结</el-button>

              <!-- end -->
              <el-button
                type="primary"
                size="small"
                @click="setFunds(scope.$index,scope.row)"
                v-if="scope.row.shopType=='01'"
              >{{scope.isStarShop}}冻结资金</el-button>
              <el-button
                type="danger"
                size="small"
                @click="setWholesale(scope.$index,scope.row)"
                v-if="scope.row.isWholesaleShop=='01'"
              >取消批发</el-button>
              <el-button
                type="primary"
                size="small"
                @click="setWholesale(scope.$index,scope.row)"
                v-if="scope.row.isWholesaleShop!='01'"
              >设为批发</el-button>
              <!-- <el-button type="primary" size="small" @click="setGrade(scope.row)">设置等级</el-button> -->
              <el-button @click="setBrand(scope.row)" type="primary" size="small">设置佣金</el-button>
              <el-button
                type="danger"
                size="small"
                @click="setChecked(scope.row)"
                v-if="scope.row.state=='01'"
              >审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          hide-on-single-page
          background
          :current-page="currentPage"
          @current-change="handlePageChange"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </el-card>
      <!-- 查看数据 -->
      <el-dialog title="商户信息" :visible.sync="showFormVisible" class="dialog-form">
        <el-form class="el_form_checked" :model="showForm" inline label-suffix>
          <el-form-item label="商户名称" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.shopName"></el-input>
          </el-form-item>
          <el-form-item label="经营人员姓名" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.operateName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="备用号码" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.phoneBack"></el-input>
          </el-form-item>
          <el-form-item label="家庭住址" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.address"></el-input>
          </el-form-item>
          <!--                    <el-form-item label="商户所在省" :label-width="formLabelWidth" class="dialog-input">-->
          <!--                    <el-input  ></el-input>-->
          <!--                </el-form-item>-->
          <!--                    <el-form-item label="商户所在市" :label-width="formLabelWidth" class="dialog-input">-->
          <!--                        <el-input  ></el-input>-->
          <!--                    </el-form-item>-->
          <!--                    <el-form-item label="商户所在县" :label-width="formLabelWidth" class="dialog-input">-->
          <!--                        <el-input ></el-input>-->
          <!--                    </el-form-item>-->
          <!--                    <el-form-item label="商户所在镇" :label-width="formLabelWidth" class="dialog-input">-->
          <!--                        <el-input  ></el-input>-->
          <!--                    </el-form-item>-->
          <!--                    <el-form-item label="商户所在村" :label-width="formLabelWidth" class="dialog-input">-->
          <!--                        <el-input  ></el-input>-->
          <!--                    </el-form-item>-->
          <!--                    <el-form-item label="商户门牌号" :label-width="formLabelWidth" class="dialog-input">-->
          <!--                        <el-input  ></el-input>-->
          <!--                    </el-form-item>-->
          <el-form-item label="商户详细地址" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.shopStreet"></el-input>
          </el-form-item>
          <el-form-item label="提现交易银行卡" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.bankCardCode"></el-input>
          </el-form-item>
          <el-form-item label="商户类型" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.shopTownCode"></el-input>
          </el-form-item>
          <el-form-item label="营业资质有效期" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.aptitudeValidDate"></el-input>
          </el-form-item>
          <el-form-item label="法人身份证号" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.operateIdcardCode"></el-input>
          </el-form-item>
          <el-form-item label="是否明星商户" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.isStarShop==='00'?'否':'是'"></el-input>
          </el-form-item>
          <el-form-item label="是否品牌商户" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="showForm.isBrandShop"></el-input>
          </el-form-item>
          <el-form-item label="商户入驻时间" :label-width="formLabelWidth" class="dialog-input">
            <el-input :value="timeF(showForm.createDate)" disabled></el-input>
          </el-form-item>
          <el-form-item label=" " :label-width="formLabelWidth" class="dialog-input"></el-form-item>
          <el-form-item label="商户生活照" :label-width="formLabelWidth" class="dialog-input">
            <div class="img-small">
              <img class="imgUrl" :src="liveImg" alt />
            </div>
          </el-form-item>
          <el-form-item label="店内照片" :label-width="formLabelWidth" class="dialog-input">
            <div class="img-small">
              <img class="imgUrl" :src="operateIdcardFmImg" alt />
            </div>
          </el-form-item>
          <el-form-item label="身份证正面照" :label-width="formLabelWidth" class="dialog-input">
            <div class="img-small">
              <img class="imgUrl" :src="operateIdcardZmImg" alt />
            </div>
          </el-form-item>
          <el-form-item label="店铺logo" :label-width="formLabelWidth" class="dialog-input">
            <div class="img-small">
              <img class="imgUrl" :src="shopLogo" alt />
            </div>
          </el-form-item>
          <el-form-item label="营业执照" :label-width="formLabelWidth" class="dialog-input">
            <div class="img-small">
              <img class="imgUrl" :src="aptitudeImg" alt />
            </div>
          </el-form-item>
          <el-form-item label="食品流通许可证" :label-width="formLabelWidth" class="dialog-input">
            <div class="img-small">
              <img class="imgUrl" :src="foodCirculationPermit" alt />
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="flag">
          <el-button type="warning" @click="reject">驳 回</el-button>
          <el-button type="success" @click="pass">通 过</el-button>
        </div>
      </el-dialog>
      <!-- 设置商户等级 -->
      <el-dialog title="设置商户等级" :visible.sync="gradeFormVisible" class="dialog-form">
        <el-form class="el_form_checked" :model="gradeForm" inline label-suffix>
          <el-form-item label="商户等级" :label-width="formLabelWidth" class="dialog-input">
            <el-select v-model="gradeForm.grade" @change="onSelected($event)">
              <el-option label="一级商户" value="7"></el-option>
              <el-option label="二级商户" value="8"></el-option>
              <el-option label="三级商户" value="9"></el-option>
              <el-option label="四级商户" value="10"></el-option>
              <el-option label="五级商户" value="11"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 设置商户佣金和合同期限-->
      <el-dialog title="设置商户佣金和合同期限" :visible.sync="brandFormVisible" class="dialog-form">
        <el-form class="el_form_checked" :model="brandForm" inline label-suffix>
          <el-form-item label="合同开始时间" :label-width="formLabelWidth" class="dialog-input">
            <el-input :value="brandForm.oldStart"></el-input>
          </el-form-item>
          <el-form-item label="合同终止时间" :label-width="formLabelWidth" class="dialog-input">
            <el-input :value="brandForm.oldEnd"></el-input>
          </el-form-item>
          <el-form-item label="佣金比率" :label-width="formLabelWidth" class="dialog-input">
            <el-input :value="brandForm.oldCommission"></el-input>
          </el-form-item>
          <p class="partition-title">客户经理信息</p>
          <el-form-item label="客户经理姓名" :label-width="formLabelWidth" class="dialog-input">
            <el-input :value="brandForm.shopSourceName"></el-input>
          </el-form-item>
          <el-form-item label="客户经理电话" :label-width="formLabelWidth" class="dialog-input">
            <el-input :value="brandForm.shopSourcePhone"></el-input>
          </el-form-item>
          <p class="partition-title">修改商户佣金和合同期限</p>
          <el-form-item label="设置商户开始期限" :label-width="formLabelWidth" class="dialog-input">
            <el-date-picker
              value-format="yyyy-MM-dd"
              v-model="brandForm.start"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="设置商户终止期限" :label-width="formLabelWidth" class="dialog-input">
            <el-date-picker
              v-model="brandForm.end"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="设置商户佣金" :label-width="formLabelWidth" class="dialog-input">
            <el-select v-model="brandForm.commission" @change="onBrandSelected($event)">
              <el-option label="0.006" value="0.006"></el-option>
              <el-option label="0.02" value="0.02"></el-option>
              <el-option label="0.025" value="0.025"></el-option>
              <el-option label="0.03" value="0.03"></el-option>
              <el-option label="0.04" value="0.04"></el-option>
              <el-option label="0.05" value="0.05"></el-option>
              <el-option label="0.06" value="0.06"></el-option>
              <el-option label="0.08" value="0.08"></el-option>
              <el-option label="0.1" value="0.1"></el-option>
            </el-select>
          </el-form-item>
          <p class="partition-title">修改客户经理和联系电话</p>
          <el-form-item label="客户经理姓名" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="brandForm.shopSourceName1"  placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="客户经理电话" :label-width="formLabelWidth" class="dialog-input">
            <el-input v-model="brandForm.shopSourcePhone1"  placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="brandFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSetBrand">确 定</el-button>
        </div>
      </el-dialog>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>

<script>
import Header from "../../components/header";
import Footer from "../../components/footer";
import toShop from "../../api/shop/toShop";
import config from "../../config/config";

export default {
  name: "toShop",
  components: {
    Footer,
    Header
  },
  props: ["clientHeight"],
  data() {
    return {
      //搜索表单
      searchForm: {
        shopName: "",
        operateName: "",
        state: "00",
        isStarShop: "01"
      },
      //查看表单
      showForm: {
        shopName: "",
        operateName: "",
        phone: "",
        phoneBack: "",
        shopStreet: "",
        shopTownCode: "",
        operateIdcardCode: "",
        address: "",
        bankCardCode: "",
        aptitudeValidDate: "",
        createDate: "",
        isWholesaleShop: "",
        isStarShop: "",
        type: ""
      },
      //设置商户等级表单
      gradeForm: {},
      //设置商户佣金和合同期限表单
      brandForm: {
        oldCommission: "",
        shopSourceName: "",
        shopSourcePhone: "",
        shopSourceName1: "",
        shopSourcePhone1: "",
        oldStart: "",
        oldEnd: "",
        commission: "",
        start: "",
        end: ""
      },
      //列表数据
      data: [],

      showFormVisible: false,
      gradeFormVisible: false,
      brandFormVisible: false,
      flag: false,
      formLabelWidth: "150px",

      producterId: "", //商户id
      liveImg: "",
      aptitudeImg: "",
      shopLogo: "",
      operateIdcardFmImg: "",
      operateIdcardZmImg: "",
      foodCirculationPermit: "",

      //临时打开店铺
      tempShop: {},
      //当前页数
      currentPage: 1,
      total: 1
    };
  },
  created() {
    this.handlePageChange();
  },
  methods: {
    //搜索
    handleSearch() {
      this.handlePageChange();
    },
    //查看详情
    showShop(row) {
      this.showFormVisible = true;
      this.showForm = Object.assign({}, row);
      this.showForm.aptitudeValidDate = new Date(
        this.showForm.aptitudeValidDate
      )
        .toLocaleDateString()
        .replace(/\//g, "-");
      this.showForm.createDate = new Date(this.showForm.createDate)
        .toLocaleDateString()
        .replace(/\//g, "-");
      if (this.showForm.isBrandShop == "01") {
        this.showForm.isBrandShop = "批发商户";
      } else {
        this.showForm.isBrandShop = "否";
      }
      if (this.showForm.isStarShop == "01") {
        this.showForm.isStarShop = "明星商户";
      } else {
        this.showForm.isStarShop = "否";
      }
      this.liveImg = `${config.baseUrl}/outByteImgById?id=${this.showForm.operateImgId}`;
      this.aptitudeImg = `${config.baseUrl}/outByteImgById?id=${this.showForm.aptitudeImgId}`;
      this.shopLogo = `${config.baseUrl}/outByteImgById?id=${this.showForm.shopLogo}`;
      this.operateIdcardFmImg = `${config.baseUrl}/outByteImgById?id=${this.showForm.operateIdcardFmImg}`;
      this.operateIdcardZmImg = `${config.baseUrl}/outByteImgById?id=${this.showForm.operateIdcardZmImg}`;
      this.foodCirculationPermit = `${config.baseUrl}/outByteImgById?id=${this.showForm.foodCirculationPermit}`;
    },
    //打开设置商户佣金和合同期限页面
    setBrand(row) {
      if (row.shopState !== "99") {
        this.brandForm = Object.assign(
          {},
          {
            oldCommission: "",
            oldStart: "",
            oldEnd: "",
            commission: "",
            start: "",
            end: "",
            shopSourceName: "",
            shopSourcePhone: ""
          }
        );
        this.tempShop = Object.assign({}, row);
        toShop.getShopExpire(row.id).then(res => {
          if (res.data) {
            // console.log(res)
            this.brandForm.oldCommission = res.data.commission
              ? res.data.commission
              : "";
            this.brandForm.oldStart = res.data.start ? res.data.start : "";
            this.brandForm.oldEnd = res.data.end ? res.data.end : "";
            this.brandForm.shopSourceName = res.data.shopSourceName ? res.data.shopSourceName : "";
            this.brandForm.shopSourcePhone = res.data.shopSourcePhone ? res.data.shopSourcePhone : "";
          }
        });
        this.brandFormVisible = true;
      } else {
        this.$message.warning("请先开启店铺，再设置合同期限");
      }
    },
    //点击确认保存商户佣金和合同期限
    handleSetBrand() {
      toShop
        .updateShopExpire(
          this.tempShop.id,
          this.brandForm.commission,
          this.brandForm.start,
          this.brandForm.end,
          this.brandForm.shopSourceName1,
          this.brandForm.shopSourcePhone1,
        )
        .then(res => {
          this.$message.success("设置商户合同成功");
          this.brandFormVisible = false;
        })
        .catch(err => {
          this.$message.error("设置商户合同失败");
        });
    },
    //打开设置用户等级页面
    setGrade(row) {
      this.tempShop = Object.assign({}, row);
      this.gradeFormVisible = true;
      this.producterId = row.id;
      //console.log(row.shopLevel);
      let grade = "";
      switch (row.shopLevel) {
        case 1:
          grade = "一级商户";
          break;
        case 2:
          grade = "二级商户";
          break;
        case 3:
          grade = "三级商户";
          break;
        case 4:
          grade = "四级商户";
          break;
        case 5:
          grade = "五级商户";
          break;
      }
      this.gradeForm = Object.assign(
        {},
        {
          grade
        }
      );
    },
    //设置商户等级(异步操作)
    onSelected(event) {
      this.gradeForm = Object.assign(
        {},
        {
          grade: event
        }
      );
      toShop.setCusGrade(event, this.tempShop.id).then(res => {
        this.$message.success("设置商户等级成功");
      });
    },
    //设置佣金选中
    onBrandSelected(event) {
      this.brandForm.commission = event;
    },
    //设置明星商户
    setFunds(index, row) {
      let temp = Object.assign({}, row);
      if (row.shopType == "01") {
        toShop.setShopType(temp.id).then(res => {
          temp.shopType = "99";
          this.data.splice(index, 1, temp);
          this.$message.success("设置成功");
        });
      } else if (row.shopType == "99") {
        toShop.cancleShopType(temp.id).then(res => {
          temp.shopType = "01";
          this.data.splice(index, 1, temp);
          this.$message.success("取消成功");
        });
      }
    },
    //设置明星商户
    setStar(index, row) {
      let temp = Object.assign({}, row);
      if (row.isStarShop == "01") {
        toShop.cancleStarShop(temp.id).then(res => {
          temp.isStarShop = "00";
          this.data.splice(index, 1, temp);
          this.$message.success("取消成功");
        });
      } else if (row.isStarShop == "00") {
        toShop.setStarShop(temp.id).then(res => {
          temp.isStarShop = "01";
          this.data.splice(index, 1, temp);
          this.$message.success("设置成功");
        });
      }
    },
    //设置 打开/关闭 店铺
    setShop(index, row) {
      console.log(111);
      let temp = Object.assign({}, row);
      console.log(temp.shopState);
      console.log(row.shopState);
      if (row.shopState == "01" || row.shopState == "00") {
        temp.shopState = "99";
        this.data.splice(index, 1, temp);
        toShop.closeShop(temp.id).then(res => {
          this.$message.success("店铺已关闭");
        });
      } else if (row.shopState == "99") {
        temp.shopState = "01";
        this.data.splice(index, 1, temp);
        toShop.openShop(temp.id).then(res => {
          this.$message.success("开店成功");
        });
      }
    },
    //设置批发商户
    setWholesale(index, row) {
      let temp = Object.assign({}, row);
      if (row.isWholesaleShop == "01") {
        temp.isWholesaleShop = "00";
        this.data.splice(index, 1, temp);
        toShop.cancleBrandShop(temp.id).then(res => {
          this.$message.success("取消批发商户成功");
        });
      } else if (row.isWholesaleShop == "00") {
        temp.isWholesaleShop = "01";
        this.data.splice(index, 1, temp);
        toShop.setBrandShop(temp.id).then(res => {
          this.$message.success("设置批发商户成功");
        });
      }
    },
    //审核
    setChecked(row) {
      this.flag = true;
      this.showFormVisible = true;
      this.passId = row.id;
      this.showForm = Object.assign({}, row);
    },
    //审核 通过
    pass() {
      toShop.pass(this.showForm.id).then(res => {
        if (res.success) {
          this.flag = false;
          this.showFormVisible = false;
          this.$message.success("操作成功");
          this.handlePageChange();
        } else {
          this.$message.success("操作失败");
        }
      });
    },
    //审核 驳回
    reject() {
      toShop.reject(this.showForm.id).then(res => {
        if (res.success) {
          this.flag = false;
          this.showFormVisible = false;
          this.$message.success("操作成功");
          this.handlePageChange();
        } else {
          this.$message.success("操作失败");
        }
      });
    },
    //根据最新页码数据
    handlePageChange(currentPage = this.currentPage) {
      this.currentPage = currentPage;
      //pageNum, shopName, operateName, state, isStarShop
      toShop
        .searchItemList(
          currentPage,
          this.searchForm.shopName,
          this.searchForm.operateName,
          this.searchForm.state,
          this.searchForm.isStarShop
        )
        .then(res => {
          let temp;
          let data = res.data.list.map(elem => {
            let temp = Object.assign(elem, elem.shop);
            delete temp.shop;
            return temp;
          });
          this.data = data;
          this.total = res.data.total;
        });
    },
    //删除数据
    handleDelete(index) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.data.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    isStarFmt(row, column, cellValue, index) {
      if (cellValue === "") {
        return cellValue;
      }
      return row.isStarShop === "01" ? "明星店铺" : "未知";
    },
    timeFmt(row, column, cellValue, index) {
      return new Date(row.createDate).toLocaleDateString().replace(/\//g, "-");
    },
    timeF(time) {
      return new Date(time).toLocaleDateString().replace(/\//g, "-");
    },
    typeFmt(row, column, cellValue, index) {
      return "前台申请";
    },
    LevelFmt(row) {
      return row.shopLevel == "1"
        ? "一级"
        : (row.shopLevel == "2"
            ? "二级"
            : row.shopLevel == "3"
            ? "三级"
            : row.shopLevel == "4"
            ? "四级"
            : "五级") + "商户";
    },
    isWholesaleFmt(row) {
      return row.isWholesaleShop == "01" ? "是" : "否";
    },
    stateFmt(row, column, cellValue, index) {
      return row.state == "00"
        ? "申请成功"
        : row.state == "01"
        ? "申请中"
        : "申请失败";
    },
    HasAmtFmt(row, column, cellValue, index) {
      return row.hasAmt ? row.hasAmt : 0;
    }
  }
};
</script>

<style lang="scss">
.showMain {
  padding: 10px;
  background-color: #e6e6e6;

  .box {
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .search-btn {
    width: 50%;
  }

  .el-form-item {
    margin: 10px 0;
  }

  .img-small {
    width: 200px;
    object-fit: fill;
  }

  .partition-title {
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 20px;
  }

  .shopTable {
    .el-button {
      margin-left: 10px;
      margin-top: 5px;
    }
  }
}
</style>