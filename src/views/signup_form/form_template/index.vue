<template>
  <d2-container>
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteTmp">删除</el-button>
    <el-button size="small" type="success" plain @click="toAddTmp">新增</el-button>
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
      @opt="optTmp"/>
    <el-dialog title="新增报名表" :visible.sync="dialogFormVisibleTemplate" :close-on-click-modal="false" center
               width="30%">
      <el-form :model="tmp" :rules="rules" ref="tmp">
        <el-form-item prop="name">
          <el-input
            placeholder="请输入报名表名称"
            maxlength="20"
            v-model="tmp.name">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="tmp.processId" placeholder="请选择流程">
            <el-option
              v-for="item in processIds"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span style="color: #33333390">创建成功后请点击 查看&编辑 按钮添加题目</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleTemplate = false">取 消</el-button>
        <el-button type="primary" @click="submitAddTmp('tmp')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogFormVisibleTemplateDetail" :close-on-click-modal="false" center
               width="50%">
      <div class="form-box">
        <div class="form-detail">
          <el-empty v-if="formDetail.length <= 0" description="请添加题目"></el-empty>
          <div class="qus-box" v-for="(item, index) in formDetail" v-if="refreshForm">
            <el-card shadow="hover" :style="item.type === 0 ? 'background-color: #67C23A20' : item.type === 1 ? 'background-color: #409EFF20' : 'background-color: #E6A23C20'">
            <div class="head">
              <div class="index-opt">
                <el-button icon="el-icon-top" circle size="mini" v-if="index > 0"
                           @click="changeIndex(index, true)"></el-button>
                <el-button icon="el-icon-bottom" circle size="mini" v-if="index < formDetail.length - 1"
                           @click="changeIndex(index, false)"></el-button>
                <el-button icon="el-icon-delete" circle size="mini" @click="deleteQus(index)"></el-button>
              </div>
              <div class="qus-index">第 {{ index + 1 }} 题</div>
              <div class="required-opt">
                必答：
                <el-switch
                  v-model="item.isRequire"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
              </div>
            </div>
            <div class="qus-content">
              <div><el-input v-model="item.content" placeholder="请输入问题内容" size="small"></el-input></div>
            </div>
            <el-input v-if="item.type == 0" placeholder="请输入您的回答" size="mini" disabled></el-input>
            <div class="answer-options" v-if="item.type === 1">
              <div class="options-item" v-for="(_, optionIndex) in item.options">
                <div class="options-icon">
                  <el-radio disabled></el-radio>
                </div>
                <div class="options-input">
                  <el-input v-model="item.options[optionIndex]" placeholder="请输入选项内容" size="mini"></el-input>
                </div>
                <div class="options-delete">
                  <el-button icon="el-icon-delete" type="text" circle size="small"
                             @click="deleteOption(index, optionIndex)" v-if="optionIndex >= 2"></el-button>
                </div>
              </div>
              <div>
                <el-button type="text" size="mini" @click="addOption(index)">添加选项</el-button>
              </div>
            </div>
            <div class="answer-options" v-if="item.type === 2">
              <div class="options-item" v-for="(_, optionIndex) in item.options">
                <div class="options-icon">
                  <el-checkbox checked disabled style="padding-right: 10px"></el-checkbox>
                </div>
                <div class="options-input">
                  <el-input v-model="item.options[optionIndex]" placeholder="请输入选项内容" size="mini"></el-input>
                </div>
                <div class="options-delete">
                  <el-button icon="el-icon-delete" type="text" circle size="small"
                             @click="deleteOption(index, optionIndex)" v-if="optionIndex >= 2"></el-button>
                </div>
              </div>
              <div>
                <el-button type="text" size="mini" @click="addOption(index)">添加选项</el-button>
              </div>
            </div>
            </el-card>
          </div>
        </div>
        <div class="form-opt">
          <div class="opt">
            <el-input v-model="tmpDetail.name" placeholder="请输入报名表名称" size="small"></el-input>
          </div>
          <div class="opt">
            <el-select v-model="tmpDetail.processId" size="small" placeholder="请选择流程">
              <el-option
                v-for="item in processIds"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="opt">点击下方按钮插入题目</div>
          <div class="opt">
            <el-button icon="el-icon-edit" style="background-color: #67C23A20; color: #909399" size="mini"
                       @click="newQus(0)">文本题
            </el-button>
          </div>
          <div class="opt">
            <el-button icon="el-icon-crop" style="background-color: #409EFF20; color: #909399" size="mini"
                       @click="newQus(1)">单选题
            </el-button>
          </div>
          <div class="opt">
            <el-button icon="el-icon-copy-document" style="background-color: #E6A23C20; color: #909399" size="mini"
                       @click="newQus(2)">多选题
            </el-button>
          </div>
          <div class="opt">
            启用：
            <el-switch
              v-model="tmpDetail.enable"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </div>
          <div class="opt">
            <el-button size="mini" @click="reset">恢复</el-button>
          </div>
          <div class="opt">
            <el-button type="primary" size="mini" @click="submitForm">保存</el-button>
          </div>
        </div>
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
          title: '报名表名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '流程名称',
          key: 'processName',
          align: 'center'
        },
        {
          title: '是否启用',
          key: 'isEnabled',
          align: 'center',
          formatter: function (row) {
            if (row.isEnabled === 1) {
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
      data: [],
      dialogFormVisibleTemplate: false,
      dialogFormVisibleTemplateDetail: false,
      selectedId: [],
      tmp: {
        name: '',
        processId: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入问题', trigger: 'blur'}
        ]
      },
      processIds: null,
      tmpDetail: {
        id: '',
        enable: '0',
        processId: '',
        name: '',
        rowIndex: 0
      },
      refreshForm: true,
      formDetail: [],
      formDetailCopy: []
    }
  },
  methods: {
    getData(current) {
      this.$api.SYS_TEMPLATE_LIST({
        pageNum: current,
        pageSize: this.page.pageSize
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    optTmp({index, row}) {
      this.loadProcessIds()
      this.tmpDetail.id = row.id
      this.tmpDetail.processId = row.processId
      this.tmpDetail.enable = row.isEnabled === 1 ? '1' : 0
      this.tmpDetail.name = row.name
      this.tmpDetail.rowIndex = index
      this.$api.SYS_TEMPLATE_DETAIL({id: row.id}).then(res => {
        this.formDetail = res
        this.formDetailCopy = JSON.stringify(res)
        this.dialogFormVisibleTemplateDetail = true
      });
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
      this.$api.SYS_TEMPLATE_DELETE({ids: this.selectedId}).then(() => {
        this.getData(this.page.currentPage)
        this.$message.success('删除成功')
      })
    },
    submitAddTmp(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message.error('信息填写不完整')
          return
        }
        this.$api.SYS_TEMPLATE_ADD(this.tmp).then(_ => {
          this.getData(1)
          this.dialogFormVisibleTemplate = false
          this.$message.success('报名表创建成功')
          this.tmp = {
            name: '',
            processId: ''
          }
        })
      })
    },
    loadProcessIds() {
      if (this.processIds == null) {
        this.$api.SYS_TEMPLATE_PROCESS_LIST().then(res => {
          this.processIds = res
        });
      }
    },
    toAddTmp() {
      this.loadProcessIds()
      this.dialogFormVisibleTemplate = true;
    },
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    changeIndex(index, isTop) {
      let temp = this.formDetail[index]
      this.formDetail[index] = this.formDetail[isTop ? index - 1 : index + 1]
      this.formDetail[isTop ? index - 1 : index + 1] = temp
      this.refreshForm = false
      this.refreshForm = true
    },
    deleteQus(index) {
      this.formDetail.splice(index, 1)
    },
    newQus(type) {
      switch (type) {
        case 0:
          this.formDetail.push({
            content: '',
            type: 0,
            isRequire: '0'
          })
          break
        case 1:
          this.formDetail.push({
            content: '',
            type: 1,
            isRequire: '0',
            options: ['', '']
          })
          break
        case 2:
          this.formDetail.push({
            content: '',
            type: 2,
            isRequire: '0',
            options: ['', '']
          })
      }
    },
    deleteOption(index, optionIndex) {
      this.formDetail[index].options.splice(optionIndex, 1)
    },
    addOption(index) {
      this.formDetail[index].options.push('')
    },
    submitForm() {
      if (this.formDetail.length <= 0) {
        this.$message.error('请增加问题后再提交')
        return
      }
      if (this.tmpDetail.name === '' || this.tmpDetail.name.match(/\s/)) {
        this.$message.error('请输入报名表名称')
        return
      }
      for (let i = 0; i < this.formDetail.length; i++) {
        if (this.formDetail[i].content === '' || this.formDetail[i].content.match(/\s/)) {
          this.$message.error('问题内容不能为空')
          return
        }
        if (this.formDetail[i].type !== 0) {
          if (this.formDetail[i].options.length < 2) {
            this.$message.error('选择题选项不能少于2个')
            return
          }
          for (let j = 0; j < this.formDetail[i].options.length; j++) {
            if (this.formDetail[i].options[j] === '' || this.formDetail[i].options[j].match(/\s/)) {
              this.$message.error('选项内容不能为空')
              return
            }
          }
        }
      }
      const name = this.tmpDetail.name == this.data[this.tmpDetail.rowIndex].name ? null : this.tmpDetail.name
      const processId = this.tmpDetail.processId == this.data[this.tmpDetail.rowIndex].processId ? null : this.tmpDetail.processId
      const needUpdateQus = this.formDetailCopy !== JSON.stringify(this.formDetail)
      this.$api.SYS_TEMPLATE_UPDATE({
        id: this.tmpDetail.id,
        isEnabled: this.tmpDetail.enable,
        name: name,
        processId: processId,
        questions: needUpdateQus ? this.formDetail : []
      }).then(_ => {
        this.getData(1)
        this.dialogFormVisibleTemplateDetail = false
        this.$message.success('报名表修改成功')
      })
    },
    reset() {
      this.formDetail = JSON.parse(this.formDetailCopy)
    },
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">
.form-box {
  display: flex;

  .form-detail {
    flex: 3;
    border: #33333320 1px solid;
    padding: 20px;
    .qus-box {
      margin-bottom: 20px;
      .head {
        display: flex;

        .index-opt {
          text-align: left;
          flex: 1;
        }

        .qus-index {
          text-align: center;
          flex: 1;
        }

        .required-opt {
          text-align: right;
          flex: 1;
        }
      }

      .qus-content {
        display: flex;
        margin: 10px 0;

      }

      .answer-options {
        .options-item {
          display: flex;
          margin-bottom: 10px;

          .options-icon {
            text-align: left;
          }

          .options-input {
            text-align: left;
          }

          .options-delete {
            text-align: left;
          }
        }
      }
    }
  }

  .form-opt {
    flex: 1;
    text-align: left;
    padding-left: 20px;

    .opt {
      color: #33333390;
      margin-bottom: 20px;
    }
  }
}
</style>
