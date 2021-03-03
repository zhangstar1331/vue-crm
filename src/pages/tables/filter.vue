<template>
  <div>
    <Vue2Org-Tree
      :horizontal="true"
      :data="treeDatas"
      :props="{label: 'label', children: 'children',expand:'expand'}"
      :collapsable="true"
      @on-expand="onExpand"
      @on-node-dblclick="addGsForm"
    />
    <el-dialog :modal-append-to-body='false' :title="title" class="dialogAdd" width="600px"  :visible.sync="dialogAddgsVisible"  @close="closeDialogAddgsVisible">
      <el-form :model="addForm" ref="addForm" style="margin-right: 20px;" label-position="right" label-width="110px">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="addForm.desc" value="addForm.desc"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogAddgsVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="saveAddForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue2OrgTree from 'vue2-org-tree';
  export default {
    name: 'newDetails',
    data () {
      return {
        treeDatas:  {
          id: 1,
          label: "Seu Siriguejo",
          desc:'aaaaa',
          expand: false,
          children: [
            {
              id: 2,
              label: "Bob Esponja",
              expand: false,
              desc:'bbbbfsdgsdfgsdfgsdfgsdfgdfsgsdfgdfsgsgfdgfdsg',
              children: [
                {
                  id: 4,
                  label: "Patrick Estrela",
                  desc:'cccc',
                  children: [
                    {label: "Patrick Estrela",}
                  ]
                },
                {
                  id: 5,
                  label: "Sandy Bochechas",
                  desc:'ddddd',
                  children: [
                    {label: "Patrick Estrela",}
                  ]
                }
              ]
            },
            {
              id: 3,
              label: "Lula Molusco",
              desc:'aaaaa',
              children: [],
              expand: false,
            },
            {
              id: 2,
              label: "Bob Esponja",
              desc:'aaaaa',
              children: [
                {
                  id: 4,
                  label: "Patrick Estrela",
                  desc:'aaaaa',
                  children: [
                    {label: "Patrick Estrela",}
                  ]
                },
                {
                  id: 5,
                  label: "Sandy Bochechas",
                  desc:'aaaaa',
                  children: [
                    {label: "Patrick Estrela",}
                  ]
                }
              ]
            },
          ]
        },
        addForm:{
          desf:''
        },
        dialogAddgsVisible:false,
        title:''
      }
    },
    watch:{

    },
    components:{
      Vue2OrgTree,
    },
    methods: {
      onExpand(e,data){
        data.expand=!data.expand
      },
      addGsForm(e,data){
        this.dialogAddgsVisible = true;
        this.title="编辑"
        console.log(data)
        this.addForm.desc = data.desc
      },
      closeDialogAddgsVisible(){
        this.$refs.addForm.resetFields();//element封装的方法,清空模态框的值
        this.title="" //初始化title的值
        this.addForm={//初始化addForm中的值
          desc:''
        }
      },
      saveAddForm() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let params = {
              desc: this.addForm.desc
            };
            if(!this.addForm.id){//当没有传过来id的时候,说明是添加,所以发送添加请求
              this.$post(
                "/api/company/admin/saveCompany",
                params,
                data => {
                  // console.log(data, 1122);
                  this.$message.success("新增企业成功！")
                  this.dialogAddgsVisible = false
                  this.handleCurrentChange(1);
                }
              );
            }else{//发送编辑请求
              this.$post(
                "/api/company/admin/updateCompany",
                params,
                data => {
                  // console.log(data, 1122);
                  this.$message.success("修改企业成功！")
                  this.dialogAddgsVisible = false
                  this.handleCurrentChange(1);
                }
              );
            }
          }
        });
      },
    }

  }
</script>

<style  lang="scss">
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .count-ie{
    width: 100%;
    background-color: #ffffff;
    height: 481px;
    -webkit-box-shadow: 4px 2px 6px #888;
    border-radius: 8px;
    .titIcon{
      text-indent: 29px;
      line-height: 91px;
      margin-top: 21px;
    }
  }
</style>
