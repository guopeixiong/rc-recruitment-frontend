<template>
  <d2-container>
    <div style="display: flex">
      <div><el-input placeholder="请输入姓名前缀" v-model="name" maxlength="10" size="small"/></div>
      <div style="margin-left: 10px"><el-input placeholder="请输入邮箱前缀" v-model="email" maxlength="25" size="small"/></div>
      <div style="margin-left: 10px"><el-input placeholder="请输入标题前缀" v-model="title" maxlength="10" size="small"/></div>
      <div style="margin-left: 10px">
        <el-date-picker
          size="small"
          v-model="time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </div>
      <el-button icon="el-icon-search" circle size="small" style="margin-left: 10px" @click="getData(1)"></el-button>
      <el-button icon="el-icon-refresh" circle size="small" style="margin-left: 10px" @click="resetCondition"></el-button>
    </div>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :pagination="page"
      :options="options"
      @pagination-current-change="paginationCurrentChange"
      :data="data"/>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: '接收人',
          key: 'name',
          align: 'center'
        },
        {
          title: '接收邮箱',
          key: 'targetEmail',
          align: 'center'
        },
        {
          title: '标题',
          key: 'subject',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          title: '内容',
          showOverflowTooltip: true,
          key: 'content',
          align: 'center'
        },
        {
          title: '发送人',
          key: 'createBy',
          align: 'center'
        },
        {
          title: '发送时间',
          key: 'createTime',
          align: 'center'
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
      data: [],
      name: '',
      email: '',
      title: '',
      time: null,
      startTime: null,
      endTime: null
    }
  },
  methods: {
    getData(current) {
      if (this.name.trim() === '') {
        this.name = ''
      }
      if (this.email.trim() === '') {
        this.email = ''
      }
      if (this.title.trim() === '') {
        this.title = ''
      }
      if (this.time != null) {
        this.startTime = this.time[0]
        this.endTime = this.time[1]
      } else {
        this.startTime = null
        this.endTime = null
      }
      this.$api.SYS_EMAIL_SEND_RECORD({
        pageNum: current,
        pageSize: this.page.pageSize,
        name: this.name,
        email: this.email,
        title: this.title,
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      });
    },
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    resetCondition() {
      this.name = ''
      this.email = ''
      this.title = ''
      this.getData(1)
    }
  },
  created() {
    this.getData(1)
  }
}
</script>
