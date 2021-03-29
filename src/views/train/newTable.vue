<!--  -->
<template>
  <div class='training-jobs' style="margin-top:50px; margin-left:25px">
    <el-button  @click="createbtn" style="font-size:30px;">创建训练任务</el-button>
  </div>
 
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    components: {},
    data() {
    return {

    };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        createbtn:function(){
            console.log('this is createbtn')
        }
    },
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类

</style>