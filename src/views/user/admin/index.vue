<template>
  <d2-container>
    <div class="head_opt">
      <div>
        <el-input placeholder="请输入姓名关键字" class="search_input" v-model="nameKeyWord" maxlength="10" size="small">
          <el-button slot="append" icon="el-icon-search" @click="getData(1)"></el-button>
        </el-input>
      </div>
      <el-button plain type="success" class="add_btn" icon="el-icon-plus" circle @click="dialogFormVisible = true" size="small"></el-button>
    </div>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :pagination="page"
      :options="options"
      :row-handle="rowHandler"
      :data="data"
      @pagination-current-change="paginationCurrentChange"
      @disableUser="disableUser"
      @enableUser="enableUser"/>
    <el-dialog title="新增管理员" :visible.sync="dialogFormVisible" center width="30%">
      <el-form :model="admin" :rules="rules" ref="admin">
        <el-form-item label="学号" prop="stuNum">
          <el-input v-model="admin.stuNum" placeholder="请输入管理员学号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="admin.email" placeholder="请输入管理员邮箱"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="fullName">
          <el-input v-model="admin.fullName" placeholder="请输入管理员姓名"></el-input>
        </el-form-item>
      </el-form>
      <span class="tip"><i class="el-icon-warning"/> 账号创建成功后账号密码将自动以邮件形式发送至该管理员邮箱</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('admin')">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import {fa} from "faker/lib/locales";

export default {
  computed: {
    fa() {
      return fa
    }
  },
  data() {
    return {
      columns: [
        {
          title: '学号',
          key: 'stuNum',
          align: 'center'
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center'
        },
        {
          title: '姓名',
          key: 'fullName',
          align: 'center',
          formatter: this.emptyData
        },{
          title: '最后登录时间',
          key: 'lastLogin',
          align: 'center',
          formatter: this.emptyData
        },
        {
          title: '注册时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '账号状态',
          key: 'status',
          align: 'center',
          formatter: function (row) {
            let result = '正常'
            if (row.status === 1) {
              result = '禁用'
            }
            return result
          }
        }
      ],
      data: [],
      nameKeyWord: '',
      dialogFormVisible: false,
      admin: {
        stuNum: '',
        email: '',
        fullName: ''
      },
      rules: {
        stuNum: [
          { required: true, message: '请输入管理员学号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入管理员邮箱', trigger: 'blur'}
        ],
        fullName: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur'}
        ]
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        pageCount: 0,
        background: true,
      },
      options: {
        highlightCurrentRow: true,
        stripe: true
      },
      rowHandler: {
        columnHeader: '操作',
        fixed: 'right',
        align: 'center',
        custom: [
          {
            text: '禁用',
            type: 'danger',
            plain: true,
            size: 'small',
            emit: 'disableUser',
            show: function (index, row) {
              return row.status === 0
            }
          },
          {
            text: '启用',
            type: 'success ',
            plain: true,
            size: 'small',
            emit: 'enableUser',
            show: function (index, row) {
              return row.status === 1
            }
          }
        ]
      }
    }
  },
  methods: {
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    disableUser({_, row}) {
      this.$api.SYS_USER_STATUS({id: row.id, status: 1}).then(() => {
        row.status = 1
        this.$message({
          message: '管理员账号 ' + row.fullName + ' 禁用成功',
          type: 'warning'
        })
      })
    },
    enableUser({_, row}) {
      this.$api.SYS_USER_STATUS({id: row.id, status: 0}).then(() => {
        row.status = 0
        this.$message({
          message: '管理员账号 ' + row.fullName + ' 启用成功',
          type: 'success'
        })
      })
    },
    getData(current) {
      this.$api.SYS_USER_GET_ADMIN_LIST({pageNo: current, pageSize: this.page.pageSize, fullName: this.nameKeyWord}).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    emptyData(row, column, cellValue) {
      if (!cellValue) {
        return '暂无'
      }
      return cellValue
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('管理员信息填写错误')
          return
        }
        this.$api.SYS_USER_ADD_ADMIN(this.admin).then(res => {
          this.dialogFormVisible = false
          this.admin = {stuNum: '', fullName: '', email: ''}
          this.$message.success('添加成功：账号密码已发送至管理员邮箱')
        })
      })
    }
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">
  .head_opt {
    display: flex;
    text-align: right;
    .search_input {

    }
    .add_btn {
      margin-left: 10px;
    }
  }
  .tip {
    color: #33333390;
  }
</style>
