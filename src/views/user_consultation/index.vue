<template>
  <d2-container>
    <el-button size="small" type="danger" plain :disabled="selectedId.length <= 0" @click="deleteItem">删除</el-button>
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
    <el-dialog title="咨询详情" :visible.sync="dialogFormVisible" center width="30%" :close-on-click-modal="false">
      <el-divider content-position="center">咨询用户信息</el-divider>
      <el-descriptions class="margin-top" :column="2" size="small" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{this.consulting.user.fullName ? this.consulting.user.fullName : '未知'}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{this.consulting.user.phone ? this.consulting.user.phone : '未知'}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-lollipop"></i>
            昵称
          </template>
          {{this.consulting.user.nickName ? this.consulting.user.nickName : '未知'}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-male"></i>
            <i class="el-icon-female"></i>
            性别
          </template>
          <el-tag size="small">{{this.consulting.user.sex ? '男' : this.consulting.user.sex === 0 ? '女' : '未知'}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-postcard"></i>
            学号
          </template>
          {{this.consulting.user.stuNum ? this.consulting.user.stuNum : '未知'}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            邮箱
          </template>
          {{this.consulting.user.email ? this.consulting.user.email : '未知'}}
        </el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="center">咨询内容</el-divider>
      <el-card shadow="hover">{{consulting.content}}</el-card>
      <el-divider content-position="center">回复内容</el-divider>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 6}"
        placeholder="请输入回复内容"
        v-model="consulting.replyContent">
      </el-input>
      <div class="tip"><i class="el-icon-warning"></i> 回复成功后将会发送邮件提醒用户咨询已有回复</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reset">恢 复</el-button>
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
          title: '咨询内容',
          key: 'content',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          title: '回复',
          key: 'replyContent',
          showOverflowTooltip: true,
          align: 'center',
          formatter: function (row) {
            if (row.replyContent) {
              return row.replyContent
            }
            return '未回复'
          }
        },
        {
          title: '咨询时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '最后回复',
          key: 'updateTime',
          align: 'center',
          formatter: function (row) {
            if (row.updateTime) {
              return row.updateBy + '：' + row.updateTime
            }
            return '未回复'
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
        highlightCurrentRow: true,
        stripe: true
      },
      rowHandler: {
        columnHeader: '操作',
        fixed: 'right',
        align: 'center',
        custom: [
          {
            text: '查看&回复',
            plain: true,
            size: 'small',
            emit: 'opt'
          }
        ]
      },
      data: [],
      selectedId: [],
      dialogFormVisible: false,
      consulting: {
        id: '',
        index: '',
        content: '',
        replyContent: '',
        user: {

        }
      }
    }
  },
  methods: {
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    getData(current) {
      this.$api.SYS_CONSULTING_LIST({
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
    opt({index, row}) {
      this.consulting.index = index
      this.consulting.id = row.id
      this.$api.SYS_CONSULTING_PERSON_INFO({id: row.userId}).then(res => {
        this.consulting.user = res
        this.consulting.content = row.content
        this.consulting.replyContent =row.replyContent
        this.dialogFormVisible = true
      })
    },
    deleteItem() {
      if (this.selectedId.length <= 0) {
        this.$message.error('请选择要删除的记录')
        return
      }
      this.$api.SYS_CONSULTING_DELETE({ids: this.selectedId}).then(() => {
        this.getData(this.page.currentPage)
        this.$message.success('删除成功')
      })
    },
    reset() {
      this.consulting.replyContent = this.data[this.consulting.index].replyContent
    },
    submit() {
      if (this.consulting.replyContent === '' || this.consulting.replyContent.match(/\s/)) {
        this.$message.error('回复内容不能为空')
        return
      }
      this.$api.SYS_CONSULTING_REPLY({
        id: this.consulting.id,
        replyContent: this.consulting.replyContent
      }).then(_ => {
        this.getData(1)
        this.dialogFormVisible = false
        this.$message.success('回复成功')
      })
    },
  },
  created() {
    this.getData(1)
  }
}
</script>
<style lang="scss">
.tip {
  margin-top: 20px;
}
</style>
