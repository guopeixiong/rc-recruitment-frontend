<template>
  <d2-container>
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteActivity">删除</el-button>
    <el-button size="small" type="success" plain @click="toAddActivity">新增</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" center width="60%" :close-on-click-modal="false">
      <el-form>
        <el-form-item label="活动名称">
          <el-input
            placeholder="请输入活动名称"
            maxlength="255"
            v-model="activity.name">
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            placeholder="请输入活动备注"
            maxlength="255"
            v-model="activity.remark">
          </el-input>
        </el-form-item>
        <el-form-item>
          <div>报名表</div>
          <el-select v-model="activity.templateId" placeholder="请选择报名表" clearable>
            <el-option
              v-for="item in signUpTemplates"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div>活动详情</div>
        <div style="border: 1px solid #ccc;margin-top: 10px">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :mode="mode"
          />
          <Editor
            style="height: 200px; overflow-y: hidden;"
            v-model="activity.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
          />
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="reset">恢 复</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
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
          title: '活动名称',
          key: 'name',
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
            return '无'
          }
        },
        {
          title: '绑定报名表',
          align: 'center',
          formatter: function (row) {
            if (row.templateId) {
              return '已绑定'
            }
            return '无'
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
      data: [],
      selectedId: [],
      dialogFormVisible: false,
      dialogTitle: '新增活动',
      activity: {
        name: '',
        remark: '',
        templateId: '',
        content: ''
      },
      activityCopy: '',
      signUpTemplates: [],
      editor: null,
      editorConfig: { placeholder: '请输入内容' },
      mode: 'simple',
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    getData(current) {
      this.loadSignTemplate()
      this.$api.SYS_ACTIVITY_LIST({
        pageNum: current,
        pageSize: this.page.pageSize
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    handleSelectionChange(selection) {
      this.selectedId = []
      selection.forEach(item => {
        this.selectedId.push(item.id)
      })
    },
    opt({row}) {
      this.dialogTitle = row.name
      this.$api.SYS_ACTIVITY_DETAIL({id: row.id}).then(res => {
        this.activity.content = res.content
        this.activity.id = row.id
        this.activity.templateId = row.templateId
        this.activity.remark = row.remark
        this.activity.name = row.name
        this.activityCopy = JSON.stringify(this.activity)
        this.dialogFormVisible = true
      })
    },
    toAddActivity() {
      this.dialogTitle = '新增活动'
      this.loadSignTemplate()
      this.activity = {
        name: '',
        remark: '',
        templateId: '',
        content: ''
      }
      this.dialogFormVisible = true
    },
    deleteActivity() {
      this.$api.SYS_ACTIVITY_DELETE({ids: this.selectedId}).then(_ => {
        this.getData(1)
        this.$message.success('删除成功')
      })
    },
    loadSignTemplate() {
      if (this.signUpTemplates.length > 0) {
        return
      }
      this.$api.SYS_ACTIVITY_SIGN_UP_TEMP_LIST().then(res => {
        this.signUpTemplates = res
      })
    },
    submit() {
      if (this.activity.id) {
        this.edit()
        return
      }
      if (!this.activity.name) {
        this.$message.error('活动名称不能为空')
        return
      }
      this.$api.SYS_ACTIVITY_ADD(this.activity).then(_ => {
        this.getData(1)
        this.dialogFormVisible = false
        this.$message.success('新增成功')
      })
    },
    edit() {
      if (this.activityCopy === JSON.stringify(this.activity)) {
        this.$message.warning('未改动任何信息')
        return
      }
      this.activityCopy = JSON.parse(this.activityCopy)
      if (this.activityCopy.name === this.activity.name) {
        delete this.activityCopy.name
      } else {
        this.activityCopy.name = this.activity.name
      }
      if (this.activityCopy.remark === this.activity.remark) {
        delete this.activityCopy.remark
      } else {
        this.activityCopy.remark = this.activity.remark
      }
      if (this.activityCopy.templateId === this.activity.templateId) {
        delete this.activityCopy.templateId
      } else {
        this.activityCopy.templateId = this.activity.templateId
      }
      if (this.activityCopy.content === this.activity.content) {
        delete this.activityCopy.content
      } else {
        this.activityCopy.content = this.activity.content
      }
      this.$api.SYS_ACTIVITY_EDIT(this.activityCopy).then(_ => {
        this.$message.success('修改成功')
        this.getData(1)
        this.dialogFormVisible = false
      })
    },
    reset() {
      this.activity = JSON.parse(this.activityCopy)
    },
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">

</style>
