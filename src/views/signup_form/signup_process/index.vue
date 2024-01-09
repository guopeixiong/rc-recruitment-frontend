<template>
  <d2-container>
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteProcess">删除</el-button>
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
    <el-dialog title="常见问题" :visible.sync="dialogFormVisible" center width="30%" :close-on-click-modal="false">
      <el-form :model="process" :rules="rules" ref="process">
        <el-form-item label="名称" prop="name">
          <el-input
            placeholder="请输入名称"
            maxlength="10"
            v-model="process.name">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            placeholder="请输入备注"
            maxlength="100"
            v-model="process.remark">
          </el-input>
        </el-form-item>
        <el-form-item label="流程状态：">
            <el-tag
              v-for="(tag, index) in process.status"
              closable
              :disable-transitions="false"
              @close="StatusChange(index)">
              {{index + 1}}.{{tag}}
            </el-tag>
          <el-input
            class="input-new-tag"
            v-if="editStatus.visible"
            v-model="editStatus.status"
            size="mini"
            @keyup.enter.native="saveEditStatus"
            @blur="saveEditStatus"
          ></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInputStatus">+ 新增状态</el-button>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="process.enable"
            active-value="1"
            inactive-value="0"
            active-text="已启用"
            inactive-text="未启用">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset" v-if="process.id !== ''">恢 复</el-button>
        <el-button type="primary" @click="submit('process')">确 定</el-button>
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
          title: '名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
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
      },
      selectedId: [],
      data: [],
      dialogFormVisible: false,
      process: {
        id: '',
        name: '',
        remark: '',
        enable: '0',
        status: []
      },
      processCopy: '',
      statusCopy: '',
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ]
      },
      editStatus: {
        visible: false,
        status: '',
      }
    }
  },
  methods: {
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    optQa({_, row}) {

    },
    getData(current) {
      this.$api.SYS_PROCESS_LIST({
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
    opt({_, row}) {
      this.$api.SYS_PROCESS_STATUS({id: row.id}).then(res => {
        this.process.status = res
        this.process.id = row.id
        this.process.name = row.name
        this.process.remark = row.remark
        this.process.enable = row.enable === 1 ? '1' : '0'
        this.processCopy = JSON.stringify(this.process)
        this.statusCopy = JSON.stringify(this.process.status);
        this.dialogFormVisible = true
      })
    },
    deleteProcess() {
      if (this.selectedId.length <= 0) {
        this.$message.error('请选择要删除的记录')
        return
      }
      this.$api.SYS_PROCESS_DELETE({ids: this.selectedId}).then(() => {
        this.getData(this.page.currentPage)
        this.$message.success('删除成功')
      })
    },
    toAdd() {
      this.process = {
        id: '',
        name: '',
        remark: '',
        enable: '0',
        status: []
      }
      this.dialogFormVisible = true
    },
    StatusChange(index) {
      this.process.status.splice(index, 1)
    },
    showInputStatus() {
      this.editStatus.visible = true
    },
    saveEditStatus() {
      this.editStatus.visible = false
      if (this.editStatus.status === '' || this.editStatus.status.match(/\s/)) {
        this.editStatus.status = ''
        return
      }
      this.process.status.push(this.editStatus.status)
      this.editStatus.status = ''
    },
    reset() {
      this.process = JSON.parse(this.processCopy)
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('信息填写错误')
          return
        }
        if (this.process.status.length < 2) {
          this.$message.error('流程状态数量不能小于2个')
        }
        if (this.process.id == '') {
          this.submitForAdd();
          return;
        }
        if (this.processCopy === JSON.stringify(this.process)) {
          this.$message.warning('尚未改动任何信息')
          return
        }
        this.statusCopy = this.statusCopy === JSON.stringify(this.process.status) ? [] : this.process.status;
        this.processCopy = JSON.parse(this.processCopy)
        this.processCopy.name = this.processCopy.name === this.process.name ? null : this.process.name
        this.processCopy.remark = this.processCopy.remark === this.process.remark ? null : this.process.remark
        this.processCopy.status = this.statusCopy
        this.processCopy.enable = this.process.enable
        this.$api.SYS_PROCESS_UPDATE(this.processCopy).then(_ => {
          this.getData(1)
          this.dialogFormVisible = false
          this.$message.success('修改成功')
        })
      })
    },
    submitForAdd() {
      this.$api.SYS_PROCESS_ADD(this.process).then(_ => {
        this.getData(1)
        this.dialogFormVisible = false
        this.$message.success('新增成功')
        this.process = {
          id: '',
          name: '',
          remark: '',
          enable: '0',
          status: []
        }
      })
    },
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
