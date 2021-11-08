<template>
  <div>
    <h3>边缘端预测</h3>
    <div style="margin-top: 15px; width: 450px">
      <el-input placeholder="access_token" v-model="input3" class="input-with-select">
        <el-button slot="append" icon="el-icon-key" @click="getAccess0">点击获取</el-button>
      </el-input>
    </div>
    <el-tooltip placement="top" style="margin-top: 15px;">
        <div slot="content">1. 点击上方按钮获取access_key<br/><br/>
                            3. post请求/predict/edge 接口，字段如下：<br/><br/>
                                   String access_key, //key用于验证身份<br/>                                 
                                   String file_base64, //base64编码的图片字符串<br/>
                                   String model_uuid //模型唯一标识号（见模型管理页面）<br/><br/>
                            4. 接口返回内容字段如下：<br/><br/>
                                   String predict_info //标注信息<br/>
                                   String encode_predict_pic, //base64编码的预测结果图片字符串<br/><br/>
        </div>
        <el-button>接口使用方法</el-button>
      </el-tooltip>
  <el-divider></el-divider>
    <!-- <el-upload class="upload-demo" :file-list="fileList" drag limit="1" :http-request="uplFile"
  :on-change="handleChange"
  style="width: 350px;" action="string" :auto-upload="false"
  multiple>
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将待预测图片拖到此处，或<em>点击上传</em></div>
  </el-upload> -->
    <el-upload
      ref="upload"
      v-loading="uploadLoading"
      class="upload"
      action="string"
      :file-list="fileList"
      :auto-upload="false"
      :http-request="uplFile"
      :on-change="handleChange"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      multiple="multiple"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading" style="width: 400px"
    >
      <el-button slot="trigger" size="small" type="primary" @click="delFile"
        >选取文件</el-button
      >     <p>默认yolo_tensor模型唯一标识：3e1666e5f1664612bfc9fc3d0a49ba74</p>
    </el-upload>

    <el-input
      placeholder="请输入要使用模型的唯一标识"
      v-model="model_uuid"
      clearable
      style="margin-top: 15px; width: 400px"
    />
         <p>自动转换图片为base64编码并调用预测接口</p>
    <div slot="footer" class="dialog-footer" style="margin-top: 15px">
      <el-button @click="uploadObjectNull">清空</el-button>
      <el-button type="primary" @click="uploadObject">开始预测</el-button>
    </div>

    <div v-show="is_predicting" style="margin-top: 15px; width: 400px">
      预测中...
    </div>

      <el-input
        type="textarea"
        :autosize="{ minRows: 20, maxRows: 20}"
        placeholder="接口返回内容"
        v-model="textarea1" style="width: 800px;margin-top: 15px">
      </el-input>

      <div class="demo-image__placeholder">
          <div class="block">
            <span class="demonstration">预测结果</span>
            <el-image :src="'data:image/png;base64,'+ predict_pic">
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
        </div>

      
  </div>




</template>

<script>
import { uploadPic, getAccess } from "@/api/predict";
import store from "@/store";

export default {
  data() {
    return {
      fileList: [],
      model_uuid: "",
      uploadLoading: false, // 文件上传加载
      textarea1: '',
      input3: '',
      is_predicting: false,
      predict_pic: '',
    };
  },

  methods: {
    uploadObjectNull() {
      this.fileList = [];
      this.model_uuid = "";
      this.textarea1 = "";
    },
    uploadObject() {
      if (this.model_uuid == "") this.$message.error("请输入模型唯一标识");
      if (this.fileList.length == 0) this.$message.error("请选择图片文件");

      this.is_predicting = true;
      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      formData.append("model_uuid", this.model_uuid);
      console.log(this.fileList);
      uploadPic(formData).then((response) => {
        if (response.code == 20000) {
          this.fileList = [];
          
          var res = JSON.parse(response.data.content);
      
          console.log(res)

          this.textarea1 = "{\n  \"encode_info\": \"" + res.predict_info + "\", " +
                            "\n  \"encode_predict_pic\": \"" + res.encode_predict_pic + "\" " + 
                            "\n }"

          this.is_predicting = false;
          // this.predict_pic = res.encode_predict_pic.substring(2, res.encode_predict_pic.length - 1);
          this.predict_pic = res.encode_predict_pic;
        } else {
          this.$message.error("请求失败");
        }
      }).finally(() => {this.is_predicting = false;})},
    delFile() {
      this.fileList = [];
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      this.uploadFilePostfix = file.name.substring(file.name.indexOf("."));
    },
    uplFile(file) {
      this.formData.append("file", file.file);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    getAccess0() {
      getAccess().then((response) => {
        if (response.code == 20000) {
          console.log(response)
          this.input3 = response.data.Accesskey
        } else {
          this.$message.error("请求失败");
        }
      });
    }
  },
};
</script>

<style lang='scss' scoped>
.el-row {
  margin-top: 30px;
}
.training-jobs {
  margin-left: 30px;
}
.el-table {
  font-size: 12px;
  width: 100%;
  margin-top: 25px;
}

.el-pagination {
  margin-top: 25px;
}

.scrollbar {
  overflow: auto;
}

.scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 2px;
}

.scrollbar::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.4);
}

.scrollbar::-webkit-scrollbar-track {
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>