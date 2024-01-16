<template>
  <d2-container class="container">
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteTmp">删除</el-button>
    <el-button size="small" type="success" plain @click="toAdd">新增</el-button>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :pagination="page"
      :options="options"
      :row-handle="rowHandler"
      :data="data"
      selection-row
      @selection-change="handleSelectionChange"
      @pagination-current-change="paginationCurrentChange"
      @opt="opt"/>
    <el-dialog title="邮件模板" :visible.sync="dialogFormVisible" center width="20%" :close-on-click-modal="false">
      <el-form :model="tmp" :rules="rules" ref="tmp">
        <el-form-item label="标题" prop="title">
          <el-input
            placeholder="请输入标题"
            maxlength="20"
            v-model="tmp.title">
          </el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6}"
            placeholder="请输入内容"
            v-model="tmp.content">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">恢 复</el-button>
        <el-button type="primary" @click="submit('tmp')">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: '标题',
          key: 'subject',
          align: 'center'
        },
        {
          title: '内容',
          key: 'content',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          title: '创建',
          key: 'createBy',
          align: 'center',
          formatter: function (row) {
            if (row.createBy) {
              return row.createBy + '：' + row.createTime
            }
            return '暂无'
          }
        },
        {
          title: '最后修改',
          key: 'updateBy',
          align: 'center',
          formatter: function (row) {
            if (row.updateBy) {
              return row.updateBy + '：' + row.updateTime
            }
            return '暂无'
          }
        }
      ],
      data: [],
      tmp: {
        id: '',
        title: '',
        content: ''
      },
      tmpCopy: '',
      selectedId: [],
      dialogFormVisible: false,
      rules: {
        title: [
          { required: true, message: '请输入邮件标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入邮件内容', trigger: 'blur' }
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
            text: '查看&编辑',
            plain: true,
            size: 'small',
            emit: 'opt'
          }
        ]
      }
    }
  },
  methods: {
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    reset() {
      this.tmp = JSON.parse(this.tmpCopy)
    },
    opt({_, row}) {
      this.tmp.id = row.id
      this.tmp.title = row.subject
      this.tmp.content = row.content
      this.tmpCopy = JSON.stringify(this.tmp)
      this.dialogFormVisible = true
    },
    toAdd() {
      this.tmp = {
        id: '',
        title: '',
        content: ''
      }
      this.dialogFormVisible = true
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('信息填写错误')
          return
        }
        if (this.tmp.id == '') {
          this.submitForAdd()
          return
        }
        if (this.tmpCopy === JSON.stringify(this.tmp)) {
          this.$message.warning('尚未改动任何信息')
          return
        }
        this.tmpCopy = JSON.parse(this.tmpCopy)
        this.tmpCopy.subject= this.tmp.title == this.tmpCopy.title ? null : this.tmp.title
        this.tmpCopy.content = this.tmp.content == this.tmpCopy.content ? null : this.tmp.content
        this.$api.SYS_EMAIL_TMP_UPDATE(this.tmpCopy).then(_ => {
          this.dialogFormVisible = false
          this.$message.success('修改成功')
          this.getData(1)
        });
      })
    },
    submitForAdd() {
      this.tmp.subject = this.tmp.title
      this.$api.SYS_EMAIL_TMP_ADD(this.tmp).then(_ => {
        this.dialogFormVisible = false
        this.$message.success('新增成功')
        this.getData(this.page.currentPage)
        this.tmp = {
          id: '',
          title: '',
          content: ''
        }
      })
    },
    getData(current) {
      this.$api.SYS_EMAIL_TMP_LIST({
        pageNum: current,
        pageSize: this.page.pageSize
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    handleSelectionChange(selection) {
      this.selectedId = []
      selection.forEach(item => {
        this.selectedId.push(item.id)
      })
    },
    deleteTmp() {
      if (this.selectedId.length <= 0) {
        this.$message.error('请选择要删除的记录')
        return
      }
      this.$api.SYS_EMAIL_TMP_DELETE({ids: this.selectedId}).then(() => {
        this.getData(this.page.currentPage)
        this.$message.success('删除成功')
      })
    },
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">
</style>
