<template>
  <d2-container>
    <el-tabs style="width: 60%; margin: auto">
      <el-tab-pane :label="item.userInfo.fullName" v-for="item in personInfo">
        <el-descriptions class="margin-top" :column="2" size="medium" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{item.userInfo.fullName ? item.userInfo.fullName : '未知'}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            {{item.userInfo.phone ? item.userInfo.phone : '未知'}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-lollipop"></i>
              昵称
            </template>
            {{item.userInfo.nickName ? item.userInfo.nickName : '未知'}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              性别
            </template>
            <el-tag size="small">{{item.userInfo.sex ? '男' : item.userInfo.sex === 0 ? '女' : '未知'}}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              学号
            </template>
            {{item.userInfo.stuNum ? item.userInfo.stuNum : '未知'}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-message"></i>
              邮箱
            </template>
            {{item.userInfo.email ? item.userInfo.email : '未知'}}
          </el-descriptions-item>
        </el-descriptions>
        <el-card shadow="hover" v-for="(item1, index) in item.formDetail" style="margin-top: 20px">
          <div class="qus">{{index + 1}}. {{item1.question}}</div>
          <div style="margin-top: 10px" v-if="item1.type === 0">{{item1.answer}}</div>
          <div v-if="(item1.type === 0 && !item1.answer) || (item1.type !== 0 && !item1.optAnswer)" style="margin-top: 10px; color: #33333380">未作答</div>
          <div v-if="item1.type === 1 && item1.optAnswer" style="margin-top: 10px">
            <el-radio disabled>{{item1.optAnswer}}</el-radio>
          </div>
          <div v-if="item1.type === 2" style="margin-top: 10px">
            <div v-for="opt in item1.optAnswer">
              <el-checkbox checked disabled style="margin-top: 10px">{{opt}}</el-checkbox>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </d2-container>
</template>
<script>
import util from "@/libs/util";
export default {
  data() {
    return {
      personInfo: [],
      current: {},
      index: 0
    }
  },
  methods: {
    loadData(items) {
      items.forEach(item => {
        let data = {
          userInfo: {},
          formDetail: []
        }
        this.$api.SYS_SIGN_UP_RECORD_PERSON({id: item.userId}).then(res => {
          data.userInfo = res
        })
        this.$api.SYS_SIGN_UP_RECORD_DETAIL({id: item.id}).then(res => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].type === 2 && res[i].optAnswer) {
              res[i].optAnswer = res[i].optAnswer.split(',')
            }
          }
          data.formDetail = res
        })
        this.personInfo.push(data)
      })
      this.current = this.personInfo[0]
      this.index = 0
      localStorage.setItem('rc/meeting/' + util.cookies.get('userId'), JSON.stringify(this.personInfo))
    }
  },
  created() {
    const items = this.$route.query.items
    this.loadData(items)
  }
}
</script>
