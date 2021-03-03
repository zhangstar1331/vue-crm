<template>
    <div class="page">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height: 53px;">
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好管理</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                <span style="color: #909191 !important;font-weight: 700 !important">风险偏好传导体系</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item class="txtColor">偏好模型管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main" style="margin-top: 0px; min-height:20px;">
            <div class="main-btn">
                <el-button type="primary" class="btn" @click="handleTrial" v-if="!isDetail">计算</el-button>
                <el-button type="primary" class="btn" @click="handleSubmit" v-if="!isDetail">提交</el-button>
                <el-button type="primary" class="btn" @click="handleBack">返回</el-button>
            </div>
            <div>
                <div class="main-title"><i></i>偏好模型管理</div>
                <div class="info-body">
                    <el-form :inline="true" class="main-form" label-width="100px" size="small">
                        <el-form-item label="风险类型：" class="main-form__item">
                            <el-popover
                                placement="bottom"
                                width="250"
                                v-model="isVisible">
                                <el-tree
                                    style="height:300px;overflow-y:scroll"
                                    class="filter-tree"
                                    :data="treeData"
                                    :props="defaultProps"
                                    :expand-on-click-node="false"
                                    default-expand-all
                                    @node-click="handleNodeClick"
                                    ref="tree">
                                </el-tree>
                                <el-input
                                    placeholder="请选择"
                                    slot="reference"
                                    style="width:260px;"
                                    size="small"
                                    @click="isVisible = !isVisible"
                                    v-model="riskType">
                                    <i slot="suffix" :class="isVisible?'el-icon-arrow-up':'el-icon-arrow-down'" ></i>
                                </el-input>
                            </el-popover>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="main">
            <template v-if="riskType==='整体风险'">
                <div>
                    <div class="main-title"><i></i>基本信息</div>
                    <el-form :inline="true" class="main-form" size="small">
                        <el-form-item label="报告年度:" class="main-form__item">
                            <div>{{ reportYear }}</div>
                        </el-form-item>
                        <el-form-item label="最优估计:" class="main-form__item">
                            <!-- <el-input v-model="showBestEvaluate" :disabled="true">
                                <div slot="append">%</div>
                            </el-input> -->
                            <div>{{showBestEvaluate}}%</div>
                        </el-form-item>
                        <el-form-item label="偿付能力充足率（风险偏好）:" class="main-form__item">
                            <el-input v-model.trim="abilityPayRate"  v-if="!isDetail">
                                <div slot="append">%</div>
                            </el-input>
                            <div v-else>{{abilityPayRate}}%</div>
                        </el-form-item>
                    </el-form>
                    <div class="main-title"><i></i>CROSS 最低资本汇总相关系数矩阵</div>
                    <el-table :data="totalRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=1>
                        <el-table-column prop="coefficient" label="相关系数" align="center">
                        </el-table-column>
                        <el-table-column label="保险风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.unLifeRisk}}</div>
                                <el-input v-model.trim="scope.row.unLifeRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column  label="市场风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.marketRisk}}</div>
                                <el-input v-model.trim="scope.row.marketRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="信用风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.creditRisk}}</div>
                                <el-input v-model.trim="scope.row.creditRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="isShowResult">
                    <div class="main-title"><i></i>计算结果</div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item label="风险限额（万元）:" class="main-form__item">
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
                <div class="main-title"><i></i>CROSS 保险风险最低资本汇总相关系数矩阵</div>
                <el-table :data="unLifeRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=2> 
                    <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                    <el-table-column prop="rateAndPrepRisk" label="保费和准备金风险" align="center">
                        <template slot-scope="scope">
                            <div v-if="isDetail">{{scope.row.rateAndPrepRisk}}</div>
                            <el-input v-model.trim="scope.row.rateAndPrepRisk" size="small" v-else></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="largeDisasterRisk" label="巨灾风险" align="center">
                        <template slot-scope="scope">
                            <div v-if="isDetail">{{scope.row.largeDisasterRisk}}</div>
                            <el-input v-model.trim="scope.row.largeDisasterRisk" size="small" v-else></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-if="isShowResult">
                    <div class="main-title"><i></i>计算结果</div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item label="风险限额（万元）:" class="main-form__item">
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
                <div class="main-title"><i></i>CROSS 保费和准备金风险最低资本汇总相关系数矩阵</div>
                    <el-table :data="rateAndPrepRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key='3'>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="carInsure" label="车险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.carInsure}}</div>
                                <el-input v-model.trim="scope.row.carInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="financeInsure" label="财产险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.financeInsure}}</div>
                                <el-input v-model.trim="scope.row.financeInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shipInsure" label="船货特险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.shipInsure}}</div>
                                <el-input v-model.trim="scope.row.shipInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="propertyInsure" label="责任险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.propertyInsure}}</div>
                                <el-input v-model.trim="scope.row.propertyInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="agricultrueInsure" label="农险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.agricultrueInsure}}</div>
                                <el-input v-model.trim="scope.row.agricultrueInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creditBailInsure" label="信用保证险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.creditBailInsure}}</div>
                                <el-input v-model.trim="scope.row.creditBailInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shortYiInsure" label="短意险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.shortYiInsure}}</div>
                                <el-input v-model.trim="scope.row.shortYiInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shortJianInsure" label="短健险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.shortJianInsure}}</div>
                                <el-input v-model.trim="scope.row.shortJianInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shortLifeInsure" label="短寿险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.shortLifeInsure}}</div>
                                <el-input v-model.trim="scope.row.shortLifeInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="othersInsure" label="其他险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.othersInsure}}</div>
                                <el-input v-model.trim="scope.row.othersInsure" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="isShowResult">
                    <div class="main-title"><i></i>计算结果</div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item label="风险限额（万元）:" class="main-form__item">
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
                <div class="main-title"><i></i>CROSS 市场风险最低资本汇总相关系数矩阵</div>
                    <el-table :data="marketRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=4>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="rateRisk" label="利率风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.rateRisk}}</div>
                                <el-input v-model.trim="scope.row.rateRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="profitPriceRisk" label="权益价格风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.profitPriceRisk}}</div>
                                <el-input v-model.trim="scope.row.profitPriceRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="housePriceRisk" label="房地产价格风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.housePriceRisk}}</div>
                                <el-input v-model.trim="scope.row.housePriceRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="outIncomeRisk" label="境外固收市场风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.outIncomeRisk}}</div>
                                <el-input v-model.trim="scope.row.outIncomeRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="outProfitRisk" label="境外权益市场风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.outProfitRisk}}</div>
                                <el-input v-model.trim="scope.row.outProfitRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="exchangeRateRisk" label="汇率风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.exchangeRateRisk}}</div>
                                <el-input v-model.trim="scope.row.exchangeRateRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="isShowResult">
                    <div class="main-title"><i></i>计算结果</div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item label="风险限额（万元）:" class="main-form__item">
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
                    <div class="main-title"><i></i>CROSS 信用风险最低资本汇总相关系数矩阵</div>
                    <el-table :data="creditRisk" :header-cell-style="{ background: '#f5f7fa'}" class="main-table" key=5f>
                        <el-table-column prop="coefficient" label="相关系数" align="center"></el-table-column>
                        <el-table-column prop="costOfCarryRisk" label="利差风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.costOfCarryRisk}}</div>
                                <el-input v-model.trim="scope.row.costOfCarryRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dealBreakRisk" label="交易对手违约风险" align="center">
                            <template slot-scope="scope">
                                <div v-if="isDetail">{{scope.row.dealBreakRisk}}</div>
                                <el-input v-model.trim="scope.row.dealBreakRisk" size="small" v-else></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="isShowResult">
                    <div class="main-title"><i></i>计算结果</div>
                     <el-form :inline="true" class="main-form">
                        <el-form-item label="风险限额（万元）:" class="main-form__item">
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
                <div class="main-title"><i></i>风险限额</div>
                <el-form label-width="100px">
                    <el-form-item label="风险限额：">
                        <template v-if="riskType==='操作风险'">
                            <el-input v-model.trim="operRisk"  type="textarea" :rows="3" placeholder="请输入该类风险风险限额" v-if="!isDetail"></el-input>
                            <div v-else class="main-text">{{operRisk}}</div>
                        </template>
                        <template v-if="riskType==='声誉风险'">
                           <el-input v-model.trim="fameRisk"  type="textarea" :rows="3" placeholder="请输入该类风险风险限额" v-if="!isDetail"></el-input>
                            <div v-else class="main-text">{{fameRisk}}</div>
                        </template>
                        <template v-if="riskType==='战略风险'">
                            <el-input v-model.trim="strategyRisk"  type="textarea" :rows="3" placeholder="请输入该类风险风险限额" v-if="!isDetail"></el-input>
                            <div v-else class="main-text">{{strategyRisk}}</div>
                        </template>
                        <template v-if="riskType==='流动性风险'">
                           <el-input v-model.trim="flowRisk"  type="textarea" :rows="3" placeholder="请输入该类风险风险限额" v-if="!isDetail"></el-input>
                            <div v-else class="main-text">{{flowRisk}}</div>
                        </template>
                    </el-form-item>
                </el-form>
            </template>
            <template v-else>
                <div class="main-title"><i></i>风险限额</div>
                <el-form label-width="100px">
                    <el-form-item label="风险限额："> 
                        <div>{{riskLimit}}</div>
                    </el-form-item>
                </el-form>
            </template>
        </div>
        <div class="main" v-if="isDetail" style="">
            <div class="main-title"><i></i>版本记录</div>
             <el-table :data="riskPrefModelHistory" class="main-table" :header-cell-style="{ background: '#f5f7fa'}"> 
                <el-table-column type="index" label="序号" align='center'></el-table-column>
                <el-table-column label="风险偏好模型版本" align='center' :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <div @click="goDetail(scope.row)" class="row-title">{{scope.row.reportYear}}风险偏好模型</div>
                        </template>
                </el-table-column>
                <el-table-column prop="creator" label="报送人员"  align='center'></el-table-column>
                <el-table-column prop="_createDate" label="报送时间"  align='center'></el-table-column>
                <el-table-column prop="_updateDate" label="维护时间"  align='center'></el-table-column>
                </el-table>           
        </div>
    </div>
</template>

<script>
function getDate(date){
    date = date*1000;
    var time = new Date(date);
    var year= time.getFullYear()  //年
    var month = ("0" + (time.getMonth() + 1)).slice(-2); //月
    var day = ("0" + time.getDate()).slice(-2); //日
    var hour = ("0" + time.getHours()).slice(-2);
    var minute = ("0" + time.getMinutes()).slice(-2);
    var second = ("0" + time.getSeconds()).slice(-2);
    var mydate = year + "-" + month + "-" + day + ' ' + hour + ":" + minute + ':' + second;
    return mydate
}
import Enum from '../../../assets/js/Enum.js'
import {fomatFloat, numFormat} from 'src/utils/utils.js'

export default {
    data(){
        return {
            defaultProps: {
                children: 'children',
                label: 'riskName'
            },
            riskType:'整体风险',
            abilityPayRate:'',
            bestEvaluate:'',
            showBestEvaluate:'',
            isVisible:false,
            treeData:[],
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
                { coefficient:"风险限额（万元）", key:'riskLimitList',unLifeRisk:'', marketRisk:'', creditRisk:'' },
            ],
            // 保险风险矩阵
            unLifeRiskResults:[
                { coefficient:"权重（精度10）",key:'weightList', rateAndPrepRisk:'', largeDisasterRisk:''},
                { coefficient:"风险限额（万元）", key:'riskLimitList',rateAndPrepRisk:'', largeDisasterRisk:'' }
            ],
            // 保费和准备金风险
            rateAndPrepRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList',carInsure:'', financeInsure:'', shipInsure:'',propertyInsure:'',agricultrueInsure:'',creditBailInsure:'',shortYiInsure:'',shortJianInsure:'',shortLifeInsure:'',othersInsure:'' },
                { coefficient:"风险限额（万元）", key:'riskLimitList',carInsure:'', financeInsure:'', shipInsure:'',propertyInsure:'',agricultrueInsure:'',creditBailInsure:'',shortYiInsure:'',shortJianInsure:'',shortLifeInsure:'',othersInsure:'' },
                
            ],
            // 市场风险
            marketRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList', rateRisk:'', profitPriceRisk:'', housePriceRisk:'', outIncomeRisk:'', outProfitRisk:'', exchangeRateRisk:'' },
                { coefficient:"风险限额（万元）", key:'riskLimitList', rateRisk:'', profitPriceRisk:'', housePriceRisk:'', outIncomeRisk:'', outProfitRisk:'', exchangeRateRisk:'' },
            ],
            creditRiskResults:[
                { coefficient:"权重（精度10）", key:'weightList', costOfCarryRisk:'', dealBreakRisk:''},
                { coefficient:"风险限额（万元）", key:'riskLimitList', costOfCarryRisk:'', dealBreakRisk:'' }
            ],
            riskPrefModelHistory:[],
            isCount:false
        }
    },
    computed:{
        isShowTextarea(){
            return this.riskType==='操作风险'||this.riskType==='声誉风险'||this.riskType==='战略风险'||this.riskType==='流动性风险'
        },
        reportYear(){
            return this.$route.query.year;
        },
        type(){
            return +this.$route.query.type;
        },
        isDetail(){
            return this.$route.query.type==='3';
        },
        isShowResult(){
            return this.$route.query.type==='3'||this.isCount;
        }
    },
    beforeMount(){
        this.getRiskType();
        this.getRiskTypeDetail();
    },
    methods:{
        handleBack() {
            this.$router.back();
        },
        getRiskType(){
            let params={
                year:this.reportYear
            }
            this.axios.get('riskPrefModel/queryRiskType',{ params })
            .then(res=>{
                if(res.code===200){
                    let riskTypeList=res.data.riskTypeList;
                    let treeData=[];
                    riskTypeList.forEach(item => {
                        if(item.parentId==='0'){
                            treeData.push(item)
                        }
                        let parent=riskTypeList.find(ele=>ele.id===item.parentId);
                        if(parent){
                            if(parent.children){
                                parent.children.push(item)
                            }else{
                                 parent.children=[]
                                parent.children.push(item)
                            }
                        }
                    });
                    this.treeData=treeData;
                }else{
                     this.$alert(res.message, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            }).catch((response) => {
                this.$alert('操作失败', '提示', {
                    confirmButtonText: '确定'
                });
            })
        },
        getRiskTypeDetail(){
            const params={
                id:'1_rtotal',
                year:this.reportYear,
                applyObject:'中华财险'
            }
            if(this.type===1){
                params.flag='add';
            }
            this.axios.get('riskPrefModel/queryDetail',{params})
            .then(res=>{
                if(res.code===200){
                    let queryDetail=res.data.queryDetail;
                    if(queryDetail){
                        this.riskPrefModelHistory=res.data.riskPrefModelHistory.reverse();
                        this.riskPrefModelHistory.forEach(item=>{
                            if(item.createDate){
                                item._createDate = getDate(item.createDate);
                            }
                            if(item.updateDate){
                                item._updateDate = getDate(item.updateDate);
                            }
                        })
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
        checkParams(){
            if(!this.abilityPayRate){
                return '请填写偿付能力充足率（风险偏好）'
            }
            let reg=/^(-?\d+)(\.\d+)?$/;
            if(!reg.test(this.abilityPayRate)){
                return '偿付能力充足率（风险偏好格式不正确'
            }
            if(this.checkHasEmpty(this.totalRisk)){
                return '整体风险矩阵填写不完整'
            }
            if(this.checkHasEmpty(this.unLifeRisk)){
                return '保险风险矩阵填写不完整'
            }
            if(this.checkHasEmpty(this.rateAndPrepRisk)){
                return '保费和准备金风险矩阵填写不完整'
            }
            if(this.checkHasEmpty(this.marketRisk)){
                return '市场风险矩阵填写不完整'
            }
            if(this.checkHasEmpty(this.creditRisk)){
                return '信用风险矩阵填写不完整'
            }

             if(this.checkRight(this.totalRisk)){
                return '整体风险矩阵格式不正确'
            }
            if(this.checkRight(this.unLifeRisk)){
                return '保险风险矩阵格式不正确'
            }
            if(this.checkRight(this.rateAndPrepRisk)){
                return '保费和准备金风险矩阵格式不正确'
            }
            if(this.checkRight(this.marketRisk)){
                return '市场风险矩阵格式不正确'
            }
            if(this.checkRight(this.creditRisk)){
                return '信用风险矩阵格式不正确'
            }
            return ''

        },
        checkRight(ary){
            let isRight=false;
             let reg=/^(-?\d+)(\.\d+)?$/;
             ary.forEach(item=>{
                for(let key in item){
                    if(item.hasOwnProperty(key)&&key!=='key'&&key!=='coefficient'){
                        if(!reg.test(item[key])){
                            isRight=true;
                        }
                    }
                }
            })
            return isRight;
        },
        checkHasEmpty(ary){
            let isEmpty=false;
            ary.forEach(item=>{
                for(let key in item){
                    if(item.hasOwnProperty(key)){
                        if(item[key]===''){
                            isEmpty=true
                        }
                    }
                }
            })
            return isEmpty;
        },
        handleTrial(){
            let msg=this.checkParams();
            if(msg) {
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定'
                });
                return false;
            }
             const params={
                abilityPayRate:this.abilityPayRate,
                bestEvaluate:this.bestEvaluate,
                reportYear:this.reportYear,
                applyObject:'中华财险'
            };
            let totalRiskList=this.handleAryToObj(this.totalRisk);
            let unLifeRiskList=this.handleAryToObj(this.unLifeRisk);
            let rateAndPrepRiskList=this.handleAryToObj(this.rateAndPrepRisk);
            let marketRiskList=this.handleAryToObj(this.marketRisk);
            let creditRiskList=this.handleAryToObj(this.creditRisk);
            params.riskLimitList={
                operRisk:this.operRisk,
                fameRisk:this.fameRisk,
                strategyRisk:this.strategyRisk,
                flowRisk:this.flowRisk
            };
            Object.assign(params,totalRiskList,unLifeRiskList,rateAndPrepRiskList,marketRiskList,creditRiskList);
            // return false
            this.$alert('请确认相关性矩阵已经全部录入或更新完毕，否则计算结果不准确。', '提示', {
                confirmButtonText: '确定',
                cancelButtonText:'取消',
                showCancelButton: true,
                callback:(action)=>{
                    if(action==='confirm'){
                        this.axios.post('riskPrefModel/trial',JSON.stringify(params),{headers:{'Content-Type':'application/json'}})
                        .then(res=>{
                            if(res.code===200){
                                this.isCount=true;
                                let queryDetail=res.data;
                                this.handleResult(queryDetail);
                            }else{
                                this.$alert(res.message, '提示', {
                                    confirmButtonText: '确定'
                                });
                            }
                        }).catch((response) => {
                            this.$alert('操作失败', '提示', {
                                confirmButtonText: '确定'
                            });
                        })
                    }
                }
            });
        },
        handleSubmit() {
            let msg=this.checkParams();
            if(msg) {
                this.$alert(msg, '提示', {
                    confirmButtonText: '确定'
                });
                return false;
            }
             const params={
                abilityPayRate:this.abilityPayRate,
                bestEvaluate:this.bestEvaluate,
                reportYear:this.reportYear,
                applyObject:'中华财险'
            };
            let totalRiskList=this.handleAryToObj(this.totalRisk);
            let unLifeRiskList=this.handleAryToObj(this.unLifeRisk);
            let rateAndPrepRiskList=this.handleAryToObj(this.rateAndPrepRisk);
            let marketRiskList=this.handleAryToObj(this.marketRisk);
            let creditRiskList=this.handleAryToObj(this.creditRisk);
            params.riskLimitList={
                operRisk:this.operRisk,
                fameRisk:this.fameRisk,
                strategyRisk:this.strategyRisk,
                flowRisk:this.flowRisk
            };
            Object.assign(params,totalRiskList,unLifeRiskList,rateAndPrepRiskList,marketRiskList,creditRiskList);
            let url=this.type===1?'riskPrefModel/addPrefModel':'riskPrefModel/editPrefModel';
             this.axios.post(url,JSON.stringify(params),{headers:{'Content-Type':'application/json'}})
            .then(res=>{
                if(res.code===200){
                    this.$router.push({name:'modelManagement'})
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
        handleNodeClick(node) {
            this.isVisible = false;
            this.riskType = node.riskName;
            this.riskLimit= this.handleNum(this.riskLimitList[this.riskObj[this.riskType]]);
            this.reducedNum=this.handleNum(this.reductionFactor[this.riskObj[this.riskType]]);
        },
        handleAryToObj(ary){
            let obj={};
            ary.forEach(item=>{
                let value=JSON.parse(JSON.stringify(item));
                Reflect.deleteProperty(value, 'key');
                Reflect.deleteProperty(value, 'coefficient')
                obj[item.key]=value;
            })
            return obj
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
                            }else{
                                item[i]=this.handleNum(queryDetail[item.key][i]);
                            }
                           
                        }else{
                            item[i]= queryDetail[item.key][i];
                        }
                    }
                }
            })
        },
        goDetail(row){
            this.riskType='整体风险'
            const params={id:row.id,applyObject:'中华财险'};
            this.axios.get('riskPrefModel/queryHistoryDetail',{params})
            .then(res=>{
                if(res.code===200){
                    let riskModelHistoryDetail=res.data.riskModelHistoryDetail;
                    this.handleResult(riskModelHistoryDetail)
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
        },
        handleNum(num){
            if(fomatFloat(num,2)){
                return numFormat(num)
            }
            return num
        },
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
    padding-bottom:20px;
}
.main{
    position: relative;
    padding-bottom:30px;
    background: #fff;
    padding: 16px;
     margin-top: 20px;
    box-shadow: 4px 2px 6px #888;
    border-radius: 8px;
    &-btn{
        position: absolute;
        display: flex;
        top:-45px;
        right: 0;
        justify-content: flex-end;
        margin-bottom:20px;
        .btn{
            
            height: 26px;
            padding:0 20px;
            margin-right:27px;
        }  
    }
    &-title{
        font-size:14px;
        margin-bottom:30px;
        font-weight:600;
        display: flex;
        align-items: center;
        i{
            display: inline-block;
            width: 2px;
            height: 14px;
            background: #4285F4;
            vertical-align: middle;
            margin-right: 6px;
        }
    }
    &-text{
        word-break: break-all;
        line-height:30px;
    }
    &-form{
        display: flex;
        &__item{
            margin-right:150px;
        }
    }
    &-table{
        background:#f9f9f9;
        border: 1px solid #E9E9E9;
        margin-bottom:20px;
        .row-title{
            cursor: pointer;
            color:#4285F4;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
        }
    }
}
/deep/ .el-input-group__append{
    padding:0 5px;
    background-color: #F5F7FA;
    color: #909399;
}
</style>