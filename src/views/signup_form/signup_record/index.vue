<template>
  <d2-container>
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="finishProcess">终止流程
    </el-button>
    <el-button size="small" type="warning" plain :disabled="selectedId.length <= 0" @click="sendEmail">发送邮件</el-button>
    <el-button size="small" type="primary" plain :disabled="selectedId.length <= 0" @click="toMeeting">进入面试
    </el-button>
    <el-button size="small" type="success" plain :disabled="selectedId.length <= 0" @click="nextStatus">进入下一流程
    </el-button>
    <el-select @change="loadStatus" v-model="templateId" placeholder="请选择报名表" size="small"
               style="margin-left: 10px">
      <el-option
        v-for="item in templates"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-select v-model="statusId" placeholder="请选择流程状态" size="small" style="margin-left: 10px">
      <el-option
        v-for="item in processStatus"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    <el-button icon="el-icon-search" circle size="small" style="margin-left: 10px" @click="getData(1)"></el-button>
    <el-button icon="el-icon-refresh" circle size="small" style="margin-left: 10px" @click="resetCondition"></el-button>
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
    <el-dialog :title="this.currentUserName + '的报名表'" :visible.sync="dialogFormVisible" center width="30%"
               :close-on-click-modal="false">
      <el-descriptions class="margin-top" :column="2" size="medium" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ this.userInfo.fullName ? this.userInfo.fullName : '未知' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ this.userInfo.phone ? this.userInfo.phone : '未知' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-lollipop"></i>
            昵称
          </template>
          {{ this.userInfo.nickName ? this.userInfo.nickName : '未知' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-male"></i>
            <i class="el-icon-female"></i>
            性别
          </template>
          <el-tag size="small">{{ this.userInfo.sex ? '男' : this.userInfo.sex === 0 ? '女' : '未知' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-postcard"></i>
            学号
          </template>
          {{ this.userInfo.stuNum ? this.userInfo.stuNum : '未知' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            邮箱
          </template>
          {{ this.userInfo.email ? this.userInfo.email : '未知' }}
        </el-descriptions-item>
      </el-descriptions>
      <el-card shadow="hover" v-for="(item, index) in formDetail" style="margin-top: 10px">
        <div class="qus">{{ index + 1 }}. {{ item.question }}</div>
        <div style="margin-top: 10px" v-if="item.type === 0">{{ item.answer }}</div>
        <div v-if="(item.type === 0 && !item.answer) || (item.type !== 0 && !item.optAnswer)"
             style="margin-top: 10px; color: #33333380">未作答
        </div>
        <div v-if="item.type === 1 && item.optAnswer" style="margin-top: 10px">
          <el-radio disabled>{{ item.optAnswer }}</el-radio>
        </div>
        <div v-if="item.type === 2" style="margin-top: 10px">
          <div v-for="opt in item.optAnswer">
            <el-checkbox checked disabled style="margin-top: 10px">{{ opt }}</el-checkbox>
          </div>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发送邮件" :visible.sync="dialogEmailVisible" center width="20%"
               :close-on-click-modal="false">
      <el-input v-model="email.title" placeholder="请输入邮件标题"></el-input>
      <el-input v-model="email.content"
                placeholder="请输入邮件内容"
                type="textarea"
                style="margin-top: 20px"
                :autosize="{ minRows: 2, maxRows: 6}"/>
      <div style="margin-top: 20px">
        保存为模板：
        <el-switch
          v-model="email.saveAsTemplate"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </div>
      <div style="margin-top: 20px">
        <el-select v-model="selectedEmailTmp" @change="setEmailContent" size="mini" placeholder="邮件模板">
          <el-option
            v-for="(item, index) in emailTemplates"
            :key="item.id"
            :label="item.subject"
            :value="index">
          </el-option>
        </el-select>
      </div>
      <el-divider content-position="center">邮件接收人</el-divider>
      <el-tag v-for="item in email.userName" style="margin-top: 10px">{{item}}</el-tag>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEmailVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="send" size="small">发 送</el-button>
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
          title: '姓名',
          key: 'userName',
          align: 'center'
        },
        {
          title: '当前流程',
          key: 'currentProcess',
          align: 'center'
        },
        {
          title: '流程状态',
          key: 'processEnd',
          align: 'center',
          formatter: function (row) {
            if (row.processEnd === 1) {
              return '已终止'
            }
            return '正常'
          }
        },
        {
          title: '报名时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '最后状态变更时间',
          key: 'updateTime',
          align: 'center',
          formatter: function (row) {
            if (row.updateTime) {
              return row.updateBy + '：' + row.updateTime
            }
            return '暂无'
          }
        },
      ],
      page: {
        currentPage: 1,
        pageSize: 10,
        pageCount: 0,
        background: true,
      },
      options: {
        cellStyle: function ({row, columnIndex}) {
          if (columnIndex != 3) {
            return {}
          }
          if (row.processEnd === 1) {
            return {
              'background-color': '#F56C6C10'
            };
          }
          return {}
        },
      },
      rowHandler: {
        columnHeader: '操作',
        fixed: 'right',
        align: 'center',
        custom: [
          {
            text: '查看详情',
            plain: true,
            size: 'small',
            emit: 'opt'
          }
        ]
      },
      data: [],
      selectedId: [],
      selectedItem: [],
      templateId: '',
      statusId: '',
      templates: [],
      processStatus: [],
      userInfo: {},
      currentUserName: '',
      formDetail: {},
      dialogFormVisible: false,
      dialogEmailVisible: false,
      email: {
        title: '',
        content: '',
        targetUser: [],
        userName: [],
        saveAsTemplate: '0'
      },
      emailTemplates: [],
      selectedEmailTmp: null
    }
  },
  methods: {
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    getData(current) {
      this.$api.SYS_SIGN_UP_RECORD_LIST({
        pageNum: current,
        pageSize: this.page.pageSize,
        templateId: this.templateId,
        statusId: this.statusId
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    handleSelectionChange(selection) {
      this.selectedId = []
      this.selectedItem = []
      selection.forEach(item => {
        this.selectedId.push(item.id)
        this.selectedItem.push(item)
      })
    },
    opt({_, row}) {
      this.currentUserName = row.userName
      this.$api.SYS_SIGN_UP_RECORD_PERSON({id: row.userId}).then(res => {
        this.userInfo = res
      })
      this.$api.SYS_SIGN_UP_RECORD_DETAIL({id: row.id}).then(res => {
        this.formDetail = res
        for (let i = 0; i < this.formDetail.length; i++) {
          if (this.formDetail[i].type === 2 && this.formDetail[i].optAnswer) {
            this.formDetail[i].optAnswer = this.formDetail[i].optAnswer.split(',')
          }
        }
        this.dialogFormVisible = true
      })
    },
    loadStatus(tempId) {
      let processId = ''
      for (let i = 0; i < this.templates.length; i++) {
        if (this.templates[i].id === tempId) {
          processId = this.templates[i].processId
        }
      }
      this.$api.SYS_SIGN_UP_RECORD_TMP_STATUS({id: processId}).then(res => {
        this.processStatus = res
      })
    },
    resetCondition() {
      this.templateId = ''
      this.statusId = ''
      this.processStatus = []
      this.getData(1)
    },
    finishProcess() {
      for (let i = 0; i < this.selectedId.length; i++) {
        if (this.selectedItem[i].processEnd === 1) {
          this.$message.error('选中记录中存在流程已结束的记录')
          return
        }
      }
      this.$api.SYS_SIGN_UP_RECORD_STATUS_END({ids: this.selectedId}).then(_ => {
        this.$message.success('流程结束成功')
        this.getData(1)
      })
    },
    nextStatus() {
      for (let i = 0; i < this.selectedId.length; i++) {
        if (this.selectedItem[i].processEnd === 1) {
          this.$message.error('选中记录中存在流程已结束的记录')
          return
        }
      }
      this.$api.SYS_SIGN_UP_RECORD_NEXT_STATUS({ids: this.selectedId}).then(_ => {
        this.$message.success('状态变更成功')
        this.getData(1)
      })
    },
    toMeeting() {
      this.$router.push({
        path: 'meeting',
        query: {
          items: this.selectedItem
        }
      })
    },
    sendEmail() {
      this.email.targetUser = []
      this.email.userName = []
      this.selectedItem.forEach(item => {
        this.email.targetUser.push(item.userId)
        this.email.userName.push(item.userName)
      })
      this.$api.SYS_EMAIL_TMP_LIST({pageNum: 1, pageSize: 100}).then(res => {
        this.emailTemplates = res.records
        this.dialogEmailVisible = true
      })
    },
    send() {
      if (this.email.title === '' || this.email.title.trim() === '') {
        this.$message.error('邮件标题不能为空')
        return
      }
      if (this.email.content === '' || this.email.content.trim() === '') {
        this.$message.error('邮件内容不能为空')
        return
      }
      this.$api.SYS_SIGN_UP_RECORD_SEND_EMAIL({
        title: this.email.title,
        content: this.email.content,
        targetIds: this.email.targetUser,
        saveAsTemplate: this.email.saveAsTemplate
      }).then(_ => {
        this.dialogEmailVisible = false
        this.email = {
          title: '',
          content: '',
          targetUser: [],
          userName: []
        }
        this.$message.success('发送成功，可到邮件发送记录查看')
      })
    },
    setEmailContent(index) {
      this.email.title = this.emailTemplates[index].subject
      this.email.content = this.emailTemplates[index].content
    },
  },
  created() {
    this.getData(1)
    this.$api.SYS_SIGN_UP_RECORD_TMP_LIST().then(res => {
      this.templates = res
    })
  }
}
</script>
<style lang="scss">
</style>
