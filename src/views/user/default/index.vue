<template>
  <d2-container>
      <d2-crud
        ref="d2Crud"
        :columns="columns"
        :data="data"/>
  </d2-container>
</template>
<script>
export default {
  data() {
    return {
      columns: [{title: '名称'},{title: 'yxiang'}],
      data: []
    }
  }
}
</script>
