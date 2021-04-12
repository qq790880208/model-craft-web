<template>
  <div class="dashboard-container">
    <el-tabs :tab-position="tabPosition" style="height: 200px;" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部数据" name="allData">
        <el-form :inline="true" :model="filter" >
          <el-button style="text-align: left" min type="primary" @click="createDataSet()">
            创建数据集npm 
          </el-button>
          <el-form-item >
            <el-input v-model="filter.name" placeholder="请输入查询名称" >
              <el-button slot="append" icon="el-icon-search" @click="getDataSet()"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSets" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="150" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.label_type)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="250" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
                </el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="120" sortable>
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="150" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <el-button type="info" size="small" @click="showTeamDialog(scope.$index, scope.row)">添加标注团队</el-button>
              <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="管理数据" name="manager">
        <el-form :inline="true" :model="filter" >
          <el-form-item>
            <el-input v-model="filter.name" placeholder="请输入查询名称" >
              <el-button slot="append" icon="el-icon-search" @click="getDataSetByManager()"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSetByManager" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row.name, scope.row.uuid, scope.row.label_type)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
                </el-progress>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total1" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="标注数据" name="label">
        <el-form :inline="true" :model="filter" >
          <el-form-item class="find">
            <el-input v-model="filter.name" placeholder="请输入查询名称" >
              <el-button slot="append" icon="el-icon-search" @click="getDataSetByTeam()"></el-button>
            </el-input>
          </el-form-item> 
        </el-form>
        <el-table :data="dataSetByTeam" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toStartLabel(scope.row.uuid, scope.row.label_type)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" :format="format">
                  </el-progress>
                </div>
              </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :total="total2" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="创建数据集"
      :visible.sync="dialogVisible"
      :before-close="handleCloseDialog">
      <el-form :model='form' ref="form" label-width="120px" label-position="left" :rules="addFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            autocomplete="off"
            v-model="form.descr">
          </el-input>
        </el-form-item>
        <el-form-item label="标注场景" prop="dataType">
          <el-radio-group v-model="form.dataType" autocomplete="off">
            <el-radio-button label="0" border><i class="el-icon-picture-outline"/>图片</el-radio-button> 
            <el-radio-button label="1" border><i class="el-icon-microphone"/>音频</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标注类型" prop="labelType">
          <el-radio-group v-model="form.labelType" autocomplete="off">
            <el-radio-button v-for="index in labels[form.dataType]" :label="index" :key="index" border>{{labelName[index]}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据集输入位置" prop="input">
          <el-input style="width: 90%" v-model="form.input"></el-input><el-button @click="showOssInputDialog" icon="el-icon-folder-add"></el-button>
          {{inputBucket}} {{inputObject}}
        </el-form-item>
        <el-form-item   label="数据集输出位置" prop="output">
          <el-input style="width: 90%" v-model="form.output"></el-input><el-button  @click="showOssOutputDialog" icon="el-icon-folder-add"></el-button>
          {{outputBucket}} {{outputObject}}
        </el-form-item>
        <el-form-item label="添加标签集" prop="label">
          <el-tag
            :key="tag"
            v-for="tag in form.label"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="创建团队标注任务"
      :visible.sync="teamDialogVisible"
      :before-close="handleCloseDialog"
      >
      <el-form :model='teamForm' ref="teamForm" label-width="120px" label-position="left">
        <el-form-item label="团队名称">
          <span>
            {{teamForm.dataSetName}}
          </span>
        </el-form-item>
        <el-form-item>
          <template>
            <el-select
              v-model="teamForm.teamValue"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择团队">
              <el-option
                v-for="item in teams"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="addLabelTeam()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="选择路径" :visible.sync="ossInputVisible" width="30%" :show-close="false">
        <el-form>
          <el-form-item label="请选择桶:">
            <el-radio-group v-model="bucketlist" @change="chooseBucket">
              <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-row>
          <el-button icon="el-icon-upload2" circle @click="retuenOdlRow"></el-button>
          <el-divider direction="vertical"></el-divider>
          <el-tag type="info" effect="light">当前路径：{{bucketlist}} ：{{objectcurrentRow}}</el-tag>
        </el-row>
        <el-table :data="objectList" highlight-current-row @row-click="getobjectbyPerfix">
          <el-table-column prop="name" label="请选择目录"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="notInput">取 消</el-button>
            <el-button type="primary" @click="returnInput">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog
      title="选择路径" :visible.sync="ossOutputVisible" width="30%" :show-close="false">
        <el-form>
          <el-form-item label="请选择桶:">
            <el-radio-group v-model="bucketlist" @change="chooseBucket">
              <el-radio-button :label="item.name" :key="item.name" v-for="item in list">{{item.name}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-row>
          <el-button icon="el-icon-upload2" circle @click="retuenOdlRow"></el-button>
          <el-divider direction="vertical"></el-divider>
          <el-tag type="info" effect="light">当前路径：{{bucketlist}} ：{{objectcurrentRow}}</el-tag>
        </el-row>
        <el-table :data="objectList" highlight-current-row @row-click="getobjectbyPerfix">
          <el-table-column prop="name" label="请选择目录"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="notOutput">取 消</el-button>
            <el-button type="primary" @click="returnOutput">确定</el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabel, getDataByName, getDataByTeam, getDataByManager, createDataSet, deleteDataSet, assignLabel } from '@/api/data'
import store from '@/store'
import { getAllTeam } from '@/api/team'
import{ listBucket,listObject,listObjectByPrefix } from '@/api/oss'
export default {
  namespaced: true,
  filters: {
    formatDate(nows) {
      if (!nows) { // 在这里进行一次传递数据判断.如果传递进来的为空值,返回其空字符串.解决其问题
        return ''
      }
      var year = nows[0]
      var month = nows[1]
      var day = nows[2]
      var hour = nows[3]
      var minute = nows[4]
      var second = nows[5]
      if (hour.toString().length < 2) {
        hour = '0' + hour
      }
      if (minute == null) {
        minute = '00'
      } else if (minute.toString().length < 2) {
        minute = '0' + minute
      }
      if (second == null) {
        second = '00'
        console.log(hour.length)
      } else if (second.toString().length < 2) {
        second = '0' + second
      }
      return ' ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },
    formatType(num) {
      if (num == 0) {
        return '拉框标注';
      }
      if (num == 1) {
        return '多边形标注';
      }
      if (num == 2) {
        return '语音标注';
      }
      if (num == 3) {
        return '3D标注';
      }
    }
  },
  data() {
    return {
      activeName: 'allData',
      message: '',
      filter: {
        name: ''
      },
      dataSets: [],
      dataSetByTeam: [],
      dataSetByManager: [],
      total: 0,
      total1: 0,
      total2: 0,
      page: 1,
      page_size: 20,
      dialogVisible: false,
      inputVisible: false, // tag显示
      teamDialogVisible: false,
      ossInputVisible: false,
      ossOutputVisible: false,
      bucketlist:'',//选择的bucket
      list:[],//bucket radio的数据
      objectList:[],//object table数据
      objectcurrentRow:'',//object当前目录
      objectcurrentPrefix:'',//object后端前缀
      objectoldRow:'',//object上级目录
      objectoldPrefix:'',//object上级后端前缀
      selectBucket:'',//dialog选择的桶
      selectObject:'',//dialog选择的对象
      inputBucket:'',//数据集输入桶
      inputObject:'',//数据集输入对象
      outputBucket:'',//数据集输出桶
      outputObject:'',//数据集输出对象
      inputValue: '',
      teams: [], // 所有团队
      value: [],
      teamUser: [],  // 团队成员
      form: {
        name: '',
        descr: '',
        dataType: '0',
        labelType: '',
        input: '',
        output: '',
        label: []
      },
      teamForm: {
        dataSetName: '',
        teamValue: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入数据集名字', trigger: 'blur' }],
        dataType: [{ required: true, message: '请选择', trigger: 'blur' }],
        labelType: [{ required: true, message: '请选择', trigger: 'blur' }],
        input: [{ required: true, message: '请选择', trigger: 'blur' }],
        output: [{ required: true, message: '请选择', trigger: 'blur' }],
        label: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      // 0 2D拉框，1 像素级（多边形），2 3D拉框, 3 语音
      labels: [
        [0,1,2],
        [3]
      ],
      labelName: ['2D拉框', '像素级', '3D拉框', '语音']
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    // dialog 关闭
    handleCloseDialog(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.dialogVisible = false
        })
        .catch(_ => {});
    },

    handleClose(tag) {
      this.form.label.splice(this.form.label.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
      this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.label.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    //  数据集文件输入位置
    showOssInputDialog() {
      this.getbucket()
      this.ossInputVisible= true;
    },
    //  数据集文件输出位置
    showOssOutputDialog() {
      this.getbucket()
      this.ossOutputVisible= true;
    },
    
    cancel() {
      this.dialogVisible = false
      this.teamDialogVisible = false
    },

    // 创建数据集
    createDataSet: function() {
      this.dialogVisible = true
      this.form = {
        name: '',
        descr: '',
        dataType: '0',
        labelType: '',
        input: '',
        output: '',
        label: []
      }
    },

    // 添加数据集 
    add() {
      const params = {
        userid: store.getters.userid,
        labelType: this.form.labelType,
        name: this.form.name,
        descr: this.form.descr,
        input: this.form.input,  // 格式：/data/dataset/0022f6831fbe40b0bd4aae781f202517/input
        output: this.form.output
      }
      createDataSet(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.getDataSet()
      })
      console.log(this.form)
      this.dialogVisible = false
    },

    // 删除数据集
    handleDel: function(index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        const params = {
          uuid: row.uuid
        }
        deleteDataSet(params).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDataSet()
        })
      })
    },

    // 编辑数据集
    handleEdit: function(index, row) {

    },

    // 显示标注团队对话框
    showTeamDialog(index, row) {
      this.getTeams()
      this.teamForm.dataSetName = row.name
      this.teamDialogVisible = true
      this.teamForm.teamValue = []
      this.teamForm.dataSetUuid = row.uuid
    },

    // 添加标注团队
    addLabelTeam() {
      const params = {
        dataSetid: this.teamForm.dataSetUuid,
        teamids: this.teamForm.teamValue.join(",")
      }
      console.log(params)
      assignLabel(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        this.teamDialogVisible = false
      })

    },

    // 得到所有的标注团队
    getTeams() {
      getAllTeam().then(res => {
        var team = res.data.items
        this.teams = team
        console.log(this.teams)
      })
    },

    // 切换tab
    handleClick(tab, event) {
      console.log(tab.name)
      this.activeName = tab.name
    },

    // 设置标注进度条
    setItemProgress(speed, tol) {
      if(speed == 0) {
        return 0
      }
      if(speed > tol) {
        return 100
      } else {
        return parseInt((speed/tol).toFixed(1) * 100)
      }
    },

    // 分页查询
    handleSizeChange(val) {
      this.page_size = val
      if (this.activeName == 'allData') {
        this.getDataSet()
      }
      if (this.activeName == 'manager') {
        this.getDataSetByManager()
      }
      if (this.activeName == 'label') {
        this.getDataSetByTeam()
      }    
    },
    handleCurrentChange(val) {
      this.page = val
      if (this.activeName == 'allData') {
        this.getDataSet()
      }
      if (this.activeName == 'manager') {
        this.getDataSetByManager()
      }
      if (this.activeName == 'label') {
        this.getDataSetByTeam()
      }
    },

    // 得到用户创建的数据集
    getDataSet: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      console.log("dadadadadad" + params)
      getDataByName(params).then(res => {
        this.dataSets = res.data.items
        this.total = res.data.total
      })
      this.filter.name = ''
    },

    // 得到团队管理员所管理的数据集
    getDataSetByTeam: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      console.log("ddddddddddd" + params)
      getDataByTeam(params).then(res => {
        this.dataSetByTeam = res.data.items
        this.total2 = res.data.total
      })
      this.filter.name = ''
    },

    // 得到标注的数据集
    getDataSetByManager: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      getDataByManager(params).then(res => {
        this.dataSetByManager = res.data.items
        this.total1 = res.data.total
      })
      this.filter.name = ''
    },

    // 展示数据
    toDataSet: function(val, uuuid, ttype) {
      console.log(ttype)
      store.dispatch('data/changeUuid', uuuid)
      store.dispatch('data/changeType', ttype)
      console.log(store.getters.uuid)
      this.$router.push({path:'/dataSet/userLabel', query: {dataName: val, key: this.activeName}})
    },

    // 开始标注
    toStartLabel: function(uuuid, ttype) {
      store.dispatch('data/changeUuid', uuuid)
      store.dispatch('data/changeType', ttype)
      if(ttype == 0) {
        this.$router.push('/label/d2imageview')
      }
      if(ttype == 1) {
        this.$router.push({path:'/label/polygonimageview'})
      }
      if(ttype == 2) {
        this.$router.push({path:'/label/d3'})
      }
      if(ttype == 3) {
        this.$router.push({path:'/label/voice'})
      }
    },
    
     //获取bucket列表
    getbucket(){
        listBucket().then(response=>{
        this.list = response.data}).catch(()=>{})
    },
    //选择桶后更新object table
    chooseBucket(val){
      this.objectList=[]
      const para = {bucketName : val}
      console.log(para);
      this.getobject(para);
    },
    
    //更新object的后台请求
    getobject(para){
      listObject(para).then(response=>{
          if(response){
            console.log(response);
            this.objectList = response.data
            }else{
            }
            }).catch()
    },
    //递归打开object
    getobjectbyPerfix(row,event,column){
      console.log(row.name);
            const para={}
            if("/"==((row.name.split("").reverse().join("")).substring(0,1)).split("").reverse().join("")){
                console.log("isdir");
                this.objectcurrentRow = row.name;
                this.objectcurrentPrefix = row.name.substring(0,row.name.length-1)//去/
                para.bucketName = this.bucketlist
                para.objectPrefix = this.objectcurrentPrefix
                console.log(para);
                this.getobjectlist(para)
                this.objectoldPrefix=this.objectcurrentPrefix.substring(0,this.objectcurrentPrefix.length-this.objectcurrentPrefix.split("").reverse().indexOf("/")-1)
                this.objectoldRow=this.objectcurrentPrefix.substring(0,this.objectcurrentPrefix.length-this.objectcurrentPrefix.split("").reverse().indexOf("/"))
            }else{
                console.log("isnotdir");
            }
            this.selectBucket=this.bucketlist
            this.selectObject=row.name
    },
    //根据前缀更新object
    getobjectlist(para){
      listObjectByPrefix(para).then(response=>{
                this.objectList = response.data
            }).catch(error=>{console.log(error);})
    },

    //返回上级
    retuenOdlRow(){
      console.log(this.bucketlist);
      console.log(this.objectoldPrefix);
      console.log(this.objectoldRow);
      if(this.objectoldRow==this.objectoldPrefix){
                this.objectoldRow=''
                this.objectoldPrefix=''
                this.objectcurrentRow=''
                this.objectcurrentPrefix=''
                this.selectObject=''
            }
      const para={}
      para.bucketName = this.bucketlist;
      para.objectPrefix = this.objectoldPrefix;
      console.log(para);
      this.getobjectlist(para)
      this.objectcurrentRow = this.objectoldRow
      this.objectcurrentPrefix = this.objectoldPrefix
      this.objectoldRow = this.objectcurrentPrefix.substring(0,this.objectcurrentPrefix.length-this.objectcurrentPrefix.split("").reverse().indexOf("/"))
      this.objectoldPrefix = this.objectcurrentPrefix.substring(0,this.objectcurrentPrefix.length-this.objectcurrentPrefix.split("").reverse().indexOf("/")-1)
    },

    //返回输入路径
    returnInput(){
      this.inputBucket=this.selectBucket
      this.inputObject=this.selectObject
      this.bucketlist=''
      this.list=[]
      this.objectList=[]
      this.objectcurrentRow=''
      this.objectcurrentPrefix=''
      this.objectoldRow=''
      this.objectoldPrefix=''
      this.selectBucket=''
      this.selectObject=''
      this.ossInputVisible=false
    },
    //取消返回输入路径
    notInput(){
      this.bucketlist=''
      this.list=[]
      this.objectList=[]
      this.objectcurrentRow=''
      this.objectcurrentPrefix=''
      this.objectoldRow=''
      this.objectoldPrefix=''
      this.selectBucket=''
      this.selectObject=''
      this.ossInputVisible=false
    },
    //返回输出路径
    returnOutput(){
      this.outputBucket=this.selectBucket
      this.outputObject=this.selectObject
      this.bucketlist=''
      this.list=[]
      this.objectList=[]
      this.objectcurrentRow=''
      this.objectcurrentPrefix=''
      this.objectoldRow=''
      this.objectoldPrefix=''
      this.selectBucket=''
      this.selectObject=''
      this.ossOutputVisible=false
    },
    //取消返回输出路径
    notOutput(){
      this.bucketlist=''
      this.list=[]
      this.objectList=[]
      this.objectcurrentRow=''
      this.objectcurrentPrefix=''
      this.objectoldRow=''
      this.objectoldPrefix=''
      this.selectBucket=''
      this.selectObject=''
      this.ossOutputVisible=false
    },

  },
  mounted() {
    this.getDataSet(),
    this.getDataSetByTeam(),
    this.getDataSetByManager()
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
    line-height: 46px;
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
 
}
</style>
