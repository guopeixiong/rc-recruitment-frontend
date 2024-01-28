<template>
  <d2-container>
    <div style="display: flex;flex-wrap: wrap;">
      <el-upload
        :action="action"
        :multiple="false"
        :headers="heard"
        :on-success="uploadSuccess"
        :show-file-list="false"
        name="file">
        <el-card class="image-box" shadow="hover">
          <i class="el-icon-upload2" style="font-size: 70px;color: #33333350;margin-top: 20px"></i>
          <div style="color: #33333350;font-size: 15px;font-weight: bold">点击上传图片</div>
        </el-card>
      </el-upload>
      <el-card v-for="(item, index) in data" class="image-box" shadow="hover">
        <el-image
          style="height: 100px;"
          :preview-src-list="[imageUrlPrefix + '/resources' + item.url]"
          :src="imageUrlPrefix + '/resources' + item.url"
          fit="contain"/>
        <div>
          <el-button type="text" style="color: #F56C6C" size="medium" v-if="item.isEnabled === 1" @click="disable(item.id, index)">禁用</el-button>
          <el-button type="text" style="color: #67C23A" size="medium" v-if="item.isEnabled === 0" @click="enable(item.id, index)">启用</el-button>
          <el-button type="text" style="color: #F56C6C" size="medium" @click="deleteImage(item.id, index)">删除</el-button>
        </div>
        <div class="time">2024-01-28 11:11:11</div>
      </el-card>
    </div>
  </d2-container>
</template>
<script>
import util from '@/libs/util'
export default {
  data() {
    return {
      data: [],
      dialogImageUrl: '',
      dialogVisible: false,
      heard: {
        Authorization: util.cookies.get('token')
      },
      action: process.env.VUE_APP_API + '/admin/image/upload',
      imageUrlPrefix: process.env.VUE_APP_API
    }
  },
  methods: {
    getData() {
      this.$api.SYS_IMAGE_LIST().then(res => {
        this.data = res
        console.log(this.action)
      })
    },
    uploadSuccess(res) {
      if (res.code !== 200) {
        this.$message.error(res.msg)
        return
      }
      this.data.unshift(res.data)
      this.$message.success('上传成功')
    },
    enable(id, index) {
      this.$api.SYS_IMAGE_STATUS({id: id, status: 1}).then(_ => {
        this.data[index].isEnabled = 1
        this.$message.success('启用成功')
      })
    },
    disable(id, index) {
      this.$api.SYS_IMAGE_STATUS({id: id, status: 1}).then(_ => {
        this.data[index].isEnabled = 0
        this.$message.success('禁用成功')
      })
    },
    deleteImage(id, index) {
      this.$confirm('确认删除该图片吗', '警告', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.$api.SYS_IMAGE_DELETE({id: id}).then(_ => {
          this.data.splice(index, 1)
          this.$message.success('删除成功')
        })
      }).catch(() => {})
    },
  },
  created() {
    this.getData()
  }
}
</script>
<style lang="scss">
.image-box {
  width: 200px;
  margin: 15px;
  height: 190px;
  text-align: center;
  background-color: #F2F6FC70;
  transition: transform 0.3s ease;
  .time {
    font-size: 12px;
    color: #909399;
  }
}
.image-box:hover{
  transform: scale(1.1);
}
</style>
