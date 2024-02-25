<script setup>
import {ref} from "vue"
import request from "./utils/request.js"

// 数据
let queryInput = ref("")
let tableData = ref([{
    Id:"1",
    name:"Tom1",
    email:"aaabbbccc@163.com",
    phone:"13737772722",
    state:"离职",
    address:"广东省深圳市"
  },
  {
    ID:"2",
    name:"Tom2",
    email:"aaabbbccc@163.com",
    phone:"13737772722",
    state:"离职",
    address:"广东省深圳市"
  },
  {
    ID:"3",
    name:"Tom3",
    email:"aaabbbccc@163.com",
    phone:"13737772722",
    state:"离职",
    address:"广东省深圳市"
  },
  {
    ID:"4",
    name:"Tom4",
    email:"aaabbbccc@163.com",
    phone:"13737772722",
    state:"离职",
    address:"广东省深圳市"
  },
  ])
let tableDataCopy = Object.assign(tableData)
let dialogFormVisible = ref(false)
let tableForm = ref({
  name:"张三",
  email:"yi123131@163.com",
  phone:"13511202202",
  state:"离职",
  address:"广东省深圳市"
})
let dialogType = ref("add")
let multipleSelection = ref([])
let total = 20
let curPage = 1
// 方法
// 删除一行
const DeleteRowClick = async ({ID}) => {
  // tableData.value.splice(index, 1)
  await request.delete(`/user/delete/${ID}`)
  getTableData(curPage)
}
// 删除多选
const DeleteListClick = () =>{
  multipleSelection.value.forEach(ID=>{
    DeleteRowClick({ID})
  })
}
// 选中多选
const handleSelectionChange = (val) => {
  multipleSelection.value = []
  val.forEach(item=>{
    multipleSelection.value.push(item.ID)
  })
  console.log(multipleSelection.value);
}
// 新增
const handleAdd = () =>{
  dialogFormVisible.value = true
  tableForm.value = {} 
}
// 编辑
const handleEdit = (row) =>{
  dialogType.value = "edit"
  dialogFormVisible.value = true
  tableForm.value = {...row}
}
// 确认按钮绑定函数
const dialogConfirm = async () =>{
  dialogFormVisible.value = false
  if(dialogType.value === "add"){
    let res = await request.post("/user/add",{
      ...tableForm.value
    })
    console.log(res)
    await getTableData(curPage)
  }else{
    console.log(tableForm.value)
    let res = await request.put(`/user/update/${tableForm.value.ID}`,{
      ...tableForm.value
    })
    console.log(res)
    await getTableData(curPage)
  }
}
// 查询功能
const handleInputQuery = async (val) =>{
  if(val.length > 0){
    tableData.value= await request.get(`/user/list/${val}`)
  }else{
    await getTableData(curPage)
  }
}
const getTableData = async (cur=1) =>{
  let res = await request.get('/user/list', {
    pageSize : 10,
    pageNum:cur
  })
  tableData.value = res.list
  curPage = cur
  console.log(tableData.value)
}
getTableData(1)
const handleChangePage = (val) =>{
  console.log(val)
  getTableData(val)
}
</script>

<template>
  <div class="table-box">
    <!-- 标题区 -->
    <div class="title">
      <h2>CRUD DEMO</h2>
    </div>
    <!-- 功能区 -->
    <div class="query-box">
      <el-input v-model="queryInput" class="queryInput" placeholder="Please input" @change="handleInputQuery" />
      <div class="btn-list">
        <el-button type="primary" @click="handleAdd">增加</el-button>
        <el-button type="danger" @click="DeleteListClick">删除多选</el-button>
      </div>
    </div>
    <!-- 展示区 -->
    <el-table :ref="multipleTableRef"
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange" border>
    <el-table-column type="selection" width="55" />
    <el-table-column prop="ID" label="Id" width="60" />
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="email" label="Email" width="200" />
    <el-table-column prop="phone" label="Phone" width="150" />
    <el-table-column prop="state" label="State" width="100" />
    <el-table-column prop="address" label="Address" width="300" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="DeleteRowClick(scope.row)" style="color: #F56C6C;">Delete</el-button>
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">Edit</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" 
    :total="total"
    v-model:current-page="curPage"
    @current-change="handleChangePage"
    style="display: flex;justify-content: center;margin-top: 10px;"/>
  </div>
  <!-- 新增弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="dialogType === 'add'?'新增':'编辑'" width="500">
    <el-form :model="tableForm">
      <el-form-item label="姓名" :label-width="80">
        <el-input v-model="tableForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="80">
        <el-input v-model="tableForm.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话" :label-width="80">
        <el-input v-model="tableForm.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态" :label-width="80">
        <el-input v-model="tableForm.state" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" :label-width="80">
        <el-input v-model="tableForm.address" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">确认</el-button>
      </div>
    </template>
    </el-dialog>
  
</template>


<style scoped>
.table-box{
  width: 800px;
  position:absolute;
  top:50%;
  left:50%;
  transform: translate(-50%, -50%);
}
.title{
  text-align: center;
}

.query-box{
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.queryInput{
  width: 200px;
}
</style>
