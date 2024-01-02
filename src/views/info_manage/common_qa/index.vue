<template>
  <d2-container class="container">
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteQA">删除</el-button>
    <el-button size="small" type="success" plain @click="dialogFormVisible = true">新增</el-button>
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
      @opt="optQa"/>
    <el-dialog title="常见问题" :visible.sync="dialogFormVisible" center width="30%">
      <el-form :model="qa" :rules="rules" ref="qa">
        <el-form-item label="问题" prop="question">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入问题"
            maxlength="255"
            v-model="qa.question">
          </el-input>
        </el-form-item>
        <el-form-item label="回答" prop="answer">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入回答"
            maxlength="255"
            v-model="qa.answer">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入备注"
            maxlength="255"
            v-model="qa.remark">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="qa.enable"
            active-value="1"
            inactive-value="0"
            active-text="已启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-switch
            :disabled="qa.enable === '0'"
            v-model="qa.top"
            active-value="1"
            inactive-value="0"
            active-text="已置顶"
            inactive-text="未置顶">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('qa')">确 定</el-button>
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
          title: '问题',
          key: 'question',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          title: '回答',
          key: 'answer',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          showOverflowTooltip: true,
          align: 'center',
          formatter: function (row) {
            if (row.remark) {
              return row.remark
            }
            return '暂无'
          }
        },
        {
          title: '是否启用',
          key: 'enable',
          align: 'center',
          formatter: function (row) {
            if (row.enable === 1) {
              return '√'
            }
            return '×'
          }
        },
        {
          title: '是否置顶显示',
          key: 'top',
          align: 'center',
          formatter: function (row) {
            if (row.top === 1) {
              return '√'
            }
            return '×'
          }
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
      qa: {
        id: '',
        question: '',
        answer: '',
        remark: '',
        enable: '0',
        top: '0'
      },
      selectedId: [],
      dialogFormVisible: false,
      rules: {
        question: [
          { required: true, message: '请输入问题', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请输入回答', trigger: 'blur' }
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
        border: true
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
    optQa({_, row}) {
      this.qa.id = row.id
      this.qa.question = row.question
      this.qa.answer = row.answer
      this.qa.remark = row.remark
      this.qa.top = row.top === 1 ? '1' : '0'
      this.qa.enable = row.enable === 1 ? '1' : '0'
      this.dialogFormVisible = true
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('信息填写错误')
          return
        }
        if (this.qa.id == '') {
          this.submitForAdd()
          return
        }
        this.$api.SYS_COMMON_QA_UPDATE(this.qa).then(_ => {
          this.dialogFormVisible = false
          this.$message.success('修改成功')
          this.getData(this.page.currentPage)
        });
      })
    },
    submitForAdd() {
      this.$api.SYS_COMMON_QA_ADD(this.qa).then(_ => {
        this.dialogFormVisible = false
        this.$message.success('新增成功')
        this.getData(this.page.currentPage)
        this.qa = {
          id: '',
          question: '',
          answer: '',
          remark: '',
          enable: '0',
          top: '0'
        }
      })
    },
    getData(current) {
      this.$api.SYS_COMMON_QA_LIST({
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
    deleteQA() {
      if (this.selectedId.length <= 0) {
        this.$message.error('请选择要删除的记录')
        return
      }
      this.$api.SYS_COMMON_QA_DELETE({ids: this.selectedId}).then(() => {
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
