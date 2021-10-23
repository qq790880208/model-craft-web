<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的数据集" name="allData">
        <el-form :inline="true" :model="filter">
          <el-button plain style="text-align: left" type="primary" @click="createDataSet()">
            创建数据集
          </el-button>
          <el-form-item class="dataSer">
            <el-input v-model="filter.name" placeholder="请输入查询的数据集名称" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getDataSet()" />
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSets" highlight-current-row style="width: 100%; margin: 20px 0px 0px 0px">
          <el-table-column prop="name" align="center" label="名称" min-width="120" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="label_type" align="center" label="标注类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="标注进度" min-width="250" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" />
                <span>
                  {{ scope.row.done }} / {{ scope.row.tol }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="accept" align="center" label="状态" min-width="100" sortable>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.accept == 1 ? 'success' : 'danger'"
                hit
              >{{ scope.row.accept == 1 ? '已验收' : '未验收' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="120" sortable />
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="150" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
              <el-button type="success" plain size="mini" @click="toStartLabel(scope.row, scope.row.label_type)">开始标注</el-button>
              <el-button type="primary" plain size="mini" @click="showTeamDialog(scope.$index, scope.row)">添加团队任务</el-button>
              <el-button type="danger" plain size="mini" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next, jumper" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="标注数据集" name="manager">
        <el-form :inline="true" :model="filter">
          <el-form-item>
            <el-input v-model="filter.name" placeholder="请输入查询名称" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getAssignDataSet()" />
            </el-input>
          </el-form-item>
        </el-form>
        <!-- toDataSet(scope.row.name, scope.row.role_type, scope.row.uuid, scope.row.label_type) -->
        <el-table :data="dataSetAssigned" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toDataSet(scope.row)">{{ scope.row.name }}</span>
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
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" />
                {{ scope.row.done }} / {{ scope.row.tol }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable />
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total1" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="审核任务" name="audit">
        <el-form :inline="true" :model="filter">
          <el-form-item>
            <el-input v-model="filter.name" placeholder="请输入查询名称" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getAuditDataSet()" />
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSetAudit" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toAudit(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="审核类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="审核进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" />
                {{ scope.row.done }} / {{ scope.row.tol }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="descr" align="center" label="描述" min-width="150" sortable />
          <el-table-column prop="create_time" align="center" label="创建时间" min-width="180" sortable>
            <template slot-scope="scope">
              {{ scope.row.create_time | formatDate }}
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total2" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="验收任务" name="accept">
        <el-form :inline="true" :model="filter">
          <el-form-item>
            <el-input v-model="filter.name" placeholder="请输入查询名称" clearable>
              <el-button slot="append" icon="el-icon-search" @click="getAcceptDataSet()" />
            </el-input>
          </el-form-item>
        </el-form>
        <el-table :data="dataSetAccept" highlight-current-row style="width: 100%;">
          <el-table-column prop="name" align="center" label="名称" min-width="200" sortable>
            <template slot-scope="scope">
              <span class="link-type" @click="toAccept(scope.row)">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" align="center" label="验收类型" min-width="120" sortable>
            <template slot-scope="scope">
              {{ scope.row.label_type | formatType }}
            </template>
          </el-table-column>
          <el-table-column prop="done" align="center" label="审核进度" min-width="260" sortable>
            <template slot-scope="scope">
              <div style="width: 250px; margin:0px auto;">
                <el-progress :percentage="setItemProgress(scope.row.done, scope.row.tol)" />
                {{ scope.row.done }} / {{ scope.row.tol }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="rate" align="center" label="验收比例" min-width="150" sortable>
            <template slot-scope="scope">
              <div class="block">
                <el-slider v-model="scope.row.rate" :step="10" show-stops />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, sizes ,prev, pager, next" :page-size="page_size" :page-sizes="[1,5,10,20]" :total="total3" style="float: right" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-col>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="创建数据集"
      :visible.sync="dialogVisible"
      :before-close="handleCloseDialog"
    >
      <el-form ref="form" :model="form" label-width="120px" label-position="left" :rules="addFormRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.descr"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="标注场景" prop="dataType">
          <el-radio-group v-model="form.dataType" autocomplete="off">
            <el-radio-button label="0" border><i class="el-icon-picture-outline" />图片</el-radio-button>
            <el-radio-button label="1" border><i class="el-icon-microphone" />音频</el-radio-button>
            <el-radio-button label="2" border><i class="el-icon-copy-document" />3D</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标注类型" prop="labelType">
          <el-radio-group v-model="form.labelType" autocomplete="off">
            <el-radio-button v-for="index in labels[form.dataType]" :key="index" :label="index" border>{{ labelName[index] }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数据集图片输入位置" prop="input">
          <el-input v-model="form.input" style="width: 90%" :placeholder="form.input" :disabled="true" />
          <!-- <el-button @click="showOssInputDialog(form)" icon="el-icon-folder-add"></el-button> -->
        </el-form-item>
        <el-form-item label="数据集图片输入位置" prop="input">
          <el-input v-model="form.annotation" style="width: 90%" :placeholder="form.annotation" :disabled="true" />
          <!-- <el-button @click="showOssAnnotationDialog(form)" icon="el-icon-folder-add"></el-button> -->
        </el-form-item>
        <el-form-item label="数据集模型输出位置" prop="output">
          <el-input v-model="form.output" style="width: 90%" :placeholder="form.output" :disabled="true" />
          <!-- <el-button  @click="showOssOutputDialog(form)" icon="el-icon-folder-add"></el-button> -->
        </el-form-item>
        <el-form-item label="添加标签集" prop="tagss">
          <el-tag
            v-for="tag in tags"
            :key="tag.value"
            :color="tag.color"
            closable
            :disable-transitions="false"
            @close="handleCloseTagNew(tag)"
          >
            {{ tag.value }}
          </el-tag>
          <!-- <template
            v-if="inputVisible"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          > -->
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
          />
          <el-color-picker v-if="inputVisible" v-model="color1" class="mycolor" show-alpha="true" size="small" />
          <el-button v-if="inputVisible" type="primary" size="mini" icon="el-icon-finished" @keyup.enter.native="handleInputConfirm" @click="handleInputConfirm" />
          <el-button v-else class="button-new-tag" size="small" icon="el-icon-plus" @click="showInput">新标签</el-button>
          <!-- <el-tag
            v-for="tag in form.label"
            :key="tag"
            v-model="form.label"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button> -->
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
      width="40%"
    >
      <el-form ref="teamForm" :model="teamForm" label-width="100px" label-position="left">
        <el-form-item label="团队名称">
          <span>
            {{ teamForm.dataSetName }}
          </span>
        </el-form-item>
        <el-form-item label="标注团队">
          <template>
            <el-select
              v-model="teamForm.teamValue"
              placeholder="请选择团队"
              clearable
            >
              <el-option
                v-for="item in teams"
                :key="item.value"
                :label="item.name"
                :value="item.id"
              />
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
      title="选择路径"
      :visible.sync="ossInputVisible"
      width="30%"
      :show-close="false"
    >
      <el-form>
        <el-form-item label="请选择桶:">
          <el-radio-group v-model="bucketlist" @change="chooseBucket">
            <el-radio-button v-for="item in list" :key="item.name" :label="item.name">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-row>
        <el-button icon="el-icon-upload2" type="text" @click="retuenOdlRow">返回上级</el-button>
        <el-divider direction="vertical" />
        <el-tag type="info" effect="light">当前路径：{{ bucketlist }} ：{{ objectcurrentRow }}</el-tag>
      </el-row>
      <el-table :data="objectList" highlight-current-row @row-click="getobjectbyPerfix">
        <el-table-column prop="name" label="请选择目录" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="notInput">取 消</el-button>
        <el-button type="primary" @click="returnInput">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择路径"
      :visible.sync="ossOutputVisible"
      width="30%"
      :show-close="false"
    >
      <el-form>
        <el-form-item label="请选择桶:">
          <el-radio-group v-model="bucketlist" @change="chooseBucket">
            <el-radio-button v-for="item in list" :key="item.name" :label="item.name">{{ item.name }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-divider />
      <el-row>
        <el-button icon="el-icon-upload2" type="text" @click="retuenOdlRow">返回上级</el-button>
        <el-divider direction="vertical" />
        <el-tag type="info" effect="light">当前路径：{{ bucketlist }} ：{{ objectcurrentRow }}</el-tag>
      </el-row>
      <el-table :data="objectList" highlight-current-row @row-click="getobjectbyPerfix">
        <el-table-column prop="name" label="请选择目录" />
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
import { getDataByName, createDataSetApi, deleteDataSet, assignLabel, getAssignData, addTags } from '@/api/data'
import { listBucket, listObject, listObjectByPrefix, createFolder } from '@/api/oss'
import store from '@/store'
import { getAllTeam, getSelectTeam } from '@/api/team'
import { getAuditData } from '@/api/audit'
import { getAcceptData, setAcceptDataApi } from '@/api/accept'
import { v4 as uuidv4 } from 'uuid'
import { saveTagApi } from '@/api/tag'

<<<<<<< HEAD
=======

>>>>>>> dev
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
      } else if (second.toString().length < 2) {
        second = '0' + second
      }
      return ' ' + year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },
    formatType(num) {
      if (num === 0) {
        return 'tensorflow-2D拉框标注'
      }
      if (num === 1 || num === 4) {
        return 'tensorflow-多边形标注'
      }
      if (num === 2) {
        return '语音标注'
      }
      if (num === 3) {
        return 'pytorch-2D拉框'
      }
    }
  },
  data() {
    const validateTags = (rule, values, cb) => {
      console.log('1231213213')
      console.log(values)
      if (this.tags.length > 0) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入标签'))
    }
    return {
      my_uuid: '',
      defaultPath: '',
      isClickFlag: false, // 标记是否需要创建默认路径的flag
      ratevalue: 20,
      activeName: 'allData',
      message: '',
      filter: {
        name: ''
      },
      oldTeam: '',
      dataSets: [],
      dataSetAssigned: [],
      dataSetAudit: [],
      dataSetAccept: [],
      total: 0,
      total1: 0,
      total2: 0,
      total3: 0,
      page: 1,
      page_size: 20,
      dialogVisible: false,
      inputVisible: false, // tag显示
      teamDialogVisible: false,
      ossInputVisible: false,
      ossOutputVisible: false,
      bucketlist: '', // 选择的bucket
      list: [], // bucket radio的数据
      objectList: [], // object table数据
      objectcurrentRow: '', // object当前目录
      objectcurrentPrefix: '', // object后端前缀
      objectoldRow: '', // object上级目录
      objectoldPrefix: '', // object上级后端前缀
      selectBucket: '', // dialog选择的桶
      selectObject: '', // dialog选择的对象
      inputBucket: '', // 数据集输入桶
      inputObject: '', // 数据集输入对象
      outputBucket: '', // 数据集输出桶
      outputObject: '', // 数据集输出对象
      inputValue: '',
      teams: [], // 所有团队
      selectTeams: [], // 所选择的团队
      value: [],
      teamUser: [], // 团队成员
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
        teamValue: '',
        dataSetUuid: ''
      },
      addFormRules: {
        name: [{ required: true, message: '请输入数据集名字', trigger: 'blur' }],
        dataType: [{ required: true, message: '请选择', trigger: 'blur' }],
        labelType: [{ required: true, message: '请选择', trigger: 'blur' }],
        input: [{ required: true, message: '请选择', trigger: 'blur' }],
        output: [{ required: true, message: '请选择', trigger: 'blur' }],
        tagss: [
          { validator: validateTags, trigger: 'blur' }]
      },
      // 0 tf2D拉框，1 tf像素级（多边形），2 语音, 3 py2D拉框, 4py像素级（多边形）
      labels: [
        [0, 1, 3],
        [2],
        [4]
      ],
      labelName: ['tensorflow-2D拉框', 'tensorflow-像素级', '语音', 'pytorch-2D拉框', '3D'],
      tags: [],
      color1: 'rgba(255, 128, 0, 0.75)'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    this.getDataSet()
  },
  methods: {
    datachange(dataRate) {
      return dataRate
    },
    handleCloseTagNew(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    // dialog 关闭
    handleCloseDialog(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
          this.dialogVisible = false
          this.teamDialogVisible = false
        })
        .catch(_ => {})
    },
    // 添加标签
    handleClose(tag) {
      this.form.label.splice(this.form.label.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      const color = this.color1
      if (inputValue) {
        const params = {
          value: inputValue,
          color: color
        }
        this.tags.push(params)
      }
      this.inputVisible = false
      this.inputValue = ''
    },

    //  修改默认flag
    changeFlag() {
      console('flag1', this.isClickFlag)
      this.isClickFlag = true
      console('flag2', this.isClickFlag)
    },
    //  数据集图片位置
    showOssInputDialog(form) {
      this.getbucket()
      if (this.isClickFlag) {
        form.input = ''
        form.annotation = ''
        form.output = ''
      }
      this.isClickFlag = false
      this.ossInputVisible = true
    },
    // 数据集标注文件位置
    showOssAnnotationDialog(form) {
      this.getbucket()
      if (this.isClickFlag) {
        form.input = ''
        form.annotation = ''
        form.output = ''
      }
      this.isClickFlag = false
      this.ossInputVisible = true
    },
    //  数据集模型输出位置
    showOssOutputDialog(form) {
      this.getbucket()
      if (this.isClickFlag) {
        form.input = ''
        form.annotation = ''
        form.output = ''
      }
      this.isClickFlag = false
      this.ossOutputVisible = true
    },

    cancel() {
      console.log(this.form.label.join(','))
      this.dialogVisible = false
      this.teamDialogVisible = false
    },

    // 创建数据集
    createDataSet: function() {
      this.dialogVisible = true
      this.isClickFlag = true
      this.my_uuid = uuidv4().replace(/-/g, '')
      this.form = {
        name: '',
        descr: '',
        dataType: '0',
        labelType: '',
        input: 'data/dataset/' + this.my_uuid + '/input/source/',
        annotation: 'data/dataset/' + this.my_uuid + '/input/annotation/',
        output: 'data/dataset/' + this.my_uuid + '/output/ckpt/',
        label: []
      }
      // eslint-disable-next-line no-empty
      if (this.isClickFlag) {
      }
    },

    // 添加数据集
    add() {
      this.$refs.form.validate(valid => {
        console.log('mnbmbnbm')
        console.log(this.inputBucket)
        if (valid) {
          if (this.isClickFlag) {
            console.log('isclcik=trrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrue')
            const params = {
              uuid: this.my_uuid,
              userid: store.getters.userid,
              labelType: this.form.labelType,
              name: this.form.name,
              descr: this.form.descr,
              input: this.form.input, // 格式：/data/dataset/0022f6831fbe40b0bd4aae781f202517/input
              annotation: this.form.annotation,
              output: this.form.output,
              bucket: 'modelcraft'
            }
            console.log(this.form.label.toString()) // labels
            createDataSetApi(params).then(res => {
              const para1 = {}
              para1.bucketName = 'modelcraft'
              para1.objectName = 'data/dataset/' + this.my_uuid + '/input/source/'
              const para2 = {}
              para2.bucketName = 'modelcraft'
              para2.objectName = 'data/dataset/' + this.my_uuid + '/input/annotation/'
              const para3 = {}
              para3.bucketName = 'modelcraft'
              para3.objectName = 'data/dataset/' + this.my_uuid + '/output/ckpt/'
              console.log(para1, para2, para3)
              // 后端新建一个文件夹
              createFolder(para1).then(response => {
                if (response.code == 20000) {
                  console.log('haha1success')
                } else {
                  console.log('haha1error')
                }
              })
              createFolder(para2).then(response => {
                if (response.code == 20000) {
                  console.log('haha2success')
                } else {
                  console.log('haha2error')
                }
              })
              createFolder(para3).then(response => {
                if (response.code == 20000) {
                  console.log('haha3success')
                } else {
                  console.log('haha3error')
                }
              })
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.getDataSet()
<<<<<<< HEAD
              const paramss = {
                data: this.tags,
                uuid: this.my_uuid
              }
              saveTagApi(paramss).then(res => {
=======
              const params = {
                data: this.tags,
                uuid: this.my_uuid
              }
              saveTagApi(params).then(res => {
>>>>>>> dev
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              })
              // const para = {
              //   tags: this.form.label.toString(),
              //   datasetname: this.form.name
              // }
              // addTags(para).then(res => {
              //   this.$message({
              //     message: '添加成功',
              //     type: 'success'
              //   })
              // })
            })
<<<<<<< HEAD
            // const paramss = {
            //   data: this.tags,
            //   uuid: this.my_uuid
            // }
            // saveTagApi(paramss).then(res => {
            //   this.$message({
            //     message: '添加成功',
            //     type: 'success'
            //   })
            // })
=======
>>>>>>> dev
            console.log(this.form)
            this.dialogVisible = false
          } else {
            console.log('isclcik=falsssssssssssssssssssssssssssssssssssssssssssssseeee')
            const params = {
              uuid: this.my_uuid,
              userid: store.getters.userid,
              labelType: this.form.labelType,
              name: this.form.name,
              descr: this.form.descr,
              input: this.form.input, // 格式：/data/dataset/0022f6831fbe40b0bd4aae781f202517/input
              annotation: this.form.annotation,
              output: this.form.output,
              bucket: this.inputBucket
            }
            console.log(this.form.label.toString()) // labels
            createDataSetApi(params).then(res => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.getDataSet()
              const params = {
                data: this.tags,
                uuid: this.my_uuid
              }
              saveTagApi(params).then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              })
              // const para = {
              //   tags: this.form.label.toString(),
              //   datasetname: this.form.name
              // }
              // addTags(para).then(res => {
              //   this.$message({
              //     message: '添加成功',
              //     type: 'success'
              //   })
              // })
            })
            console.log(this.form)
            this.dialogVisible = false
          }
          // console.log(this.form.label.toString())  //labels
          // createDataSet(params).then(res => {
          //   this.$message({
          //     message: '添加成功',
          //     type: 'success'
          //   })
          //   this.getDataSet()
          //   const para = {
          //     tags: this.form.label.toString(),
          //     datasetname: this.form.name
          //   }
          //   addTags(para).then(res => {
          //     this.$message({
          //       message: '添加成功',
          //       type: 'success'
          //     })
          //   })
          // })
          // console.log(this.form)
          // this.dialogVisible = false
        } else {
          console.log(this.form.label)
          this.$message.error('请正确填写表单')
          return false
        }
      })
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
      this.getTeams(row.uuid)
      this.teamForm.teamValue = ''
      // 得到标注团队
      const params = {
        dataSetUuid: row.uuid
      }
      console.log(params)
      getSelectTeam(params).then(res => {
        this.selectTeams = res.data.items
        this.teamForm.teamValue = res.data.items.name
        this.oldTeam = res.data.items
        this.teamForm.dataSetName = row.name
        this.teamDialogVisible = true
        this.teamForm.dataSetUuid = row.uuid
      })
    },

    // 添加标注团队
    addLabelTeam() {
      if (this.teamForm.teamValue === this.oldTeam.name) {
        this.teamForm.teamValue = this.oldTeam.id
      }
      const params = {
        dataSetid: this.teamForm.dataSetUuid,
        teamid: this.teamForm.teamValue
      }
      console.log(params)
      assignLabel(params).then(res => {
        this.teamDialogVisible = false
        this.$message({
          message: '添加成功',
          type: 'success'
        })
        // this.teamDialogVisible = false
      }).catch()
    },

    // 得到所有的标注团队
    getTeams(uuid) {
      const params = {
        dataSetUuid: uuid,
        name: store.getters.name
      }
      getAllTeam(params).then(res => {
        var team = res.data.items
        this.teams = team
        console.log(this.teams)
      })
    },

    // 切换tab  我的数据集/标注数据集
    handleClick(tab, event) {
      // console.log(tab.name)
      // this.activeName = tab.name
      if (this.activeName === 'manager') {
        this.getAssignDataSet()
      }
      if (this.activeName === 'allData') {
        this.getDataSet()
      }
      if (this.activeName === 'audit') {
        this.getAuditDataSet()
      }
      if (this.activeName === 'accept') {
        this.getAcceptDataSet()
      }
    },

    // 设置标注进度条
    setItemProgress(speed, tol) {
      if (speed == 0) {
        return 0
      }
      if (speed > tol) {
        return 100
      } else {
        return parseInt((speed / tol).toFixed(1) * 100)
      }
    },

    // 分页查询
    handleSizeChange(val) {
      this.page_size = val
      if (this.activeName === 'allData') {
        this.getDataSet()
      }
      if (this.activeName === 'manager') {
        this.getAssignDataSet()
      }
      if (this.activeName === 'audit') {
        this.getAuditDataSet()
      }
      if (this.activeName === 'accept') {
        this.getAcceptDataSet()
      }
    },
    handleCurrentChange(val) {
      this.page = val
      if (this.activeName === 'allData') {
        this.getDataSet()
      }
      if (this.activeName === 'manager') {
        this.getAssignDataSet()
      }
      if (this.activeName === 'audit') {
        this.getAuditDataSet()
      }
      if (this.activeName === 'accept') {
        this.getAcceptDataSet()
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
      console.log('dadadadadad')
      console.log(params)
      getDataByName(params).then(res => {
        this.dataSets = res.data.items
        this.total = res.data.total
      })
      this.filter.name = ''
    },

    // 得到用户所分配到的数据集
    getAssignDataSet: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        id: store.getters.userid,
        name: this.filter.name
      }
      getAssignData(params).then(res => {
        this.dataSetAssigned = res.data.items
        this.total1 = res.data.total
      })
      this.filter.name = ''
    },

    // 得到审核数据集
    getAuditDataSet: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        userId: store.getters.userid,
        name: this.filter.name
      }
      getAuditData(params).then(res => {
        this.dataSetAudit = res.data.items
        this.total2 = res.data.total
      })
      this.filters.name = ''
    },

    // 得到验收数据集
    getAcceptDataSet: function() {
      const params = {
        page: this.page,
        pagesize: this.page_size,
        userId: store.getters.userid,
        name: this.filter.name
      }
      getAcceptData(params).then(res => {
        this.dataSetAccept = res.data.items
        this.total3 = res.data.total
      })
      this.filters.name = ''
    },

    toAudit: function(val) {
      console.log(val)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('data/changeDataSet', val)
      // this.$router.push({path:'/dataSet/audit'})
      // this.$router.push({path: '/dataSet/polygonaudit'})
      this.$router.push({ path: '/dataSet/3Daudit' })
      if (val.label_type === 0) {
        this.$router.push({ path: '/dataSet/2DauditPre' })
      }
      if (val.label_type === 1) {
        this.$router.push({ path: '/dataSet/polygonaudit' })
      }
      if (val.label_type === 2) {
        this.$router.push({ path: '/dataSet/3Daudit' })
      }
      if (val.label_type === 3) {
        this.$router.push({ path: '/dataSet/2DauditPre' })
      }
    },

    toAccept: function(val) {
      console.log(val)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('data/changeDataSet', val)
      // this.$router.push({path:'/dataSet/audit'})
      // this.$router.push({path: '/dataSet/polygonaudit'})
      // this.$router.push({path: '/dataSet/3Daudit'})
      const params = {
        dataSetUuid: val.uuid,
        rate: val.rate,
        userId: store.getters.userid
      }
      console.log(params)
      // setAcceptDataApi(params)
      this.setAuditDatas(params)
      if (val.label_type === 0 || val.label_type === 3) {
        this.$router.push({ path: '/dataSet/2Daccept' })
      }
      if (val.label_type === 1 || val.label_type === 4) {
        this.$router.push({ path: '/dataSet/polygonaccept' })
      }
      if (val.label_type === 2) {
        this.$router.push({ path: '/label/voice' })
      }
      // if(val.label_type === 3) {
      //   this.$router.push({path:'/label/voice'})
      // }
    },
    setAuditDatas(params) {
      setAcceptDataApi(params).then(res => {
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      })
    },
    // 展示数据
    toDataSet: function(val) {
      console.log('vallllllllllllllllllllllllllll', val)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('user/changeDataSet', val)
      console.log(store.getters.uuid)
      console.log(store.getters.type)
      console.log(store.getters.dataSet)
      if (val.role_type !== '标注员') {
        // this.$router.push({ path: '/dataSet/message', query: { dataName: val.name, key: this.activeName }})
        this.$router.push({ path: '/dataSet/message'})
      } else {
        console.log('898989')
        this.toStartLabel(val, val.label_type)
      }
    },

    // 开始标注
    toStartLabel: function(val, type) {
      console.log('wodedededed')
      console.log(val)
      console.log(val.labelType)
      store.dispatch('data/changeUuid', val.uuid)
      store.dispatch('data/changeType', val.label_type)
      store.dispatch('data/changeDataSet', val)
      if (type === 0 || type === 3) {
        this.$router.push('/label/d2imageview')
        // this.$router.push({path: '/dataSet/2DauditPre'})
      }
      if (type === 1 || type === 4) {
        this.$router.push({ path: '/label/polygonimageview' })
        // this.$router.push({path: '/dataSet/2DauditPre'})
      }
      if (type === 2) {
        this.$router.push({ path: '/label/voice' })
      }
      // if(type === 3) {
      //   this.$router.push({path:'/label/voice'})
      // }
    },

    // 获取bucket列表
    getbucket() {
      listBucket().then(response => {
        this.list = response.data
      }).catch(() => {})
    },
    // 选择桶后更新object table
    chooseBucket(val) {
      this.objectList = []
      const para = { bucketName: val }
      console.log(para)
      this.getobject(para)
    },

    // 更新object的后台请求
    getobject(para) {
      listObject(para).then(response => {
        if (response) {
          console.log(response)
          this.objectList = response.data
        // eslint-disable-next-line no-empty
        } else {
        }
      }).catch()
    },
    // 递归打开object
    getobjectbyPerfix(row, event, column) {
      console.log(row.name)
      const para = {}
      if (((row.name.split('').reverse().join('')).substring(0, 1)).split('').reverse().join('') == '/') {
        console.log('isdir')
        this.objectcurrentRow = row.name
        this.objectcurrentPrefix = row.name.substring(0, row.name.length - 1)// 去/
        para.bucketName = this.bucketlist
        para.objectPrefix = this.objectcurrentPrefix
        console.log(para)
        this.getobjectlist(para)
        this.objectoldPrefix = this.objectcurrentPrefix.substring(0, this.objectcurrentPrefix.length - this.objectcurrentPrefix.split('').reverse().indexOf('/') - 1)
        this.objectoldRow = this.objectcurrentPrefix.substring(0, this.objectcurrentPrefix.length - this.objectcurrentPrefix.split('').reverse().indexOf('/'))
      } else {
        console.log('isnotdir')
      }
      this.selectBucket = this.bucketlist
      this.selectObject = row.name
    },
    // 根据前缀更新object
    getobjectlist(para) {
      listObjectByPrefix(para).then(response => {
        this.objectList = response.data
      }).catch(error => { console.log(error) })
    },

    // 返回上级
    retuenOdlRow() {
      console.log(this.bucketlist)
      console.log(this.objectoldPrefix)
      console.log(this.objectoldRow)
      if (this.objectoldRow == this.objectoldPrefix) {
        this.objectoldRow = ''
        this.objectoldPrefix = ''
        this.objectcurrentRow = ''
        this.objectcurrentPrefix = ''
        this.selectObject = ''
      }
      const para = {}
      para.bucketName = this.bucketlist
      para.objectPrefix = this.objectoldPrefix
      console.log(para)
      this.getobjectlist(para)
      this.objectcurrentRow = this.objectoldRow
      this.objectcurrentPrefix = this.objectoldPrefix
      this.objectoldRow = this.objectcurrentPrefix.substring(0, this.objectcurrentPrefix.length - this.objectcurrentPrefix.split('').reverse().indexOf('/'))
      this.objectoldPrefix = this.objectcurrentPrefix.substring(0, this.objectcurrentPrefix.length - this.objectcurrentPrefix.split('').reverse().indexOf('/') - 1)
    },

    // 返回输入路径
    returnInput() {
      this.inputBucket = this.selectBucket
      this.inputObject = this.selectObject
      this.form.input = this.selectObject
      this.bucketlist = ''
      this.list = []
      this.objectList = []
      this.objectcurrentRow = ''
      this.objectcurrentPrefix = ''
      this.objectoldRow = ''
      this.objectoldPrefix = ''
      this.selectBucket = ''
      this.selectObject = ''
      this.ossInputVisible = false
    },
    // 取消返回输入路径
    notInput() {
      this.bucketlist = ''
      this.list = []
      this.objectList = []
      this.objectcurrentRow = ''
      this.objectcurrentPrefix = ''
      this.objectoldRow = ''
      this.objectoldPrefix = ''
      this.selectBucket = ''
      this.selectObject = ''
      this.ossInputVisible = false
    },
    // 返回输出路径
    returnOutput() {
      this.outputBucket = this.selectBucket
      this.outputObject = this.selectObject
      this.form.output = this.selectObject
      this.bucketlist = ''
      this.list = []
      this.objectList = []
      this.objectcurrentRow = ''
      this.objectcurrentPrefix = ''
      this.objectoldRow = ''
      this.objectoldPrefix = ''
      this.selectBucket = ''
      this.selectObject = ''
      this.ossOutputVisible = false
    },
    // 取消返回输出路径
    notOutput() {
      this.bucketlist = ''
      this.list = []
      this.objectList = []
      this.objectcurrentRow = ''
      this.objectcurrentPrefix = ''
      this.objectoldRow = ''
      this.objectoldPrefix = ''
      this.selectBucket = ''
      this.selectObject = ''
      this.ossOutputVisible = false
    }

<<<<<<< HEAD
=======
  },
  created(){
    if (store.getters.register == 1) {
      this.$router.push('/dashboard')
    }
>>>>>>> dev
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
.dataSer {
  margin: 0px 0px 0px 10px;
}
.app-container{
  padding: 10px 20px 50px 20px;
}
.el-table{
  height: 90%;
}
.mycolor{
  background-color: #EEF3FF;
  margin-left: 0px;
  margin-right: 20px;
  vertical-align: bottom;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
