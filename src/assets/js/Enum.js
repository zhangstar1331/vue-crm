export default {
     // 整体风险
  totalRisk: [
        { coefficient: '保险风险', key: 'unLifeRiskList', unLifeRisk: '', marketRisk: '', creditRisk: '' },
        { coefficient: '市场风险', key: 'marketRiskList', unLifeRisk: '', marketRisk: '', creditRisk: '' },
        { coefficient: '信用风险', key: 'creditRiskList', unLifeRisk: '', marketRisk: '', creditRisk: '' }
  ],
    // 保险风险矩阵
  unLifeRisk: [
        { coefficient: '保费和准备金风险', key: 'rateAndPrepRiskList', rateAndPrepRisk: '', largeDisasterRisk: '' },
        { coefficient: '巨灾风险', key: 'largeDisasterRiskList', rateAndPrepRisk: '', largeDisasterRisk: '' }
  ],
    // 保费和准备金风险
  rateAndPrepRisk: [
        { coefficient: '车险', key: 'carInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '财产险', key: 'financeInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '船货特险', key: 'shipInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '责任险', key: 'propertyInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '农险', key: 'agricultrueInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '信用保证险', key: 'creditBailInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '短意险', key: 'shortYiInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '短健险', key: 'shortJianInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '短寿险', key: 'shortLifeInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' },
        { coefficient: '其他险', key: 'othersInsureList', carInsure: '', financeInsure: '', shipInsure: '', propertyInsure: '', agricultrueInsure: '', creditBailInsure: '', shortYiInsure: '', shortJianInsure: '', shortLifeInsure: '', othersInsure: '' }
  ],
    // 市场风险
  marketRisk: [
        { coefficient: '利率风险', key: 'rateRiskList', rateRisk: '', profitPriceRisk: '', housePriceRisk: '', outIncomeRisk: '', outProfitRisk: '', exchangeRateRisk: '' },
        { coefficient: '权益价格风险', key: 'profitPriceRiskList', rateRisk: '', profitPriceRisk: '', housePriceRisk: '', outIncomeRisk: '', outProfitRisk: '', exchangeRateRisk: '' },
        { coefficient: '房地产价格风险', key: 'housePriceRiskList', rateRisk: '', profitPriceRisk: '', housePriceRisk: '', outIncomeRisk: '', outProfitRisk: '', exchangeRateRisk: '' },
        { coefficient: '境外固收市场风险', key: 'outIncomeRiskList', rateRisk: '', profitPriceRisk: '', housePriceRisk: '', outIncomeRisk: '', outProfitRisk: '', exchangeRateRisk: '' },
        { coefficient: '境外权益市场风险', key: 'outProfitRiskList', rateRisk: '', profitPriceRisk: '', housePriceRisk: '', outIncomeRisk: '', outProfitRisk: '', exchangeRateRisk: '' },
        { coefficient: '汇率风险', key: 'exchangeRateRiskList', rateRisk: '', profitPriceRisk: '', housePriceRisk: '', outIncomeRisk: '', outProfitRisk: '', exchangeRateRisk: '' }
  ],
  creditRisk: [
        { coefficient: '利差风险', key: 'costOfCarryRiskList', costOfCarryRisk: '', dealBreakRisk: '' },
        { coefficient: '交易对手违约风险', key: 'dealBreakRiskList', costOfCarryRisk: '', dealBreakRisk: '' }
  ],
  riskObj: {
    '整体风险': 'totalRisk',
    '保险风险': 'unLifeRisk',
    '保费和准备金风险': 'rateAndPrepRisk',
    '车险': 'carInsure',
    '财产险': 'financeInsure',
    '船货特险': 'shipInsure',
    '责任险': 'propertyInsure',
    '农业险': 'agricultrueInsure',
    '信用保证险': 'creditBailInsure',
    '短意险': 'shortYiInsure',
    '短健险': 'shortJianInsure',
    '短寿险': 'shortLifeInsure',
    '其他险': 'othersInsure',
    '巨灾风险': 'largeDisasterRisk',
    '市场风险': 'marketRisk',
    '利率风险': 'rateRisk',
    '权益价格风险': 'profitPriceRisk',
    '房地产价格风险': 'housePriceRisk',
    '境外固收市场风险': 'outIncomeRisk',
    '境外权益市场风险': 'outProfitRisk',
    '汇率风险': 'exchangeRateRisk',
    '信用风险': 'creditRisk',
    '利差风险': 'costOfCarryRisk',
    '交易对手违约风险': 'dealBreakRisk',
    '操作风险': 'operRisk',
    '声誉风险': 'fameRisk',
    '战略风险': 'strategyRisk',
    '流动性风险': 'flowRisk'
  }
}
