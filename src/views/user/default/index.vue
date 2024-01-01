<template>
  <d2-container>
    <div class="head_opt">
      <div>
        <el-input class="stu_num" v-model="form.stuNum" placeholder="学号前缀" maxlength="12"></el-input>
      </div>
      <div>
        <el-input class="name" v-model="form.fullName" placeholder="姓名关键字" maxlength="3"></el-input>
      </div>
      <div>
        <el-input class="email" v-model="form.email" placeholder="邮箱前缀" maxlength="30"></el-input>
      </div>
      <div>
        <el-input class="phone" v-model="form.phone" placeholder="手机号前缀" maxlength="11"></el-input>
      </div>
      <div class="search_btn">
        <el-button icon="el-icon-search" circle @click="getData(1)"></el-button>
      </div>
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
  </d2-container>
</template>
<script>
export default {
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
          title: '昵称',
          key: 'nickName',
          align: 'center',
          formatter: this.emptyData
        },
        {
          title: '姓名',
          key: 'fullName',
          align: 'center',
          formatter: this.emptyData
        },
        {
          title: '性别',
          key: 'sex',
          align: 'center',
          formatter: function (row) {
            let result = '男'
            if (!row.sex) {
              result = '未填写'
            }
            if (row.sex === 0) {
              result = '女'
            }
            return result
          }
        },
        {
          title: '手机号',
          key: 'phone',
          align: 'center',
          formatter: this.emptyData
        },
        {
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
      form: {
        stuNum: '',
        fullName: '',
        email: '',
        phone: ''
      },
      page: {
        currentPage: 1,
        pageSize: 10,
        pageCount: 0,
        background: true,
      },
      options: {
        highlightCurrentRow: true,
        border: true
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
          message: '账号 ' + row.stuNum + ' 禁用成功',
          type: 'warning'
        })
      })
    },
    enableUser({_, row}) {
      this.$api.SYS_USER_STATUS({id: row.id, status: 0}).then(() => {
        row.status = 0
        this.$message({
          message: '账号 ' + row.stuNum + ' 启用成功',
          type: 'success'
        })
      })
    },
    getData(current) {
      this.$api.SYS_USER_GET_NORMAL_LIST(
        {
          pageNo: current,
          pageSize: this.page.pageSize,
          stuNum: this.form.stuNum,
          fullName: this.form.fullName,
          email: this.form.email,
          phone: this.form.phone
        }).then(res => {
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
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">
.head_opt {
  .stu_num {
    width: 150px;
  }

  .name {
    width: 150px;
    margin-left: 10px;
  }

  .email {
    width: 150px;
    margin-left: 10px;
  }

  .phone {
    width: 150px;
    margin-left: 10px;
  }

  .search_btn {
    margin-left: 10px;
    width: 150px;
  }
}
</style>
