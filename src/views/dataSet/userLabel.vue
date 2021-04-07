<template>
  <div class="dashboard-container">
    <el-container>
    <el-header class="header">
      <span style="font-size: 20px">
        {{this.$route.query.dataName}}
      </span>
      <el-button size="small" style="margin-left:100px" icon="el-icon-arrow-left" @click="toDataSet">
        返回数据集
      </el-button>
    </el-header>
    <el-main>
      <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="全部数据">
          <el-container>
            <el-main>
              <el-row>
                <el-button icon="el-icon-plus" @click="addData">添加数据</el-button>
                <el-button icon="el-icon-delete" @click="deData">删除数据</el-button>
                <el-button icon="el-icon-delete" @click="delLabel">删除标注数据</el-button>
                <el-button icon="el-icon-cloudy" style="right" @click="staetLabel">开始标注</el-button>
              </el-row>
      <div v-for="(item, index) in imagelargeArry" :key="index" style="
        float:left;
        margin-left:20px
        margin-top:20px
      " >
      <miniimage 
      :fatherimagesrc="item.url"
      :ismarked="item.islabel"
      @entermark="entermark(index)"
      ></miniimage>
      </div>
            </el-main>
            <el-divider direction="vertical"></el-divider>
            <el-aside width="350px" board>
              <h1>
                hhhhhhh
              </h1>
              <h1>
                hhhhhhh
              </h1>
            </el-aside>
          </el-container>
        </el-tab-pane>
        <!-- <el-tab-pane label="未标注">未标注</el-tab-pane>
        <el-tab-pane label="已标注">已标注</el-tab-pane> -->
      </el-tabs>
    </el-main>
  </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabel } from '@/api/data'
import store from '@/store'
import miniimage from '@/components/miniimage.vue'

export default {
  name: 'Dashboard',
  data() {
    return {
      message: '',
      urls: [],
      doneurls: [],
      undoneurls: [],
      //存储图片url,是否已标注等信息的数组，用于获取远程图片信息
      imagelargeArry:[],
    }
  },
  components:{
    miniimage
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    toDataSet: function() {
      this.$router.push('/data')
    },
    getData: function() {
      let _this = this;
      const params = {
        datasetuuid: store.getters.uuid
      }
      getLabel(params).then(response => {
        console.log("response",response)
        for (let i = 0; i < response.data.items.length; i++) {
          let a={};
          a["url"]=response.data.items[i].file_path
          a["islabel"]=response.data.items[i].is_label
          //a["index"]=i
          _this.imagelargeArry.push(a);
        }
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 50px;
  }
}
.el-header {
    background-color: #e5e9ee;
    color: rgb(14, 13, 13);
    line-height: 60px;
}
.header {
    font: 20px;
    height:150px;
}
.el-divider--vertical{
  display:inline-block;
  width:3px;
  height:5em;		//更改竖向分割线长度
  //margin:0 8px;
  vertical-align:middle;
  //position:relative;
  color: rgb(0, 0, 0);
}
.main {
  margin-left: 50px;
}
</style>
