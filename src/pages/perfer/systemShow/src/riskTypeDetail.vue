<template>
    <div class="page">
        <div class="page-btn">
            <el-button type="primary" class="btn" @click="handleBack">返回</el-button>
        </div>
        <div class="main">
            <div class="main-title"><i class="line"></i>基本信息</div>
            <el-form :inline="true" class="main-form" size="small">
                <el-form-item label="报告年度:" class="main-form__item" v-if="riskType==='整体风险'">
                    <div>{{ year }}</div>
                </el-form-item>
                <el-form-item label="风险类型:" class="main-form__item">
                    <div>{{ riskType }}</div>
                </el-form-item>
                <el-form-item class="main-form__item" v-if="riskType==='整体风险'">
                    <div slot="label">
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height:18px;">
                               最优估计=（认可资产-认可负债）/最低资本
                            </div>
                            <i class="el-icon-question" ></i>
                        </el-tooltip>
                        最优估计:
                    </div>
                    <div  style="width:120px">{{showBestEvaluate}}%</div>
                    <!-- <el-input v-model="showBestEvaluate" :disabled="true" style="width:120px">
                        <template slot="append">%</template>
                    </el-input> -->
                </el-form-item>
                <el-form-item label="偿付能力充足率（风险偏好）:" class="main-form__item" v-if="riskType==='整体风险'">
                    <!-- <el-input v-model="abilityPayRate" :disabled="true"  style="width:120px">
                        <template slot="append">%</template>
                    </el-input> -->
                    <div  style="width:120px">{{abilityPayRate}}%</div>
                </el-form-item>
            </el-form>
            <template v-if="riskType==='整体风险'">
                <div>
                    <div class="main-title"><i class="line"></i>CROSS 最低资本汇总相关系数矩阵</div>
                    <el-table :data="totalRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=1>
                        <el-table-column prop="coefficient" label="相关系数" align="center">
                        </el-table-column>
                        <el-table-column label="保险风险" align="center">
                            <template slot-scope="scope">
                                <div >{{scope.row.unLifeRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="市场风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.marketRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="信用风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.creditRisk}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <div class="main-title">
                        <i class="line"></i>  
                        计算结果
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height:18px;width:300px">
                                (1)整体风险限额（偿付能力口径）=（认可资产-认可负债）/偿付能力充足率（风险偏好）-最低资本；<br/>
                                (2)某风险权重=某风险最低资本/(同级风险最低资本之和)；<br/>
                                (3)折算系数=根号下（同级各风险权重组成的矩阵*对应相关系数*同级各风险权重组成矩阵的转置）；<br/>
                                (4)某风险风险限额=上级风险限额/折算系数*某风险风险权重。
                            </div>
                            <i class="el-icon-question" style="margin-left:5px;"></i>
                        </el-tooltip>
                    </div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item class="main-form__item">
                             <div slot="label">风险限额（{{unit}}）</div>
                           <div>{{riskLimit}}</div>
                        </el-form-item>
                        <el-form-item label="折算系数：" class="main-form__item">
                            <div>{{reducedNum}}</div>
                        </el-form-item>
                    </el-form>
                    <el-table :data="totalRiskResults" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=1>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column label="保险风险" align="center" prop="unLifeRisk"></el-table-column>
                        <el-table-column label="市场风险" align="center" prop='marketRisk'></el-table-column>
                        <el-table-column label="信用风险" align="center" prop="creditRisk"></el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-else-if="riskType==='保险风险'">
                <div class="main-title"><i class="line"></i>CROSS 保险风险最低资本汇总相关系数矩阵</div>
                <el-table :data="unLifeRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=2> 
                    <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                    <el-table-column prop="rateAndPrepRisk" label="保费和准备金风险" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.rateAndPrepRisk}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="largeDisasterRisk" label="巨灾风险" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.largeDisasterRisk}}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                    <div class="main-title">
                        <i class="line"></i>
                        计算结果
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height:18px;width:300px">
                                (1)整体风险限额（偿付能力口径）=（认可资产-认可负债）/偿付能力充足率（风险偏好）-最低资本；<br/>
                                (2)某风险权重=某风险最低资本/(同级风险最低资本之和)；<br/>
                                (3)折算系数=根号下（同级各风险权重组成的矩阵*对应相关系数*同级各风险权重组成矩阵的转置）；<br/>
                                (4)某风险风险限额=上级风险限额/折算系数*某风险风险权重。
                            </div>
                            <i class="el-icon-question" style="margin-left:5px;"></i>
                        </el-tooltip>
                    </div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item  class="main-form__item">
                            <div slot="label">风险限额（{{unit}}）：</div>
                           <div>{{riskLimit}}</div>
                        </el-form-item>
                        <el-form-item label="折算系数：" class="main-form__item">
                            <div>{{reducedNum}}</div>
                        </el-form-item>
                    </el-form>
                    <el-table :data="unLifeRiskResults" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=1>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column label="保费和准备金风险" align="center" prop="rateAndPrepRisk"></el-table-column>
                        <el-table-column  label="巨灾风险" align="center" prop='largeDisasterRisk'></el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-else-if="riskType==='保费和准备金风险'">
                <div>
                <div class="main-title"><i class="line"></i>CROSS 保费和准备金风险最低资本汇总相关系数矩阵</div>
                    <el-table :data="rateAndPrepRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key='3'>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="carInsure" label="车险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.carInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="financeInsure" label="财产险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.financeInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shipInsure" label="船货特险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.shipInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="propertyInsure" label="责任险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.propertyInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="agricultrueInsure" label="农险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.agricultrueInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creditBailInsure" label="信用保证险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.creditBailInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shortYiInsure" label="短意险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.shortYiInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shortJianInsure" label="短健险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.shortJianInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shortLifeInsure" label="短寿险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.shortLifeInsure}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="othersInsure" label="其他险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.othersInsure}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <div class="main-title">
                        <i class="line"></i>
                        计算结果
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height:18px;width:300px">
                                (1)整体风险限额（偿付能力口径）=（认可资产-认可负债）/偿付能力充足率（风险偏好）-最低资本；<br/>
                                (2)某风险权重=某风险最低资本/(同级风险最低资本之和)；<br/>
                                (3)折算系数=根号下（同级各风险权重组成的矩阵*对应相关系数*同级各风险权重组成矩阵的转置）；<br/>
                                (4)某风险风险限额=上级风险限额/折算系数*某风险风险权重。
                            </div>
                            <i class="el-icon-question" style="margin-left:5px;"></i>
                        </el-tooltip>
                    </div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item class="main-form__item">
                            <div slot="label">风险限额（{{unit}}）：</div>
                            <div>{{riskLimit}}</div>
                        </el-form-item>
                        <el-form-item label="折算系数：" class="main-form__item">
                            <div>{{reducedNum}}</div>
                        </el-form-item>
                    </el-form>
                    <el-table :data="rateAndPrepRiskResults" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key='3'>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="carInsure" label="车险" align="center"></el-table-column>
                        <el-table-column prop="financeInsure" label="财产险" align="center"></el-table-column>
                        <el-table-column prop="shipInsure" label="船货特险" align="center"> </el-table-column>
                        <el-table-column prop="propertyInsure" label="责任险" align="center"></el-table-column>
                        <el-table-column prop="agricultrueInsure" label="农险" align="center"></el-table-column>
                        <el-table-column prop="creditBailInsure" label="信用保证险" align="center"></el-table-column>
                        <el-table-column prop="shortYiInsure" label="短意险" align="center"></el-table-column>
                        <el-table-column prop="shortJianInsure" label="短健险" align="center"></el-table-column>
                        <el-table-column prop="shortLifeInsure" label="短寿险" align="center"></el-table-column>
                        <el-table-column prop="othersInsure" label="其他险" align="center"> </el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-else-if="riskType==='市场风险'">
                <div>
                <div class="main-title"><i class="line"></i>CROSS 市场风险最低资本汇总相关系数矩阵</div>
                    <el-table :data="marketRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=4>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="rateRisk" label="利率风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.rateRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="profitPriceRisk" label="权益价格风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.profitPriceRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="housePriceRisk" label="房地产价格风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.housePriceRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="outIncomeRisk" label="境外固收市场风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.outIncomeRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="outProfitRisk" label="境外权益市场风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.outProfitRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="exchangeRateRisk" label="汇率风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.exchangeRateRisk}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <div class="main-title">
                        <i class="line"></i>
                        计算结果
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height:18px;width:300px">
                                (1)整体风险限额（偿付能力口径）=（认可资产-认可负债）/偿付能力充足率（风险偏好）-最低资本；<br/>
                                (2)某风险权重=某风险最低资本/(同级风险最低资本之和)；<br/>
                                (3)折算系数=根号下（同级各风险权重组成的矩阵*对应相关系数*同级各风险权重组成矩阵的转置）；<br/>
                                (4)某风险风险限额=上级风险限额/折算系数*某风险风险权重。
                            </div>
                            <i class="el-icon-question" style="margin-left:5px;"></i>
                        </el-tooltip>
                    </div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item class="main-form__item">
                           <div slot="label">风险限额（{{unit}}）：</div>
                           <div>{{riskLimit}}</div>
                        </el-form-item>
                        <el-form-item label="折算系数：" class="main-form__item">
                            <div>{{reducedNum}}</div>
                        </el-form-item>
                    </el-form>
                    <el-table :data="marketRiskResults" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=4>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="rateRisk" label="利率风险" align="center"></el-table-column>
                        <el-table-column prop="profitPriceRisk" label="权益价格风险" align="center"></el-table-column>
                        <el-table-column prop="housePriceRisk" label="房地产价格风险" align="center"></el-table-column>
                        <el-table-column prop="outIncomeRisk" label="境外固收市场风险" align="center"></el-table-column>
                        <el-table-column prop="outProfitRisk" label="境外权益市场风险" align="center"></el-table-column>
                        <el-table-column prop="exchangeRateRisk" label="汇率风险" align="center"></el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-else-if="riskType==='信用风险'">
                <div>
                    <div class="main-title"><i class="line"></i>CROSS 信用风险最低资本汇总相关系数矩阵</div>
                    <el-table :data="creditRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=5f>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="costOfCarryRisk" label="利差风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.costOfCarryRisk}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dealBreakRisk" label="交易对手违约风险" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.dealBreakRisk}}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <div class="main-title">
                        <i class="line"></i>
                        计算结果
                        <el-tooltip placement="top">
                            <div slot="content" style="line-height:18px;width:300px">
                                (1)整体风险限额（偿付能力口径）=（认可资产-认可负债）/偿付能力充足率（风险偏好）-最低资本；<br/>
                                (2)某风险权重=某风险最低资本/(同级风险最低资本之和)；<br/>
                                (3)折算系数=根号下（同级各风险权重组成的矩阵*对应相关系数*同级各风险权重组成矩阵的转置）；<br/>
                                (4)某风险风险限额=上级风险限额/折算系数*某风险风险权重。
                            </div>
                            <i class="el-icon-question" style="margin-left:5px;"></i>
                        </el-tooltip>
                    </div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item class="main-form__item">
                          <div slot="label">风险限额（{{unit}}）：</div>
                           <div>{{riskLimit}}</div>
                        </el-form-item>
                        <el-form-item label="折算系数：" class="main-form__item">
                            <div>{{reducedNum}}</div>
                        </el-form-item>
                    </el-form>
                    <el-table :data="creditRiskResults" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=5f>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="costOfCarryRisk" label="利差风险" align="center"></el-table-column>
                        <el-table-column prop="dealBreakRisk" label="交易对手违约风险" align="center"></el-table-column>
                    </el-table>
                </div>
            </template>
            <template v-else-if="isShowTextarea">
                <div class="main-title"><i class="line"></i>风险限额</div>
                <el-form label-width="100px">
                    <el-form-item label="风险限额：">
                        <template v-if="riskType==='操作风险'">
                            <div class="main-text">{{operRisk}}</div>
                        </template>
                        <template v-if="riskType==='声誉风险'">                  
                            <div class="main-text">{{fameRisk}}</div>
                        </template>
                        <template v-if="riskType==='战略风险'">
                            <div class="main-text">{{strategyRisk}}</div>
                        </template>
                        <template v-if="riskType==='流动性风险'">
                            <div class="main-text">{{flowRisk}}</div>
                        </template>
                    </el-form-item>
                </el-form>
            </template>
            <template v-else>
                <div class="main-title"><i class="line"></i>风险限额</div>
                <el-form label-width="120px">
                    <el-form-item> 
                        <div slot="label">风险限额（{{unit}}）：</div>
                        <div class="main-text">{{riskLimit}}</div>
                    </el-form-item>
                </el-form>
            </template>
        </div>
    </div>
</template>

<script>
import Enum from '../../../../assets/js/Enum';
import {fomatFloat, numFormat} from 'src/utils/utils.js'
// function keepTwoDecimalFull(num) {
//    var result = parseFloat(num);
   
//    if (isNaN(result)) {
       
//      return num;
//    }
//    result = Math.round(num * 100) / 100;
//    var s_x = result.toString();
//    var pos_decimal = s_x.indexOf('.');
//    if (pos_decimal < 0) {
//      pos_decimal = s_x.length;
//      s_x += '.';
//    }
//    while (s_x.length <= pos_decimal + 2) {
//      s_x += '0';
//    }
//    return comma(s_x);
// }
// function comma(num) {
//     var source = String(num).split(".");//按小数点分成2部分
//         source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)','ig'),"$1,");//只将整数部分进行都好分割
//     return source.join(".");//再将小数部分合并进来
// }
export default {
    props:{
        year:{
            type:Number,
            required:true
        },
        riskType:{
            type:String,
            required:true
        },
        unit:{
            type:String,
            required:true 
        }
    },
    data(){
        return {
            abilityPayRate:'',
            bestEvaluate:'',
            showBestEvaluate:'',
            // 整体风险
            totalRisk:Enum.totalRisk,
            // 保险风险矩阵
            unLifeRisk:Enum.unLifeRisk,
            // 保费和准备金风险
            rateAndPrepRisk:Enum.rateAndPrepRisk,
            // 市场风险
            marketRisk:Enum.marketRisk,
            creditRisk:Enum.creditRisk,
            operRisk:'', 
            fameRisk:'',
            strategyRisk:'',
            flowRisk:'',
            riskObj:Enum.riskObj,
            riskLimit:'',
            riskLimitList:[],
            reductionFactor:[],
            reducedNum:'',
            // 整体风险
            totalRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList',unLifeRisk:'', marketRisk:'', creditRisk:'' },
                { coefficient:`风险限额（${this.unit}）`, key:'riskLimitList',unLifeRisk:'', marketRisk:'', creditRisk:'' },
            ],
            // 保险风险矩阵
            unLifeRiskResults:[
                { coefficient:"权重（精度10）",key:'weightList', rateAndPrepRisk:'', largeDisasterRisk:''},
                { coefficient:`风险限额（${this.unit}）`, key:'riskLimitList',rateAndPrepRisk:'', largeDisasterRisk:'' }
            ],
            // 保费和准备金风险
            rateAndPrepRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList',carInsure:'', financeInsure:'', shipInsure:'',propertyInsure:'',agricultrueInsure:'',creditBailInsure:'',shortYiInsure:'',shortJianInsure:'',shortLifeInsure:'',othersInsure:'' },
                { coefficient:`风险限额（${this.unit}）`, key:'riskLimitList',carInsure:'', financeInsure:'', shipInsure:'',propertyInsure:'',agricultrueInsure:'',creditBailInsure:'',shortYiInsure:'',shortJianInsure:'',shortLifeInsure:'',othersInsure:'' },
                
            ],
            // 市场风险
            marketRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList', rateRisk:'', profitPriceRisk:'', housePriceRisk:'', outIncomeRisk:'', outProfitRisk:'', exchangeRateRisk:'' },
                { coefficient:`风险限额（${this.unit}）`, key:'riskLimitList', rateRisk:'', profitPriceRisk:'', housePriceRisk:'', outIncomeRisk:'', outProfitRisk:'', exchangeRateRisk:'' },
            ],
            creditRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList', costOfCarryRisk:'', dealBreakRisk:''},
                { coefficient:`风险限额（${this.unit}）`, key:'riskLimitList', costOfCarryRisk:'', dealBreakRisk:'' }
            ],
            riskPrefModelHistory:[],
        }
    },
    computed:{
        isShowTextarea(){
            return this.riskType==='操作风险'||this.riskType==='声誉风险'||this.riskType==='战略风险'||this.riskType==='流动性风险'
        },
    },
    beforeMount(){
        this.getRiskTypeDetail();
    },
    methods:{
        handleBack() {
            this.$emit('handleBack')
        },
        getRiskTypeDetail(){
            const params={
                unit:this.unit,
                riskType:this.riskType,
                year:this.year,
                applyObject:'中华财险'
            }
            this.axios.get('riskPrefModel/querySysShowDetail',{params})
            .then(res=>{
                if(res.code===200){
                    let queryDetail=res.data.queryDetail;
                    if(queryDetail){
                        this.handleResult(queryDetail);
                    }
                }else{
                     this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            }).catch((response) => {
                console.log(response)
                this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
        },
        handleList(list,queryDetail,flag){
            list.forEach(item=>{
                for(let i in item){
                    if(i!=='coefficient'&& i!=='key'){
                        if(flag){
                            if(queryDetail[item.key][i].includes('0E')){
                                queryDetail[item.key][i]='0';
                            }
                            if(item.key==='weightList'){
                                item[i]=this.handleNum(queryDetail[item.key][i])+'%';
                                // item[i]=keepTwoDecimalFull(queryDetail[item.key][i])+'%';
                            }else{
                                item[i]=this.handleNum(queryDetail[item.key][i]);
                                // item[i]=keepTwoDecimalFull(queryDetail[item.key][i]);
                            }
                           
                        }else{
                            item[i]= queryDetail[item.key][i];
                        }
                    }
                }
            })
        },
        handleNum(num){
            if(fomatFloat(num,2)){
                return numFormat(num)
            }
            return num
        },
        handleResult(queryDetail){
            this.abilityPayRate=queryDetail.abilityPayRate;
            let bestEvaluate=queryDetail.bestEvaluate.includes('0E')?'0':queryDetail.bestEvaluate;
            this.showBestEvaluate=this.handleNum(bestEvaluate);
            this.bestEvaluate=bestEvaluate;
            this.handleList(this.totalRisk,queryDetail);
            this.handleList(this.unLifeRisk,queryDetail);
            this.handleList(this.rateAndPrepRisk,queryDetail);
            this.handleList(this.marketRisk,queryDetail);
            this.handleList(this.creditRisk,queryDetail);
            if(queryDetail.weightList){
            // 处理计算结果矩阵
                this.handleList(this.totalRiskResults,queryDetail,1);
                this.handleList(this.unLifeRiskResults,queryDetail,1);
                this.handleList(this.rateAndPrepRiskResults,queryDetail,1);
                this.handleList(this.marketRiskResults,queryDetail,1);
                this.handleList(this.creditRiskResults,queryDetail,1);
            }
            this.operRisk=queryDetail.riskLimitList.operRisk;
            this.fameRisk=queryDetail.riskLimitList.fameRisk;
            this.strategyRisk=queryDetail.riskLimitList.strategyRisk;
            this.flowRisk=queryDetail.riskLimitList.flowRisk;
            this.riskLimitList=queryDetail.riskLimitList;
            this.reductionFactor=queryDetail.reductionFactor
            this.riskLimit=this.handleNum(this.riskLimitList[this.riskObj[this.riskType]]);
            this.reducedNum=this.handleNum(this.reductionFactor[this.riskObj[this.riskType]]);
        }
    }
   
}
</script>

<style lang="scss" scoped>
.txtColor{
    /deep/ .el-breadcrumb__inner{
        color: #4285F4 ;
        font-weight: 700 ;
    }  
}
.page{
    position: relative;
    padding-bottom:30px;
    &-btn{
        display: flex;
        justify-content: flex-end;
        top:-45px;
        right:0;
        position: absolute;
        .btn{
            width: 80px;
            height: 26px;
            padding:0;
            margin-right:27px;
        }
    }
}
.el-icon-question{
    font-size:18px;
    color: #4285F4;
}
.main{
    position: relative;
    padding-bottom:30px;
    background: #fff;
    padding: 16px;
    box-shadow: 4px 2px 6px #888;
    border-radius: 8px;
    &-title{
        font-size:14px;
        margin-bottom:30px;
        font-weight:600;
        display: flex;
        align-items: center;
        .line{
            display: inline-block;
            width: 2px;
            height: 14px;
            background: #4285F4;
            // vertical-align: middle;
            margin-right: 6px;
        }
    }
    &-form{
        display: flex;
        &__item{
            margin-right:100px;
        }
    }
    &-table{
        background:#f9f9f9;
        border: 1px solid #E9E9E9;
        margin-bottom:20px;
    }
    &-text{
        padding:6px 0;
        word-break: break-all;
        line-height: 30px;
    }
}
</style>