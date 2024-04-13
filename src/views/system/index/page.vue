<template>
  <d2-container>
    <div style="display: flex">
      <div style="flex: 1;margin-top: 20px; margin-left: 30px; margin-right: 30px">
        <div style="padding: 20px; border: 2px #DCDFE6 solid; border-radius: 10px;" class="box">
          <div style="text-align: center; font-weight: bold; color: #606266">待回复咨询</div>
          <el-table
            stripe
            :show-header="false"
            height="30vh"
            :data="consulting">
            <el-table-column
              prop="content"
              show-overflow-tooltip
              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              align="center">
            </el-table-column>
          </el-table>
        </div>
        <div style="padding: 20px; border: 2px #DCDFE6 solid; border-radius: 10px; margin-top: 3vh" class="box">
          <div style="text-align: center; font-weight: bold; color: #606266">当前用户可见Q&A</div>
          <el-table
            stripe
            height="30vh"
            :data="qa">
            <el-table-column
              prop="question"
              show-overflow-tooltip
              label="问题"
              align="center">
            </el-table-column>
            <el-table-column
              prop="answer"
              label="回答"
              show-overflow-tooltip
              align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div style="flex: 1; margin-top: 20px; margin-right: 30px">
        <div style="padding: 20px; border: 2px #DCDFE6 solid; border-radius: 10px" class="box">
          <div style="text-align: center; font-weight: bold; color: #606266">最近报名</div>
          <el-table
            stripe
            :show-header="false"
            height="30vh"
            :data="lastSignRecord">
            <el-table-column
              prop="userName"
              align="left">
            </el-table-column>
            <el-table-column
              prop="createTime"
              align="left">
            </el-table-column>
          </el-table>
        </div>
        <div style="padding: 20px; border: 2px #DCDFE6 solid; border-radius: 10px; margin-top: 3vh" class="box">
          <div style="text-align: center; font-weight: bold; color: #606266">最近异常日志</div>
          <el-table
            stripe
            height="30vh"
            :show-header="false"
            :data="lastErrorLog">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" class="demo-table-expand">
                  <el-form-item label="操作人：">
                    <span>{{ props.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="请求地址：">
                    <span>{{ props.row.requestUrl }}</span>
                  </el-form-item>
                  <el-form-item label="异常信息：">
                    <span>{{ props.row.errorMsg }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              prop="title"
              align="left">
            </el-table-column>
            <el-table-column
              prop="createTime"
              align="left">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      lastSignRecord: [],
      lastErrorLog: [],
      consulting: [],
      qa: []
    }
  },
  methods: {
    getLastSign() {
      this.$api.SYS_INDEX_LAST_SIGN_UP().then(res => {
        this.lastSignRecord = res
      })
    },
    getLastErrorLog() {
      this.$api.SYS_INDEX_LAST_ERROR_LOG().then(res => {
        this.lastErrorLog = res
      })
    },
    getConsulting() {
      this.$api.SYS_INDEX_GET_CONSULTING().then(res => {
        this.consulting = res
      })
    },
    getQa() {
      this.$api.SYS_INDEX_QA().then(res => {
        this.qa = res
      })
    }
  },
  created() {
    this.getLastSign()
    this.getLastErrorLog()
    this.getConsulting()
    this.getQa()
  }
}
</script>

<style lang="scss" scoped>
.box {
  transition: transform 0.3s ease;
}

.box:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
