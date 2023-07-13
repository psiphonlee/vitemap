<template>
    <div class="table-box">
        <!-- 标题 -->
        <div class="title">
            <h2>用户管理</h2>
            <p>注册：{{ oklength }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                试用：{{ testlength }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                过期：{{ falselength }}</p>
        </div>
        <!-- 查询栏 -->
        <div class="query-box">
            <el-input class="query-input" style="width: 200px;" v-model="queryInput" placeholder="输入用户名搜索" @input="handleQuery"/>
            <div class="btn-list">
                <el-button type="danger" @click="multipleDelete" v-if="multipleSelection.length > 0">删除已选</el-button>
                <el-button type="primary" @click="handleAdd">新增用户</el-button>
            </div>
        </div>
        <!-- 用户信息 -->
        <div class="user-area">
            <!-- 在ele plus 中@selection-change会自动把选中的行数据作为参数传递给指定的方法 -->
            <el-table 
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :cell-class-name="binClass"
                border
            >
                <el-table-column type="selection" width="45" />
                <el-table-column prop="date" label="注册日期" width="120" />
                <el-table-column prop="name" label="用户名" width="120" />
                <el-table-column prop="status" label="状态" width="120" >
                </el-table-column>

                <el-table-column prop="enddate" label="有效期" width="120" />
                <el-table-column prop="tel" label="电话号码" width="210" />
                <el-table-column prop="email" label="邮箱"  />
                <el-table-column prop="operation" label="操作" width="170" >
                    <template #default="scope">
                        <el-button
                            link
                            type="primary"
                            size="default"
                            @click="deleteRow(scope.row)"
                            >
                            删除
                        </el-button>
                        <el-button link type="primary" size="default" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 增加用户对话框 -->
        
        <el-dialog v-model="dialogFormVisible" :title="dialogType === 'add' ? '新增用户' : '编辑用户'">
            <el-form class="table-form" :model="tableform">
                <el-form-item label="注册日期" :label-width="100">
                        <el-date-picker v-model="tableform.date" type="date" autocomplete="off" value-format="YYYY-MM-DD"/>
                </el-form-item>
                <el-form-item label="用户名" :label-width="100">
                    <el-input v-model="tableform.name" style="width: 220px;" autocomplete="off" />
                </el-form-item>
                <el-form-item label="状态" :label-width="100">
                    <el-select v-model="tableform.status" style="width: 220px;" placeholder="选择状态" @change="statusChange">
                        <el-option label="OK" value="OK" />
                        <el-option label="FALSE" value="FALSE" />
                        <el-option label="TEST" value="TEST" />
                    </el-select>
                </el-form-item>
                <el-form-item label="有效期" :label-width="100">
                        <el-date-picker v-model="tableform.enddate" type="date" autocomplete="off" value-format="YYYY-MM-DD"/>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="100">
                        <el-input v-model="tableform.tel" style="width: 220px;" autocomplete="off" />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="100">
                        <el-input v-model="tableform.email" style="width: 220px;" autocomplete="off" />
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button :type="dialogType === 'add' ? 'primary' : 'danger'" @click="dialogConfirm">
                        {{ dialogType === 'add' ? '确认新增' : '确认修改' }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
        
    </div>
</template>

<script setup>
import { configProviderContextKey } from 'element-plus';
import { tableV2GridProps } from 'element-plus/es/components/table-v2/src/grid';
import { ref } from 'vue'

/* 数据 */
const currentDate = new Date().toISOString().split('T')[0]
let queryInput = ref('')
let multipleSelection = ref([])
let dialogFormVisible = ref(false)
let dialogType = ref('add')
let tableData = ref([
    {
        id: 1,
        date: '2016-05-03',
        name: 'Tom',
        status: 'OK',
        enddate: '2017-05-03',
        tel: '19854635496',
        email: 'klieei@email.com',
    },
    {
        id: 2,
        date: '2016-05-03',
        name: 'Joem',
        status: 'OK',
        enddate: '2017-05-03',
        tel: '18976577855',
        email: 'jdakj@email.com',
    },
    {
        id: 3,
        date: '2016-05-03',
        name: 'ferr',
        status: 'FALSE',
        enddate: '2017-05-01',
        tel: '18976478755',
        email: 'dgrr@email.com',
    },
    {
        id: 4,
        date: '2016-05-03',
        name: 'erttwtrt',
        status: 'TEST',
        enddate: '2017-05-03',
        tel: '18976577855',
        email: 'werg@email.com',
    },
])
let tableform = ref({
    id: 3,
    date: '2016-05-03',
    name: '周三',
    status: 'OK',
    enddate: '2018-06-15',
    tel: '16579865465',
    email: 'jkljl@email.com',
})

let tableDataCopy = Object.assign(tableData.value)
const oklength = tableData.value.filter(item => item.status === 'OK').length
const falselength = tableData.value.filter(item => item.status === 'FALSE').length
const testlength = tableData.value.filter(item => item.status === 'TEST').length

/* 方法 */

// 搜索
// const handleQuery = (val) => {
//     if (val.length > 0) {
//         tableData.value = tableData.value.filter(item => item.tel.match(val))
//     }else{
//         tableData.value = tableDataCopy
//     }
// }

const handleQuery = (val) => {
    if (val.length > 0) {
        tableData.value = tableData.value.filter(item => (item.name).toLowerCase().match(val.toLowerCase()))
    } else {
        tableData.value = tableDataCopy
    }
}

// 选中
const handleSelectionChange = (val) => {
    multipleSelection.value = []
    val.forEach(item=>{
        multipleSelection.value.push(item.id)
    })
    console.log(multipleSelection.value)
}
// 新增
const handleAdd = () => {
    dialogType.value = 'add'
    dialogFormVisible.value = true
    tableform.value = {}
    tableform.value.date = currentDate;
}
// 改变状态
const statusChange = (val) => {
    if (val === 'OK') {
        // console.log(tableform.value.enddate)
        const lastDate = new Date(currentDate);
        lastDate.setDate(lastDate.getDate() + 365);
        tableform.value.enddate = lastDate.toISOString().split('T')[0]
        // console.log(tableform.value.enddate)
    }else if (val === 'FALSE') {
        const lastDate = new Date(currentDate);
        lastDate.setDate(lastDate.getDate() - 1);
        tableform.value.enddate = lastDate.toISOString().split('T')[0]
    }else{
        const lastDate = new Date(currentDate);
        lastDate.setDate(lastDate.getDate() + 1);
        tableform.value.enddate = lastDate.toISOString().split('T')[0]
    }
}
// 根据状态显示颜色
const binClass = ({ row, column, rowIndex, columnIndex }) => {
    
    // console.log(row.status)
    if (columnIndex === 3) {
        if (row.status === 'OK') {
            return 'ok-row'
        }else if (row.status === 'FALSE') {
            return 'false-row'
        }else{
            return 'test-row'
        }
    }
}
// 删除已选行
const multipleDelete = () => {
    multipleSelection.value.forEach(id=>{
        deleteRow({id})
    })
    multipleSelection.value = []
}
// 删除当前行
const deleteRow = ({ id }) => {
    // 通过id获取table中对应的索引值，每点击一次deleteRow都会重新查找id所在的索引，所以
    // 可以确保每次都能够删除对应的数据，不会出错
    // findIndex() 方法用于找到数组中符合条件item=>item.id === id的索引
    let index = tableData.value.findIndex(item => item.id === id)
    console.log(index)
    tableData.value.splice(index, 1);
}
// 编辑
const handleEdit = (row) => {
    dialogType.value = 'edit'
    tableform.value = {...row}
    dialogFormVisible.value = true
}
// 添加数据到表单
const dialogConfirm = () => {
    dialogFormVisible.value = false
    if (dialogType.value === 'add') {
        // 1.取得表单数据并添加到tableData
        tableData.value.push({
            id: tableData.value.length + 1,
            ...tableform.value
        })
        console.log(tableData.value)
        
    }else if (dialogType.value === 'edit') {
        let index = tableData.value.findIndex(item => item.id === tableform.value.id)
        tableData.value[index] = {...tableform.value}
    }
}


</script>

<style lang="scss" scoped>
.table-box {
    margin: 200px auto;
    width: 1200px;
}
.title{
    text-align: center;
}
.query-box{
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
}

.btn-list{
    display: flex;
    justify-content: flex-start;
    padding-left: 12px;
}

</style>

<style lang="scss">
.ok-row {
    color: #00e713;
    font-weight: bold;
}
.false-row {
    color: #e63200;
    font-weight: bold;
}
.test-row {
    color: #00b8e6;
    font-weight: bold;
}
</style>