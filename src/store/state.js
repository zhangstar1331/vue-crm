const state = {
    user: null,
    token: '',
    powerData: '',
    orgBtnData: [],
    isCollapsed: false, // 左边菜单是否展示
    //仪表盘数据
    meterData: {},
    mmm: '',
    // 新建指标传值给后台数据
    indicator: {
        id: '',
        name: '', // 指标名称
        // level: '', // 指标等级 1一级指标，2二级指标
        riskId: '', // 指标风险大类
        paramId: '', // 指标参数
        dataType: '', // 指标数据类型
        dataUnit: '', // 指标数据类型单位
        thb: '', // 同环比计算方式
        category: '', //指标分类
        isPref: '', // 是否为风险偏好指标
        status: '', // 是否启用指标
        // isRyb: '', // 是否为红黄蓝指标
        isDf: '', // 是否为东方指标
        isLimit: '', // 是否为风险限额指标
        isCapital: '', // 是否为资本化指标
        upCalibre: '', // 报送口径
        definition: '', // 指标定义
        reportInfo: [], // 报送信息数据
        hasSub: '', // 是否包含子类指标
        subIndicator: [], // 子类指标
        flag: '',
        desRule: '',
        threshold: [ // 阀值
            {
                'company': '', // 公司编码，下拉选（前期先写死，后期会变为活的
                'defaultRyb': '', //默认值
                'blue': [ // 蓝色阀值，红色，黄色 处理方式相同
                    {
                        'indType': '', // 类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
                        'operator': '', // 操作符 下拉选的值参考下方 OperatorEnum
                        'param': '', // 参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
                        'sign': '', // 加减符号 ， 1 加， 2 减
                        'value': '', // 值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
                        'dataUnit': '', // 数据类型。  参考下方
                        'expression': '' //自定义内容
                    }
                ],
                'blueRelation': '', // 数组中的关系，  1 并且   2 或者
                'red': [ // 蓝色阀值，红色，黄色 处理方式相同
                    {
                        'indType': '', // 类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
                        'operator': '', // 操作符 下拉选的值参考下方 OperatorEnum
                        'param': '', // 参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
                        'sign': '', // 加减符号 ， 1 加， 2 减
                        'value': '', // 值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
                        'dataUnit': '', // 数据类型。  参考下方
                        'expression': '' //自定义内容
                    }
                ],
                'redRelation': '', // 数组中的关系，  1 并且   2 或者
                'yellow': [ // 蓝色阀值，红色，黄色 处理方式相同
                    {
                        'indType': '', // 类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
                        'operator': '', // 操作符 下拉选的值参考下方 OperatorEnum
                        'param': '', // 参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
                        'sign': '', // 加减符号 ， 1 加， 2 减
                        'value': '', // 值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
                        'dataUnit': '', // 数据类型。  参考下方
                        'expression': '' //自定义内容
                    }
                ],
                'yellowRelation': '' // 数组中的关系，  1 并且   2 或者
            }
        ],
        // 风险容忍度
        prefTolerance: [{
            'indType': '',
            'operator': '',
            'value': '',
            'dataUnit': '',
            'expression': ''
        }],
        dfTolerance: [{
            'indType': '',
            'operator': '',
            'value': '',
            'dataUnit': '',
            'expression': ''
        }],
        limitTolerance: [{
            'indType': '',
            'operator': '',
            'value': '',
            'dataUnit': '',
            'expression': ''
        }]
    },
    // 提交编辑之后的清空处理
    indicatorRes: {
        id: '',
        name: '', // 指标名称
        // level: '', // 指标等级 1一级指标，2二级指标
        riskId: '', // 指标风险大类
        paramId: '', // 指标参数
        dataType: '', // 指标数据类型
        dataUnit: '', // 指标数据类型单位
        thb: '', // 同环比计算方式
        category: '', //指标分类
        isPref: '', // 是否为风险偏好指标
        status: '', // 是否启用指标
        // isRyb: '', // 是否为红黄蓝指标
        isDf: '', // 是否为东方指标
        isLimit: '', // 是否为风险限额指标
        isCapital: '', // 是否为资本化指标
        upCalibre: '', // 报送口径
        definition: '', // 指标定义
        reportInfo: [], // 报送信息数据
        hasSub: '', // 是否包含子类指标
        subIndicator: [], // 子类指标
        flag: '',
        desRule: '',
        threshold: [ // 阀值
            {
                'company': '', // 公司编码，下拉选（前期先写死，后期会变为活的
                'defaultRyb': '', //默认值
                'blue': [ // 蓝色阀值，红色，黄色 处理方式相同
                    {
                        'indType': '', // 类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
                        'operator': '', // 操作符 下拉选的值参考下方 OperatorEnum
                        'param': '', // 参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
                        'sign': '', // 加减符号 ， 1 加， 2 减
                        'value': '', // 值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
                        'dataUnit': '', // 数据类型。  参考下方
                        'expression': '' //自定义内容
                    }
                ],
                'blueRelation': '', // 数组中的关系，  1 并且   2 或者
                'red': [ // 蓝色阀值，红色，黄色 处理方式相同
                    {
                        'indType': '', // 类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
                        'operator': '', // 操作符 下拉选的值参考下方 OperatorEnum
                        'param': '', // 参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
                        'sign': '', // 加减符号 ， 1 加， 2 减
                        'value': '', // 值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
                        'dataUnit': '', // 数据类型。  参考下方
                        'expression': '' //自定义内容
                    }
                ],
                'redRelation': '', // 数组中的关系，  1 并且   2 或者
                'yellow': [ // 蓝色阀值，红色，黄色 处理方式相同
                    {
                        'indType': '', // 类型下拉选，会包含 “指标值" 值”n" "同比值“ 值"t" 新建子指标时会有 n1,n2,....子指标的id列表如（ “子指标一” 值 n1"子指标二“ 值 n2)
                        'operator': '', // 操作符 下拉选的值参考下方 OperatorEnum
                        'param': '', // 参数下拉框，如果指标关联了参数选项，这里可以有一个下拉 “参数” 值“p" 的列表如果没有关联参数可以变灰
                        'sign': '', // 加减符号 ， 1 加， 2 减
                        'value': '', // 值，文本框可以传字符串， 枚举型下拉多选时可以传字符串中间用逗号分开
                        'dataUnit': '', // 数据类型。  参考下方
                        'expression': '' //自定义内容
                    }
                ],
                'yellowRelation': '' // 数组中的关系，  1 并且   2 或者
            }
        ],
        // 风险容忍度
        prefTolerance: [{
            'indType': '',
            'operator': '',
            'value': '',
            'dataUnit': ''
        }],
        dfTolerance: [{
            'indType': '',
            'operator': '',
            'value': '',
            'dataUnit': ''
        }],
        limitTolerance: [{
            'indType': '',
            'operator': '',
            'value': '',
            'dataUnit': ''
        }]
    },
    // 提交编辑之后的清空处理
    indicatorName: {
        name: '指标名称',
        // level: '指标等级',
        riskId: '风险大类',
        paramId: '关联参数',
        dataType: '指标值类型',
        dataUnit: '指标单位',
        thb: '同环比计算方式',
        category: '指标分类',
        isPref: '是否为风险偏好指标',
        status: '是否立即启用指标',
        // isRyb: '是否为红黄蓝风险指标',
        isDf: '是否为东方风险偏好指标',
        isLimit: '是否为风险限额指标',
        isCapital: '是否为可资本化风险指标',
        upCalibre: '报送口径',
        definition: '指标定义',
        hasSub: '是否包含子类指标',
        flag: '是否为月度指标季度算红黄蓝',
        desRule: '提交月度指标时校验规则'
    },
    // 新建指标页面所有选项数据
    indicatorArr: {
        // 指标分类
        category: [{
                name: '评价类',
                id: '1'
            },
            {
                name: '观测类',
                id: '2'
            },
            {
                name: '仪表盘类',
                id: '3'
            },
            {
                name: '其他类',
                id: '9'
            }
        ],
        level: [{
                name: '一级指标',
                id: '1'
            },
            {
                name: '二级指标',
                id: '2'
            }
        ],
        riskId: [],
        paramId: [],
        dataType: [{
                name: '数值',
                id: '1'
            },
            {
                name: '枚举',
                id: '2'
            }
        ],
        dataUnit: [{
            name: '%',
            id: '1'
        }, {
            name: '次/季度',
            id: '2'
        }, {
            name: '年',
            id: '4'
        }, {
            name: '等级',
            id: '9'
        }, {
            name: '元',
            id: '5'
        }, {
            name: '次/月',
            id: '6'
        }, {
            name: '件/月',
            id: '7'
        }, {
            name: '件/季',
            id: '8'
        }, {
            name: '次/年',
            id: '10'
        }, {
            name: '件/年',
            id: '11'
        }, {
            name: 'PT',
            id: '12'
        }, {
            name: '无单位',
            id: '3'
        }],
        thb: [{
            name: '绝对值',
            id: '2'
        }, {
            name: '相对值',
            id: '1'
        }, {
            name: '无',
            id: '0'
        }],
        upCalibre: [],
        sentInfo: {
            company: [],
            department: [],
            codpNames: [],
            frequency: [{
                name: '月度',
                id: '1'
            }, {
                name: '季度',
                id: '2'
            }, {
                name: '半年度',
                id: '4'
            }, {
                name: '年度',
                id: '3'
            }],
            // 初始化日期数据
            monthArr: [],
            quarterArr: [],
            yearArr: [],
            halfyearArr: [],
            month: [{
                id: '01',
                name: '1月'
            }, {
                id: '02',
                name: '2月'
            }, {
                id: '03',
                name: '3月'
            }, {
                id: '04',
                name: '4月'
            }, {
                id: '05',
                name: '5月'
            }, {
                id: '06',
                name: '6月'
            }, {
                id: '07',
                name: '7月'
            }, {
                id: '08',
                name: '8月'
            }, {
                id: '09',
                name: '9月'
            }, {
                id: '10',
                name: '10月'
            }, {
                id: '11',
                name: '11月'
            }, {
                id: '12',
                name: '12月'
            }],
            day: [{
                id: '01',
                name: '1号'
            }, {
                id: '02',
                name: '2号'
            }, {
                id: '03',
                name: '3号'
            }, {
                id: '04',
                name: '4号'
            }, {
                id: '05',
                name: '5号'
            }, {
                id: '06',
                name: '6号'
            }, {
                id: '07',
                name: '7号'
            }, {
                id: '08',
                name: '8号'
            }, {
                id: '09',
                name: '9号'
            }, {
                id: '10',
                name: '10号'
            }, {
                id: '11',
                name: '11号'
            }, {
                id: '12',
                name: '12号'
            }, {
                id: '13',
                name: '13号'
            }, {
                id: '14',
                name: '14号'
            }, {
                id: '15',
                name: '15号'
            }, {
                id: '16',
                name: '16号'
            }, {
                id: '17',
                name: '17号'
            }, {
                id: '18',
                name: '18号'
            }, {
                id: '19',
                name: '19号'
            }, {
                id: '20',
                name: '20号'
            }, {
                id: '21',
                name: '21号'
            }, {
                id: '22',
                name: '22号'
            }, {
                id: '23',
                name: '23号'
            }, {
                id: '24',
                name: '24号'
            }, {
                id: '25',
                name: '25号'
            }, {
                id: '26',
                name: '26号'
            }, {
                id: '27',
                name: '27号'
            }, {
                id: '28',
                name: '28号'
            }, {
                id: '29',
                name: '29号'
            }, {
                id: '30',
                name: '30号'
            }, {
                id: '31',
                name: '31号'
            }],
            hour: [{
                id: '00',
                name: '00:00'
            }, {
                id: '01',
                name: '01:00'
            }, {
                id: '02',
                name: '02:00'
            }, {
                id: '03',
                name: '03:00'
            }, {
                id: '04',
                name: '04:00'
            }, {
                id: '05',
                name: '05:00'
            }, {
                id: '06',
                name: '06:00'
            }, {
                id: '07',
                name: '07:00'
            }, {
                id: '08',
                name: '08:00'
            }, {
                id: '09',
                name: '09:00'
            }, {
                id: '10',
                name: '10:00'
            }, {
                id: '11',
                name: '11:00'
            }, {
                id: '12',
                name: '12:00'
            }, {
                id: '13',
                name: '13:00'
            }, {
                id: '14',
                name: '14:00'
            }, {
                id: '15',
                name: '15:00'
            }, {
                id: '16',
                name: '16:00'
            }, {
                id: '17',
                name: '17:00'
            }, {
                id: '18',
                name: '18:00'
            }, {
                id: '19',
                name: '19:00'
            }, {
                id: '20',
                name: '20:00'
            }, {
                id: '21',
                name: '21:00'
            }, {
                id: '22',
                name: '22:00'
            }, {
                id: '23',
                name: '23:00'
            }],
            act: [{
                name: '手工填报',
                id: '1'
            }, {
                name: '系统对接',
                id: '2'
            }]
        },
        threshold: {
            company: [],
            defaultRyb: [{
                name: '红',
                id: '1'
            }, {
                name: '黄',
                id: '2'
            }, {
                name: '蓝',
                id: '3'
            }, {
                name: '无',
                id: '4'
            }],
            indType: [{
                name: '指标值',
                id: 'n'
            }, {
                name: '同比值',
                id: 't'
            }, {
                name: '自定义',
                id: 'e'
            }],
            operator: [{
                name: '大于',
                id: '1',
                label: '>'
            }, {
                name: '大于等于',
                id: '2',
                label: '>='
            }, {
                name: '小于',
                id: '3',
                label: '<'
            }, {
                name: '小于等于',
                id: '4',
                label: '<='
            }, {
                name: '等于',
                id: '5',
                label: '='
            }, {
                name: '不等于',
                id: '6',
                label: '≠'
            }, {
                name: '包含',
                id: '7',
                label: '包含'
            }],
            param: [],
            sign: [{
                name: '+',
                id: '1'
            }, {
                name: '-',
                id: '2'
            }],
            dataUnit: [{
                name: '%',
                id: '1'
            }, {
                name: '次/季度',
                id: '2'
            }, {
                name: '年',
                id: '4'
            }, {
                name: '等级',
                id: '9'
            }, {
                name: '元',
                id: '5'
            }, {
                name: '次/月',
                id: '6'
            }, {
                name: '件/月',
                id: '7'
            }, {
                name: '件/季',
                id: '8'
            }, {
                name: '次/年',
                id: '10'
            }, {
                name: '件/年',
                id: '11'
            }, {
                name: 'PT',
                id: '12'
            }, {
                name: '无单位',
                id: '3'
            }],
            value: [{
                name: 'AAA',
                id: '1'
            }, {
                name: 'AA',
                id: '2'
            }, {
                name: 'A',
                id: '3'
            }, {
                name: 'BBB',
                id: '4'
            }, {
                name: 'BB',
                id: '5'
            }, {
                name: 'B',
                id: '6'
            }, {
                name: 'CCC',
                id: '7'
            }, {
                name: 'CC',
                id: '8'
            }, {
                name: 'C',
                id: '9'
            }, {
                name: 'D',
                id: '10'
            }]
        },
        desRule: [{
                name: '月度指标，季度月评价结果在红或黄区，季度月必填原因分析和改善措施',
                id: '0'
            },
            {
                name: '月度指标值>0时，当月必填原因分析和改善措施',
                id: '2'
            }
        ],
    },
    indicatorArrRes: {
        // 指标分类
        category: [{
                name: '评价类',
                id: '1'
            },
            {
                name: '观测类',
                id: '2'
            },
            {
                name: '仪表盘类',
                id: '3'
            },
            {
                name: '其他类',
                id: '9'
            }
        ],
        level: [{
                name: '一级指标',
                id: '1'
            },
            {
                name: '二级指标',
                id: '2'
            }
        ],
        riskId: [],
        paramId: [],
        dataType: [{
                name: '数值',
                id: '1'
            },
            {
                name: '枚举',
                id: '2'
            }
        ],
        dataUnit: [{
            name: '%',
            id: '1'
        }, {
            name: '次/季度',
            id: '2'
        }, {
            name: '年',
            id: '4'
        }, {
            name: '等级',
            id: '9'
        }, {
            name: '元',
            id: '5'
        }, {
            name: '次/月',
            id: '6'
        }, {
            name: '件/月',
            id: '7'
        }, {
            name: '件/季',
            id: '8'
        }, {
            name: 'PT',
            id: '12'
        }, {
            name: '无单位',
            id: '3'
        }],
        thb: [{
            name: '绝对值',
            id: '2'
        }, {
            name: '相对值',
            id: '1'
        }, {
            name: '无',
            id: '0'
        }],
        upCalibre: [],
        sentInfo: {
            company: [],
            department: [],
            codpNames: [],
            frequency: [{
                name: '月度',
                id: '1'
            }, {
                name: '季度',
                id: '2'
            }, {
                name: '半年度',
                id: '4'
            }, {
                name: '年度',
                id: '3'
            }],
            // 初始化日期数据
            monthArr: [],
            quarterArr: [],
            yearArr: [],
            halfyearArr: [],
            month: [{
                id: '01',
                name: '1月'
            }, {
                id: '02',
                name: '2月'
            }, {
                id: '03',
                name: '3月'
            }, {
                id: '04',
                name: '4月'
            }, {
                id: '05',
                name: '5月'
            }, {
                id: '06',
                name: '6月'
            }, {
                id: '07',
                name: '7月'
            }, {
                id: '08',
                name: '8月'
            }, {
                id: '09',
                name: '9月'
            }, {
                id: '10',
                name: '10月'
            }, {
                id: '11',
                name: '11月'
            }, {
                id: '12',
                name: '12月'
            }],
            day: [{
                id: '01',
                name: '1号'
            }, {
                id: '02',
                name: '2号'
            }, {
                id: '03',
                name: '3号'
            }, {
                id: '04',
                name: '4号'
            }, {
                id: '05',
                name: '5号'
            }, {
                id: '06',
                name: '6号'
            }, {
                id: '07',
                name: '7号'
            }, {
                id: '08',
                name: '8号'
            }, {
                id: '09',
                name: '9号'
            }, {
                id: '10',
                name: '10号'
            }, {
                id: '11',
                name: '11号'
            }, {
                id: '12',
                name: '12号'
            }, {
                id: '13',
                name: '13号'
            }, {
                id: '14',
                name: '14号'
            }, {
                id: '15',
                name: '15号'
            }, {
                id: '16',
                name: '16号'
            }, {
                id: '17',
                name: '17号'
            }, {
                id: '18',
                name: '18号'
            }, {
                id: '19',
                name: '19号'
            }, {
                id: '20',
                name: '20号'
            }, {
                id: '21',
                name: '21号'
            }, {
                id: '22',
                name: '22号'
            }, {
                id: '23',
                name: '23号'
            }, {
                id: '24',
                name: '24号'
            }, {
                id: '25',
                name: '25号'
            }, {
                id: '26',
                name: '26号'
            }, {
                id: '27',
                name: '27号'
            }, {
                id: '28',
                name: '28号'
            }, {
                id: '29',
                name: '29号'
            }, {
                id: '30',
                name: '30号'
            }, {
                id: '31',
                name: '31号'
            }],
            hour: [{
                id: '00',
                name: '00:00'
            }, {
                id: '01',
                name: '01:00'
            }, {
                id: '02',
                name: '02:00'
            }, {
                id: '03',
                name: '03:00'
            }, {
                id: '04',
                name: '04:00'
            }, {
                id: '05',
                name: '05:00'
            }, {
                id: '06',
                name: '06:00'
            }, {
                id: '07',
                name: '07:00'
            }, {
                id: '08',
                name: '08:00'
            }, {
                id: '09',
                name: '09:00'
            }, {
                id: '10',
                name: '10:00'
            }, {
                id: '11',
                name: '11:00'
            }, {
                id: '12',
                name: '12:00'
            }, {
                id: '13',
                name: '13:00'
            }, {
                id: '14',
                name: '14:00'
            }, {
                id: '15',
                name: '15:00'
            }, {
                id: '16',
                name: '16:00'
            }, {
                id: '17',
                name: '17:00'
            }, {
                id: '18',
                name: '18:00'
            }, {
                id: '19',
                name: '19:00'
            }, {
                id: '20',
                name: '20:00'
            }, {
                id: '21',
                name: '21:00'
            }, {
                id: '22',
                name: '22:00'
            }, {
                id: '23',
                name: '23:00'
            }],
            act: [{
                name: '手工填报',
                id: '1'
            }, {
                name: '系统对接',
                id: '2'
            }]
        },
        threshold: {
            company: [],
            defaultRyb: [{
                name: '红',
                id: '1'
            }, {
                name: '黄',
                id: '2'
            }, {
                name: '蓝',
                id: '3'
            }, {
                name: '无',
                id: '4'
            }],
            indType: [{
                name: '指标值',
                id: 'n'
            }, {
                name: '同比值',
                id: 't'
            }, {
                name: '自定义',
                id: 'e'
            }],
            operator: [{
                name: '大于',
                id: '1',
                label: '>'
            }, {
                name: '大于等于',
                id: '2',
                label: '>='
            }, {
                name: '小于',
                id: '3',
                label: '<'
            }, {
                name: '小于等于',
                id: '4',
                label: '<='
            }, {
                name: '等于',
                id: '5',
                label: '='
            }, {
                name: '不等于',
                id: '6',
                label: '≠'
            }, {
                name: '包含',
                id: '7',
                label: '包含'
            }],
            param: [],
            sign: [{
                name: '+',
                id: '1'
            }, {
                name: '-',
                id: '2'
            }],
            dataUnit: [{
                name: '%',
                id: '1'
            }, {
                name: '次/季度',
                id: '2'
            }, {
                name: '年',
                id: '4'
            }, {
                name: '等级',
                id: '9'
            }, {
                name: '元',
                id: '5'
            }, {
                name: '次/月',
                id: '6'
            }, {
                name: '件/月',
                id: '7'
            }, {
                name: '件/季',
                id: '8'
            }, {
                name: 'PT',
                id: '12'
            }, {
                name: '无单位',
                id: '3'
            }],
            value: [{
                name: 'AAA',
                id: '1'
            }, {
                name: 'AA',
                id: '2'
            }, {
                name: 'A',
                id: '3'
            }, {
                name: 'BBB',
                id: '4'
            }, {
                name: 'BB',
                id: '5'
            }, {
                name: 'B',
                id: '6'
            }, {
                name: 'CCC',
                id: '7'
            }, {
                name: 'CC',
                id: '8'
            }, {
                name: 'C',
                id: '9'
            }, {
                name: 'D',
                id: '10'
            }]
        },
        desRule: [{
                name: '月度指标，季度月评价结果在红或黄区，季度月必填原因分析和改善措施',
                id: '0'
            },
            {
                name: '月度指标值>0时，当月必填原因分析和改善措施',
                id: '2'
            }
        ],
    },
    //风控评估页面
    riskAssess: {
        year: [{
            name: '2020',
            code: '2020'
        }, {
            name: '2019',
            code: '2019'
        }, {
            name: '2018',
            code: '2018'
        }, {
            name: '2017',
            code: '2017'
        }],
        assessType: [{
            value: '-1',
            label: '定期评估',
            children: [{
                value: '0',
                label: '半年度评估'
            }, {
                value: '1',
                label: '年度评估'
            }]
        }, {
            value: '2',
            label: '专项评估'
        }],
        riskDistribute: { //固有风险分布、剩余风险分布
            year: new Date().toJSON().substr(0, 4).replace('T', ' '),
            assType: '1',
            depId: ''
        },
        reqDetail: { //分布页面请求详情数据
            year: null, //评估年份
            assType: null, //评估类型， 0半年度评估  1年度评估  2专项评估
            depId: null, //部门id
            riskLevel: null, //固有风险等级0空,1一般风险，2重要风险，3重大风险
            riskEffect: null, //风险发生的影响程度1极小，2较小，3中等，4严重
            riskRate: null, //风险发生的可能性1每五年或更低频率，2每年，3每季度，4每月或更高频率
            hasBug: null, //是否存在缺陷1是，0否
            bugLevel: null, //缺陷等级1一般风险，2重要风险，3重大风险
            pageNo: 1, //当前页数
            pageSize: 2 //每页条数
        }
    },
    accountData: {
        jcType: [{
            name: '内部审计',
            id: '1'
        }, {
            name: '外部监管检查',
            id: '2'
        }, {
            name: '党委巡视',
            id: '3'
        }, {
            name: '信访举报',
            id: '4'
        }, {
            name: '其他',
            id: '5'
        }],
        // 处罚类型
        cfType: [{
            name: '作出检查',
            id: '1'
        }, {
            name: '责令整改',
            id: '2'
        }, {
            name: '经济处罚',
            id: '3'
        }, {
            name: '通报批评',
            id: '4'
        }, {
            name: '上收相应决策权',
            id: '5'
        }, {
            name: '调整综合考评结果和绩效分配',
            id: '6'
        }, {
            name: '调整人员组成',
            id: '7'
        }, {
            name: '其他',
            id: '8'
        }],
        // 责任类型
        zrType: [{
            name: '直接责任',
            id: '1'
        }, {
            name: '主要领导责任者',
            id: '2'
        }, {
            name: '重要领导责任者',
            id: '3'
        }],
        // 组织处理
        zzType: [{
            name: '批评教育',
            id: '1'
        }, {
            name: '责令检查',
            id: '2'
        }, {
            name: '通报批评',
            id: '3'
        }, {
            name: '诫勉谈话',
            id: '4'
        }, {
            name: '调离岗位',
            id: '5'
        }, {
            name: '停职',
            id: '6'
        }, {
            name: '免职',
            id: '7'
        }, {
            name: '责令辞职',
            id: '8'
        }],
        // 政纪处分
        zjType: [{
            name: '警告',
            id: '1'
        }, {
            name: '记过',
            id: '2'
        }, {
            name: '记大过',
            id: '3'
        }, {
            name: '降级',
            id: '4'
        }, {
            name: '撤职',
            id: '5'
        }, {
            name: '开除',
            id: '6'
        }],
        // 党纪处分
        djType: [{
            name: '警告',
            id: '1'
        }, {
            name: '严重警告',
            id: '2'
        }, {
            name: '撤销党内职务',
            id: '3'
        }, {
            name: '留党察看',
            id: '4'
        }, {
            name: '开除党籍',
            id: '5'
        }],
        // 经济处罚
        jjType: [{
            name: '扣发薪酬',
            id: '1'
        }, {
            name: '赔偿损失',
            id: '2'
        }, {
            name: '罚款',
            id: '3'
        }, {
            name: '停发/扣发绩效工资',
            id: '4'
        }],
    },
    caseSend: false,
    justiceSend: false,
    //集团、财险视图新增
    companySource: '0',
    zdList: {},
    zdListName: {},
    riskType: {
        "01": "公司治理类",
        "02": "行政管理类",
        "03": "人力资源管理类",
        "04": "财务管理类",
        "05": "战略管理类",
        "06": "资金运用类",
        "07": "风险管理类",
        "08": "合规法务类",
        "09": "稽核审计类",
        "10": "监察类",
        "11": "其他类",
    },
    riskTypeCX: {
        "01": "公司治理类",
        "02": "行政管理类",
        "03": "人力资源管理类",
        "04": "财务管理类",
        "05": "战略管理类",
        "06": "资金运用类",
        "07": "风险管理类",
        "10": "监察类",
        "11": "其他类",
        "12": "法律事务类",
        "13": "销售管理类",
        "14": "网销类",
        "15": "电销类",
        "16": "经纪代理类",
        "17": "车险类",
        "18": "农险类",
        "19": "普惠金融类",
        "20": "责任保险类",
        "21": "财产保险类",
        "22": "健康意外险类",
        "23": "再保险类",
        "24": "运营管理类",
        "25": "消费者权益保护类",
        "26": "承保类",
        "27": "理赔类",
        "28": "信息技术类",
        "29": "产品精算类",
        "30": "合规管理类",
    },
    insureList: [{
        name: '车险',
        id: '1'
    }, {
        name: '农险',
        id: '2'
    }, {
        name: '财产险',
        id: '3'
    }, {
        name: '责任险',
        id: '4'
    }, {
        name: '信用保证保险',
        id: '5'
    }, {
        name: '健康险',
        id: '6'
    }, {
        name: '意外险',
        id: '7'
    }, {
        name: '其他险种',
        id: '9'
    }],
    // 检查结果跟进
    rTypeList: [{
        name: '通过检查',
        id: '1'
    }, {
        name: '行政处罚事先告知书',
        id: '2'
    }, {
        name: '行政处罚决定书',
        id: '3'
    }, {
        name: '监管函',
        id: '4'
    }, {
        name: '监管意见书',
        id: '5'
    }, {
        name: '监管提示函',
        id: '6'
    }, {
        name: '其他监管措施或文件（自行填写文件名称）',
        id: '7'
    }],
    subjectList: [{
        name: '全部',
    }, {
        name: '银保监系统',
        id: 1
    }, {
        name: '人民银行',
        id: 2
    }, {
        name: '财政部',
        id: 3
    }, {
        name: '审计署',
        id: 4
    }, {
        name: '其他',
        id: 5
    }],
    punishList: [{
        name: '全部',
        id: ''
    }, {
        name: '行政处罚',
        id: '1'
    }, {
        name: '监管函',
        id: '2'
    }, {
        name: '行政监管措施',
        id: '6'
    }, {
        name: '监管意见书',
        id: '3'
    }, {
        name: '监管提示函',
        id: '4'
    }, {
        name: '其他',
        id: '5'
    }],
    punishData: {
        policyList:[{
            name: '中共党员',
            id: '1'
        }, {
            name: '群众',
            id: '2'
        }, {
            name: '其他党派人士',
            id: '3'
        }],
        wzType:[{
            name: '直接责任人',
            id: '1'
        }, {
            name: '间接责任人',
            id: '2'
        }, {
            name: '直接和间接责任人',
            id: '3'
        }],
        jlType: [{
            name: '通报批评',
            id: '1'
        }, {
            name: '警告',
            id: '2'
        }, {
            name: '严重警告',
            id: '3'
        }, {
            name: '记过',
            id: '4'
        }, {
            name: '记大过',
            id: '5'
        }, {
            name: '降级/降职',
            id: '6'
        }, {
            name: '撤职',
            id: '7'
        }, {
            name: '留用察看',
            id: '8'
        }, {
            name: '解除劳动合同',
            id: '9'
        }],
        zzType: [{
            name: '调离',
            id: '1'
        }, {
            name: '停职',
            id: '2'
        },{
            name: '责令辞职',
            id: '3'
        }, {
            name: '免职',
            id: '4'
        }],
        jjType: [{
            name: '扣减薪酬',
            id: '1'
        }, {
            name: '罚款',
            id: '2'
        }, {
            name: '其他',
            id: '3'
        }],
        superviseList:[{
            name:'现场检查',
            id:'4'
        },{
            name:'非现场检查',
            id:'5'
        }],
        punishSource:[{
            name:'行政处罚事先告知书',
            id:'1'
        },{
            name:'涉刑案件',
            id:'2'
        },{
            name:'以上不涉及',
            id:'3'
        }]
    },
};

export default state;