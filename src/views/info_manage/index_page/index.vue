<template>
  <d2-container>
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteInfo">删除</el-button>
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
      @enable="enable"
      @edit="edit"/>
    <el-dialog title="新增简介" :visible.sync="addDialog" center width="40%"
               :close-on-click-modal="false">
        <el-input
          placeholder="请输入标题"
          maxlength="20"
          show-word-limit
          v-model="form.title">
        </el-input>
      <el-input
        style="margin-top: 30px"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6}"
        placeholder="请输入备注"
        maxlength="100"
        show-word-limit
        v-model="form.remark">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForAdd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="currentTitle" :visible.sync="editDialog" center width="60%"
               :close-on-click-modal="false">
      <div>
        <el-input
          style="width: 50%"
          placeholder="请输入标题"
          maxlength="20"
          show-word-limit
          v-model="detail.title">
        </el-input>
      </div>
      <div>
        <el-input
          style="margin-top: 10px; margin-bottom: 10px; width: 50%"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6}"
          placeholder="请输入备注"
          maxlength="100"
          show-word-limit
          v-model="detail.remark"/>
      </div>
      <div style="border: 1px solid #ccc;">
        <Toolbar
          style="border-bottom: 1px solid #ccc"
          :editor="editor"
          :mode="mode"
        />
        <Editor
          style="height: 200px; overflow-y: hidden;"
          v-model="detail.content"
          :defaultConfig="editorConfig"
          :mode="mode"
          @onCreated="onCreated"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">恢 复</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>
<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  components: {Editor, Toolbar},
  data() {
    return {
      columns: [
        {
          title: '标题',
          key: 'title',
          align: 'center'
        },
        {
          title: '备注',
          key: 'remark',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          title: '启用',
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
            type: 'text',
            size: 'small',
            emit: 'edit'
          },
          {
            text: '启用',
            type: 'text',
            size: 'small',
            emit: 'enable',
            show: function (index, row) {
              return row.enable === 0
            }
          }
        ]
      },
      data: [],
      selectedId: [],
      editor: null,
      html: '',
      editorConfig: { placeholder: '请输入内容' },
      mode: 'simple',
      editDialog: false,
      addDialog: false,
      selectHaveEnable: false,
      form: {
        title: '',
        remark: ''
      },
      currentTitle: '',
      detail: {
        id: '',
        title: '',
        remark: '',
        content: ''
      },
      detailCopy: ''
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    save() {
      if (this.detailCopy === JSON.stringify(this.detail)) {
        this.$message.error('尚未改动任何信息')
        return
      }
      this.detailCopy = JSON.parse(this.detailCopy)
      if (this.detailCopy.title === this.detail.title) {
        delete this.detailCopy.title
      } else {
        this.detailCopy.title = this.detail.title
      }
      if (this.detailCopy.remark === this.detail.remark) {
        delete this.detailCopy.remark
      } else {
        this.detailCopy.remark = this.detail.remark
      }
      if (this.detailCopy.content === this.detail.content) {
        delete this.detailCopy.content
      } else {
        this.detailCopy.content = this.detail.content
      }
      this.$api.SYS_INDEX_INFO_UPDATE(this.detailCopy).then(_ => {
        this.getData(1)
        this.editDialog = false
        this.$message.success('修改成功')
      })
    },
    handleSelectionChange(selection) {
      this.selectedId = []
      this.selectHaveEnable = false
      selection.forEach(item => {
        if (item.enable === 1) {
          this.selectHaveEnable = true
        }
        this.selectedId.push(item.id)
      })
    },
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    getData(current) {
      this.$api.SYS_INDEX_INFO({
        pageNum: current,
        pageSize: this.page.pageSize
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    edit({row}) {
      this.currentTitle = row.title
      this.detail.id = row.id
      this.detail.title = row.title
      this.detail.remark = row.remark
      this.$api.SYS_INDEX_INFO_DETAIL({id: row.id}).then(res => {
        this.detail.content = res ? res : ''
        this.detailCopy = JSON.stringify(this.detail)
        this.editDialog = true
      })
    },
    enable({row}) {
      this.$api.SYS_INDEX_INFO_ENABLE({id: row.id}).then(_ => {
        this.$message.success('启用成功')
        this.getData(1)
      })
    },
    deleteInfo() {
      if (this.selectHaveEnable) {
        this.$message.error('选中记录包含已经启用记录，无法删除')
        return
      }
      this.$api.SYS_INDEX_INFO_DELETE({ids: this.selectedId}).then(_ => {
        this.$message.success('删除成功')
        this.getData(1)
      })
    },
    toAdd() {
      this.addDialog = true
    },
    submitForAdd() {
      if (this.form.title === '' || this.form.title.trim() === '') {
        this.$message.error('标题不能为空')
        return
      }
      if (this.form.remark !== '' && this.form.remark.length > 200) {
        this.$message.error('备注不能超过200字')
        return
      }
      this.$api.SYS_INDEX_INFO_ADD(this.form).then(_ => {
        this.getData(1)
        this.addDialog = false
        this.$message.success('新增成功')
        this.form = {
          title: '',
          remark: ''
        }
      })
    },
    reset() {
      this.detail = JSON.parse(this.detailCopy)
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  created() {
    this.getData(1)
  }
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
