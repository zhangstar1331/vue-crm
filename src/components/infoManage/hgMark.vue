<template>
    <div id="hgMark">
        <div class="maskBox">
            <el-tag @close="backFunc" closable></el-tag>
            <div class="markInfo">
                <div class="infoTitle">迟报/错报标记</div>
                <el-form ref="delay" :model="delay" label-position="left" size="mini" :rules="rules">
                    <el-form-item label="基本信息首次报送时间" align="left">
                        <span>{{delay.submitDate == null||delay.submitDate == ''?'--':timeFormat(delay.submitDate)}}</span>
                    </el-form-item>
                    <el-form-item label="迟报天数" prop="day">
                        <el-input @keydown.native="checkInput($event)" type="number" v-model="delay.day" placeholder="请输入迟报天数"></el-input>天
                    </el-form-item>
                    <el-form-item label="错报/漏报" prop="type">
                        <el-select v-model="delay.type" placeholder="请选择错报/漏报">
                            <el-option v-for="item in delayList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-button type="primary" class="search" @click="backFunc">取消</el-button>
                <el-button type="primary" class="search" @click="goUpdate('delay')">提交</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import qs from 'qs'
export default {
    props:['delay','url'],
    data() {
        return {
            delayList:[{
                name: "无错报/漏报",
                id: "1"
            }, {
                name: "一般",
                id: "2"
            }, {
                name: "重大",
                id: "3"
            }],
            rules:{
                day:[
                    {required: true, message: '请输入迟报天数', trigger: 'blur'}
                ],
                type:[
                    {required: true, message: '请选择错报/漏报', trigger: 'change'}
                ],
            }
        }
    },
    created(){
        
    },
    methods:{
        checkInput(e) {
            let prohibitInput = ["-", "e", "+", "E"];
            if (prohibitInput.includes(e.key)) {
                e.preventDefault();
            }
        },
        backFunc(){
            this.$emit('closeMask',{status:false})
        },
        goUpdate(formName){
            this.$refs[formName].validate(valid => {
		        if (valid) {
                    var params = qs.stringify({
                        id:this.delay.id,
                        type:this.delay.type,
                        day:this.delay.day
                    })
                    this.axios.post(this.url, params).then((res) => {
                        if (res.code == 200) {
                            this.$alert('提交成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.$emit('closeMask',{status:false})
                                }
                            })
                        } else {
                            this.$alert(res.message, '提示', {
                                confirmButtonText: '确定'
                            })
                        }
                    })
                }
            })
        },
        timeFormat(str){
            return str.substring(0,4)+'-'+str.substring(4,6)+'-'+str.substring(6,8)
        }
    }
}
</script>

<style lang="scss">
#hgMark{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 100000;
    padding-top: 15%;
    padding-left: 15%;
    padding-right: 100px;
    text-align: center;
    .maskBox {
        position: relative;
        width: 600px;
        padding: 40px 0;
        background: #fff;
        margin: 0 auto;
        .el-tag {
            position: fixed;
            margin: -40px 260px;
            background: transparent;
            border: none;
            padding: 4px;
            .el-icon-close {
                font-size: 18px;
                padding: 1px;
            }
            .el-icon-close:hover {
                background: transparent;
                color: #409eff;
            }
        }
        .markInfo {
            text-align: center;
            font-size: 16px;
            padding: 0 50px;
            .infoTitle {
                font-size: 20px;
                font-weight: 1000;
                margin-bottom: 40px
            }
        }
        .search {
            width: 68px;
            height: 26px;
            margin-right: 5px;
            margin-top: 20px;
            padding: 0;
            font-size: 12px;
        }
        .el-form-item__label {
            width: 35%;
            height: 36px;
            line-height: 36px;
            font-weight: normal;
            padding: 0 4% 0 0;
            text-align: right
        }
        .el-input__inner {
            height: 36px;
            line-height: 36px;
        }
        .el-form-item__content {
            float: left;
            width: 65%;
            height: 36px;
            line-height: 36px;
        }
        .el-input{
            float:left;
            width:90%
        }
        .el-select{
            width: 100%;
            .el-input{
                width:90%
            }
        }
    }
}
</style>
