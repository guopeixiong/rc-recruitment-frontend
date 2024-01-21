<template>
  <d2-container>
    <div style="display: flex">
      <div style="margin-left: 10px">
        <el-select v-model="status" placeholder="请选择登录结果" size="small">
          <el-option
            v-for="item in statusList"
            :label="item.desc"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
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
      :data="data"
      @pagination-current-change="paginationCurrentChange"/>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: '学号/邮箱',
          key: 'requestParam',
          align: 'center',
          formatter: function (row) {
            const account = JSON.parse(row.requestParam)
            return account.stuNum || account.email
          }
        },
        {
          title: 'ip',
          key: 'requestIp',
          align: 'center',
          formatter: function (row) {
            if (!row.requestIp) {
              return '暂无'
            }
            return row.requestIp
          }
        },
        {
          title: '登录时间',
          key: 'createTime',
          align: 'center'
        },
        {
          title: '错误信息',
          key: 'errorMsg',
          align: 'center',
          showOverflowTooltip: true,
          formatter: function (row) {
            if (!row.errorMsg) {
              return '无'
            }
            return row.errorMsg
          }
        },
        {
          title: '登录结果',
          key: 'status',
          align: 'center'
        },
      ],
      data: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        pageCount: 0,
        background: true,
      },
      options: {
        highlightCurrentRow: true,
        stripe: true,
        cellStyle: function ({row, columnIndex}) {
          if (columnIndex != 4) {
            return {}
          }
          if (row.status !== 'SUCCESS') {
            return {
              'background-color': '#F56C6C60'
            }
          }
          return {}
        },
      },
      status: '',
      startTime: null,
      endTime: null,
      statusList: [{desc: 'SUCCESS', value: 0}, {desc: 'FAIL', value: 1}],
      time: null
    }
  },
  methods: {
    paginationCurrentChange(currentPage) {
      this.getData(currentPage)
    },
    getData(current) {
      if (this.time != null) {
        this.startTime = this.time[0]
        this.endTime = this.time[1]
      } else {
        this.startTime = null
        this.endTime = null
      }
      this.$api.SYS_LOG_LIST({
        type: 2,
        pageNum: current,
        pageSize: this.page.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    resetCondition() {
      this.status = ''
      this.startTime = null
      this.endTime = null
      this.time = null
      this.getData(1)
    },
  },
  created() {
    this.getData(1)
  }
}
</script>
