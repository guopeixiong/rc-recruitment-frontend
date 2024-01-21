<template>
  <d2-container>
    <div style="display: flex">
      <div style="margin-left: 10px">
        <el-select v-model="title" placeholder="请选择标题" size="small">
          <el-option
            v-for="item in titleList"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div style="margin-left: 10px">
        <el-select v-model="requestMethod" placeholder="请选择请求方式" size="small">
          <el-option
            v-for="item in requestMethodList"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <div style="margin-left: 10px">
        <el-select v-model="status" placeholder="请选择操作结果" size="small">
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
          title: '标题',
          key: 'title',
          align: 'center'
        },
        {
          title: '请求方式',
          key: 'requestMethod',
          align: 'center',
          formatter: function (row) {
            if (!row.requestMethod) {
              return '暂无'
            }
            return row.requestMethod
          }
        },
        {
          title: '请求url',
          key: 'requestUrl',
          align: 'center',
          showOverflowTooltip: true
        },
        {
          title: '操作人&时间',
          key: 'createTime',
          align: 'center',
          formatter: function (row) {
            if (!row.createBy) {
              return '未知操作人名称' + '：' + row.createTime
            }
            return row.createBy + '：' + row.createTime
          }
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
          title: '操作状态',
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
          if (columnIndex != 5) {
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
      title: '',
      requestMethod: '',
      status: '',
      startTime: null,
      endTime: null,
      titleList: [],
      requestMethodList: ['GET', 'POST', 'PUT', 'DELETE'],
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
        type: 1,
        pageNum: current,
        pageSize: this.page.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.title,
        requestMethod: this.requestMethod,
        status: this.status
      }).then(res => {
        this.data = res.records
        this.page.currentPage = Number(res.current)
        this.page.pageCount = Number(res.pages)
      })
    },
    resetCondition() {
      this.title = ''
      this.operaType = ''
      this.requestMethod = ''
      this.status = ''
      this.startTime = null
      this.endTime = null
      this.time = null
      this.getData(1)
    },
  },
  created() {
    this.getData(1)
    this.$api.SYS_LOG_TITLE_LIST({type: 1}).then(res => this.titleList = res)
  }
}
</script>
