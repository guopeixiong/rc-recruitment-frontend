<template>
  <d2-container class="background">
    <el-descriptions size="medium" column="1" style="width: 50%;position: absolute;top: 50%;transform: translate(0, -90%)" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          昵称
        </template>
        {{userInfo.nickName || '未填写'}}
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="updateInfo('nickName', '昵称')"></el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          姓名
        </template>
        {{userInfo.fullName || '未填写'}}
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="updateInfo('fullName', '姓名')"></el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          邮箱
        </template>
        {{userInfo.email || '未填写'}}
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="updateInfo('email', '邮箱')" ></el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          手机号
        </template>
        {{userInfo.phone || '未填写'}}
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="updateInfo('phone', '手机号')"></el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-collection-tag"></i>
          学号
        </template>
        {{userInfo.stuNum || '未填写'}}
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="updateInfo('stuNum', '学号')"></el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-male"></i>
          <i class="el-icon-female"></i>
          性别
        </template>
        {{userInfo.sex === 1 ? '男' : userInfo.sex === 0 ? '女' : '未填写'}}
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="updateSex"></el-button>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-key"></i>
          密码
        </template>
        * * * * * * * *
        <el-button icon="el-icon-edit-outline" type="text" size="medium" @click="toChangePwd"></el-button>
      </el-descriptions-item>
    </el-descriptions>
    <el-dialog
      center
      :title="'修改' + updateItem"
      :visible.sync="editInfoDialog"
      width="20%">
      <el-input
        :placeholder="'请输入新' + updateItem"
        v-model="inputValue"
      />
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" size="small" @click="saveInfo">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      center
      title="修改密码"
      :visible.sync="editPwd"
      width="20%">
      <el-input
        show-password
        placeholder="请输入密码"
        v-model="newPwd"
      />
      <el-input
        show-password
        style="margin-top: 15px"
        placeholder="请再次输入密码"
        v-model="pwdAgain"
      />
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" size="small" @click="savePwd">确 定</el-button>
  </span>
    </el-dialog>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      inputValue: '',
      editInfoDialog: false,
      updateItem: '',
      updateKey: '',
      editPwd: false,
      newPwd: '',
      pwdAgain: ''
    }
  },
  methods: {
    getUserInfo() {
      this.$api.SYS_USER_USERINFO().then(res => {
        this.userInfo = res
      })
    },
    updateInfo(key, keyName) {
      this.updateItem = keyName
      this.updateKey = key
      this.inputValue = ''
      this.editInfoDialog = true
    },
    saveInfo() {
      if (this.inputValue === '' || this.inputValue.trim() === '') {
        this.$message.error(`请输入新${this.updateItem}`)
        return
      }
      const data = {}
      data[this.updateKey] = this.inputValue
      this.$api.SYS_USER_UPDATE(data).then(_ => {
        this.getUserInfo()
        this.editInfoDialog = false
        this.$message.success(`${this.updateItem}修改成功`)
      })
    },
    updateSex() {
      const data = {
        sex: this.userInfo.sex === 1 ? 0 : 1
      }
      this.$api.SYS_USER_UPDATE(data).then(_ => {
        this.getUserInfo()
        this.$message.success(`性别修改成功`)
      })
    },
    toChangePwd() {
      this.newPwd = ''
      this.pwdAgain = ''
      this.editPwd = true
    },
    savePwd() {
      if (this.newPwd === '' || this.newPwd.trim() === '') {
        this.$message.error('请输入密码')
        return
      }
      if (this.pwdAgain === '' || this.pwdAgain.trim() === '') {
        this.$message.error('请再次输入密码')
        return
      }
      if (this.newPwd !== this.pwdAgain) {
        this.$message.error('两次输入密码不一致')
        return
      }
      this.$api.SYS_USER_UPDATE_PWD(this.newPwd).then(_ => {
        this.editPwd = false
        this.$message.success('密码修改成功')
      })
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>
<style lang="scss">
</style>
