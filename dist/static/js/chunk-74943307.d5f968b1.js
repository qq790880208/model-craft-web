(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74943307"],{"50b9":function(e,t,i){},"7a76":function(e,t,i){},"7e1e":function(e,t,i){"use strict";i.d(t,"f",(function(){return o})),i.d(t,"c",(function(){return n})),i.d(t,"e",(function(){return r})),i.d(t,"h",(function(){return s})),i.d(t,"i",(function(){return l})),i.d(t,"a",(function(){return u})),i.d(t,"m",(function(){return d})),i.d(t,"k",(function(){return c})),i.d(t,"b",(function(){return _})),i.d(t,"l",(function(){return h})),i.d(t,"j",(function(){return f})),i.d(t,"d",(function(){return m}));var a=i("b775");function o(e){return Object(a["a"])({url:"/8085/data/getAssignedData",method:"get",params:e})}function n(e){return Object(a["a"])({url:"/8085/data/create",method:"post",params:e})}function r(e){return Object(a["a"])({url:"/8089/dataset/delete",method:"delete",params:e})}function s(e){return Object(a["a"])({url:"/8085/userlabel/getAll",method:"get",params:e})}function l(e){return Object(a["a"])({url:"/8085/userlabel/getLabel",method:"get",params:e})}function u(e){return Object(a["a"])({url:"/8085/userlabel/assignLabel",method:"post",params:e})}function d(e){return Object(a["a"])({url:"/8085/label/fresh",method:"put",params:e})}function c(e){return Object(a["a"])({url:"/8085/tag/get",method:"get",params:e})}function _(e){return Object(a["a"])({url:"/8085/userlabel/assignNewData",method:"post",params:e})}function h(e){return Object(a["a"])({url:"/8085/userlabel/reAssign",method:"post",params:e})}function f(e){return Object(a["a"])({url:"/8085/userlabel/getNewLabel",method:"get",params:e})}function m(e){return Object(a["a"])({url:"/8085/teamdataset/delTeam",method:"delete",params:e})}},"80db":function(e,t,i){"use strict";i("d1f0")},"854a":function(e,t,i){"use strict";i("7a76")},"951a":function(e,t,i){"use strict";var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"ih-item"},[i("a",[i("div",[i("div",{style:{width:"200px",height:"200px"}},[i("img",{style:{width:"200px",height:"200px",border:"3px solid "+this.markcolor},attrs:{src:"/audioimage.jpg"},on:{mousedown:e.entermark}}),i("a",[e._v(e._s(e.nowaudioname))])])]),i("div",{staticClass:"info",staticStyle:{"{width":"100%"}},[i("h3",{staticStyle:{color:"rgba(255,255,255,1)"}},[e._v(e._s(e.ismarkedtext))])])])])},o=[],n=(i("a9e3"),{name:"",data:function(){return{input:""}},props:{audioname:Object,ismarked:{type:Number,default:!1}},destroyed:function(){console.log("miniimageddddddddddddddddddddddddddddddddddddddddddddddddddddd")},computed:{nowaudioname:function(){var e=this.audioname.url,t=e.lastIndexOf("/");return console.log("str",e,"index",t),e.substring(t+1)},markcolor:function(){return 1===this.ismarked?"#ff0000":"#ffffff"},ismarkedtext:function(){return 1===this.ismarked?"已标注":"未标注"}},methods:{kanurl:function(){console.log(this.audioname)},entermark:function(){console.log("entermark",this.audioname),this.$emit("entermark")}}}),r=n,s=(i("80db"),i("2877")),l=Object(s["a"])(r,a,o,!1,null,null,null);t["a"]=l.exports},"9d8a7":function(e,t,i){"use strict";var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticStyle:{display:"flex"}},[i("div",{attrs:{id:"testwave"}}),i("el-dialog",{style:{width:"800px",marginLeft:"100px",marginTop:"200px"},attrs:{title:"提示",visible:e.dialogVisible,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogVisible=t}}},[i("span",[e._v("请选择标签")]),i("el-select",{ref:"selectref",staticStyle:{width:"100px"},attrs:{filterable:"",placeholder:" "},on:{change:e.changeinfo2},model:{value:e.markspeaker,callback:function(t){e.markspeaker=t},expression:"markspeaker"}},e._l(e.premarktype,(function(e){return i("el-option",{key:e.index,attrs:{label:e.name,value:e}})})),1),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.cancelmark}},[e._v("取 消")]),i("el-button",{attrs:{type:"primary"},on:{click:e.makemark}},[e._v("确 定")])],1)],1),i("div",{staticClass:"leftdiv"},[i("div",{attrs:{id:"test"}},[i("div",{staticStyle:{"text-align":"left"},on:{click:e.changebi}},[i("div",{ref:"waveform",attrs:{id:"waveform"}}),i("div",{ref:"wavetimeline"}),i("div",{ref:"miniwaveform"}),i("div",[i("el-button",{attrs:{type:"primary"},on:{click:e.playMusic}},[i("i",{staticClass:"el-icon-video-play"}),e._v(" 播放 / "),i("i",{staticClass:"el-icon-video-pause"}),e._v(" 暂停 ")]),i("input",{ref:"inputtest",staticStyle:{width:"30%","margin-left":"20px"},attrs:{type:"range",min:"1",max:"200",value:"0"}}),i("el-switch",{staticStyle:{display:"inline-block","margin-left":"20px"},attrs:{"active-text":"选择标签后标注","inactive-text":"先标注后选标签","active-color":"#13ce66","inactive-color":"#ff4949",disabled:e.islabeling},on:{change:e.switchchange},model:{value:e.markstyle,callback:function(t){e.markstyle=t},expression:"markstyle"}})],1)]),i("div",{staticStyle:{display:"inline-block"},attrs:{id:"remarkinfodiv"}},[i("div",[i("p",[e._v("驳回备注："+e._s(e.auditremakeinfo))])]),i("div",[i("p",[e._v("验收备注："+e._s(e.acceptremakeinfo))])])]),i("div",{staticStyle:{"max-height":"600px",overflow:"auto"}},e._l(e.audioPointArry,(function(t,a){return i("div",{key:a,staticStyle:{"margin-top":"10px"}},[i("labelinfo",{staticStyle:{"text-align":"center"},style:{border:e.b_i===a?"1px solid #ff0000":"0px solid #ff0000"},attrs:{inputname1:e.audioPointArry[a].infodata.text1,inputname2:e.audioPointArry[a].infodata.text2,nowindex:a+1},on:{deletelabel:function(t){return e.deletelabel(a)},changetext1:function(t){return e.changetext1(t,a)},changetext2:function(t){return e.changetext2(t,a)}},nativeOn:{mousedown:function(t){return e.handelClick(a)}}})],1)})),0)])]),i("div",{staticClass:"el-divider el-divider--vertical"}),i("div",{staticClass:"rightdiv",on:{click:e.changebi}},[i("div",{staticClass:"infopolygon",staticStyle:{"margin-left":"20px"}},e._l(e.premarktype,(function(t,a){return i("div",{key:a,staticStyle:{float:"left","margin-right":"20px"}},[i("el-button",{style:{width:"120px",marginBottom:"10px",background:e.markstyle?e.buttonindex==a?t.color:"rgba(0,0,0,0)":t.color},attrs:{disabled:!e.markstyle},on:{click:function(i){return e.changecolor(t,a)}}},[e._v(e._s(t.name))])],1)})),0)])],1)},o=[],n=i("53ca"),r=(i("a9e3"),i("159b"),i("b0c0"),i("a434"),i("d3b7"),i("25f0"),i("b680"),i("99af"),i("8896")),s=i.n(r),l=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("el-row",[i("p",{staticStyle:{width:"40px",display:"inline-block"}},[e._v(e._s(e.nowindex)+"、")]),i("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"请输入拼音",clearable:""},on:{blur:e.changefathertext1},model:{value:e.input1,callback:function(t){e.input1=t},expression:"input1"}}),i("el-input",{staticStyle:{width:"150px"},attrs:{disabled:!0},model:{value:e.inputname1,callback:function(t){e.inputname1=t},expression:"inputname1"}}),i("el-input",{staticStyle:{width:"150px"},attrs:{placeholder:"请输入汉字 ",clearable:""},on:{blur:e.changefathertext2},model:{value:e.input2,callback:function(t){e.input2=t},expression:"input2"}}),i("el-input",{staticStyle:{width:"150px"},attrs:{disabled:!0},model:{value:e.inputname2,callback:function(t){e.inputname2=t},expression:"inputname2"}}),i("el-button",{staticStyle:{width:"100px","margin-left":"10px"},attrs:{type:"danger"},on:{click:e.deletefatherlabel}},[e._v("删除")])],1)],1)},u=[],d={name:"",data:function(){return{input1:"",input2:""}},props:{nowindex:Number,inputname1:String,inputname2:String},methods:{deletefatherlabel:function(){console.log(this.input1),console.log(this.input2),this.$emit("deletelabel")},changefathertext1:function(){console.log(this.input1),console.log(this.inputname1),this.$emit("changetext1",this.input1),this.input1=""},changefathertext2:function(){console.log(this.input2),console.log(this.inputname2),this.$emit("changetext2",this.input2),this.input2=""}},components:{}},c=d,_=i("2877"),h=Object(_["a"])(c,l,u,!1,null,null,null),f=h.exports,m=i("c1be"),p=i.n(m),g=i("8433"),b=i.n(g),y=i("089f"),v=i.n(y),w=i("e3bf"),A=i.n(w),k={name:"Details",props:{audioindex:Number,premarktype:{type:Array,default:function(){return[]}},fatheraudioUrl:{type:String,default:""},auditremakeinfo:{type:String,default:""},acceptremakeinfo:{type:String,default:""},lastlabelArry:{type:Object,default:function(){}}},data:function(){return{wavesurfer:null,newregion:null,b_i:-1,buttonindex:-1,markcolor:null,markspeaker:null,minnum:1,maxnum:200,valuenum:200,audioPointArry:[],audioInfoArry:[],highlight:[],markstyle:!0,dialogVisible:!1,dialogleft:0,dialogtop:0,markcolor2:"rgba(0,128,128,0.5)",markspeaker2:null,islabeling:!1,newcreated:!1}},components:{labelinfo:f},computed:{audioUrl:function(){return this.fatheraudioUrl}},mounted:function(){var e=this;this.$nextTick((function(){e.emitfather(),console.log("mp3"),e.wavesurfer=s.a.create({container:e.$refs.waveform,waveColor:"#A8DBA8",progressColor:"#3B8686",backend:"MediaElement",plugins:[b.a.create(),v.a.create({height:30,container:e.$refs.miniwaveform,waveColor:"#ddd",progressColor:"#999",cursorColor:"#999"}),p.a.create({container:e.$refs.wavetimeline,formatTimeCallback:e.formatTimeCallback,timeInterval:e.timeInterval,primaryLabelInterval:e.primaryLabelInterval,secondaryLabelInterval:e.secondaryLabelInterval}),A.a.create({showTime:!0,opacity:1,followCursor:!1,customStyle:{height:"128px",marginTop:"110px",marginLeft:"120px"},customShowTimeStyle:{"background-color":"#000",color:"#fff",padding:"2px","font-size":"10px"}})]});console.log("dsadsadsa",e.audioUrl);var t=e.$refs.inputtest;console.log(e.wavesurfer.params.minPxPerSec),t.value=0,t.max=200;var i=e;t.addEventListener("input",(function(){i.wavesurfer.zoom(Number(this.value))})),e.wavesurfer.zoom(t.value),e.wavesurfer.on("ready",(function(){e.changecolor(e.premarktype[0],0),e.wavesurfer.enableDragSelection({})})),e.wavesurfer.on("region-click",(function(t,i){console.log("e",i),i.stopPropagation();var a=e;e.audioPointArry.forEach((function(e,i){console.log("item",e,"id",i),e.id===t.id&&(a.b_i=i)})),t.play()})),e.wavesurfer.on("region-created",e.createRegions),e.wavesurfer.on("region-update-end",e.changeRegions),e.wavesurfer.on("waveform-ready",e.readyupdate),setTimeout((function(){e.updatelastdata()}),10)}))},watch:{audioUrl:function(){console.log("watch!!!!!!!!",this.lastlabelArry),this.emitfather(),this.wavesurfer.clearRegions(),this.audioPointArry=[],this.audioInfoArry=[],this.updatelastdata()}},methods:{makemark:function(){if(null!=this.markspeaker){var e=this.audioPointArry[this.b_i].id;console.log(this.wavesurfer.regions.list[e]),this.wavesurfer.regions.list[e].update({color:this.markcolor}),this.audioPointArry[this.b_i].speaker=this.markspeaker,this.switchchange(),this.dialogVisible=!1}else this.cancelmark()},cancelmark:function(){this.deletelabel(this.b_i),this.switchchange(),this.dialogVisible=!1},switchchange:function(){this.markstyle?this.changecolor(this.premarktype[0],0):(this.buttonindex=-1,this.markcolor=this.markcolor2,this.markspeaker=null)},deletemarkedbi:function(){this.deletelabel(this.b_i)},updatelastdata:function(){this.wavesurfer.load(this.fatheraudioUrl)},emitfather:function(){console.log("sonemit"),this.$emit("closebutton")},readyupdate:function(){console.log("lastlabelArry",this.lastlabelArry);for(var e=0;e<this.lastlabelArry.audio.length;e++){console.log("i,i",e),this.findcolor(this.lastlabelArry.audio[e].speaker);this.wavesurfer.addRegion({start:this.lastlabelArry.audio[e].start,end:this.lastlabelArry.audio[e].end,color:this.markcolor});console.log("this.audioPointArry",this.audioPointArry[e]),this.audioPointArry[e].infodata.start=this.lastlabelArry.audio[e].start,this.audioPointArry[e].infodata.end=this.lastlabelArry.audio[e].end,this.audioPointArry[e].infodata.speaker=this.lastlabelArry.audio[e].speaker,this.audioPointArry[e].infodata.text1=this.lastlabelArry.audio[e].text1,this.audioPointArry[e].infodata.text2=this.lastlabelArry.audio[e].text2,console.log("1jieshu")}console.log("this.audioPointArry",this.audioPointArry),this.emitfather()},saveinfo:function(e,t){console.log("start!!!",this.audioPointArry);for(var i=0;i<this.audioPointArry.length;i++)this.audioInfoArry.push(this.audioPointArry[i].infodata);console.log("start!!!",this.audioInfoArry);var a={};a.audio=JSON.parse(JSON.stringify(this.audioInfoArry)),console.log("11111",a),this.$emit("saveaudioinfo",a,this.audioindex,e,t),a=[],console.log("22222",a)},findcolor:function(e){var t=this;this.premarktype.forEach((function(i){console.log("infind",e),i.name===e&&(console.log("find",i.color,Object(n["a"])(i.color)),t.markcolor=i.color)}))},changebi:function(){console.log("change!!!!!!!!!!!!!!!!!!!!"),this.b_i=-1},handelClick:function(e){this.b_i=e,console.log("hahaha"+e)},editAnnotation:function(e){},createRegions:function(e){this.b_i=-1,console.log("dsadsadadsadasdsadsadsadasdasdasdsadsadasdasdasd"),this.newcreated=!0,e.color=this.markcolor,this.audioPointArry.push({id:e.id,infodata:{start:null,end:null,speaker:this.markspeaker,text1:"pinyin",text2:"hanzi"}})},changeRegions:function(e){!this.markstyle&&this.newcreated&&(this.dialogVisible=!0);var t,i=this;this.newcreated=!1,console.log(e.id,i),this.audioPointArry.forEach((function(a,o){console.log("item",a,"id",o),a.id===e.id&&(i.b_i=o,t=o)})),console.log("index",t),this.audioPointArry[t].infodata.start=e.start,this.audioPointArry[t].infodata.end=e.end,console.log("labbababbaba",this.audioPointArry)},deletelabel:function(e){this.b_i=-1;var t=this.audioPointArry[e].id;this.audioPointArry.splice(e,1),t&&this.wavesurfer.regions.list[t].remove(),console.log(this.audioPointArry),console.log(this.wavesurfer.regions.list)},changecolor:function(e,t){console.log("changecolor",t),this.buttonindex=t,this.markcolor=e.color,this.markspeaker=e.name},changeinfo2:function(e){console.log("changeinfo2",e),this.markcolor=e.color,this.markspeaker=e.name},changetext1:function(e,t){this.audioPointArry[t].infodata.text1=e},changetext2:function(e,t){this.audioPointArry[t].infodata.text2=e},randomColor:function(e){return"rgba("+[~~(255*Math.random()),~~(255*Math.random()),~~(255*Math.random()),e||.25]+")"},playMusic:function(){this.wavesurfer.playPause.bind(this.wavesurfer)()},formatTimeCallback:function(e,t){e=Number(e);var i=Math.floor(e/60);e%=60;var a=Math.round(e).toString();return t>=250?a=e.toFixed(2):t>=25&&(a=e.toFixed(1)),i>0?(e<10&&(a="0"+a),"".concat(i,":").concat(a)):a},timeInterval:function(e){var t=1;return t=e>=2500?.01:e>=1e3?.025:e>=250?.1:e>=100?.25:e>=50?.5:e>=25?1:5*e>=25?5:15*e>=25?15:60*Math.ceil(.5/e),t},primaryLabelInterval:function(e){var t=1;return t=e>=2500?10:e>=1e3?4:e>=250?10:e>=100?4:e>=50?2:e>=25?5:5*e>=25||15*e>=25?2:60*Math.ceil(.5/e),t},secondaryLabelInterval:function(e){}}},x=k,E=(i("f021"),Object(_["a"])(x,a,o,!1,null,"3a09b2ed",null));t["a"]=E.exports},a1c6:function(module,__webpack_exports__,__webpack_require__){"use strict";var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("b0c0"),core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__),vuex__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("2f62"),_components_wave_vue__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("9d8a7"),_components_miniaudio_vue__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("951a"),_api_data__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("7e1e"),_utils_request__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("b775"),_store__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("4360"),_api_mark__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("b6d5"),_api_tag__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("d28d");function keyDownSearch(e){console.log("keydown!!!!!!!!!!!!");var t=e.event||window.event,i=t.keyCode||t.which||t.charCode;83==i&&(console.log("ssssssssss!!!!!!!!!!!!!"),previousaudio()),68==i&&(console.log("dddddddddd!!!!!!!!!!!!!"),nextaudio()),70==i&&(console.log("ffffffffff!!!!!!!!!!!!!"),skipaudionext()),65==i&&(console.log("aaaaaaaaaa!!!!!!!!!!!!!"),skipaudiopre()),71==i&&(console.log("gggggggggg!!!!!!!!!!!!!"),nomarkedaudio()),46==i&&(console.log("ddddddddddelete!!!!!!!!!!!!!"),deleteSelect())}__webpack_exports__["a"]={name:"Dashboard",data:function(){return{audioArry:[],infoArry:[],lastinfoArry:[],uuidArry:[],audiolargeArry:[],audioislabelArry:[],testaudioArry:["@/music/abc.mp3","@/music/abc1.mp3","@/music/abc2.mp3","@/music/abc3.mp3"],isaudioview:!0,testmarktype:[{name:"man1",color:"rgba(128,0,0,0.5)"},{name:"man2",color:"rgba(0,128,0,0.5)"},{name:"man3",color:"rgba(0,0,128,0.5)"},{name:"woman1",color:"rgba(128,128,0,0.5)"},{name:"woman2",color:"rgba(0,128,128,0.5)"},{name:"woman3",color:"rgba(128,0,128,0.5)"}],marktype:[],nopnum:0,nownum:0,isdisablebutton:!1}},mounted:function(){this.infoArry=new Array(this.audioArry.length),console.log("mounted!!!!",this.infoArry.length,this.infoArry),console.log("mounted!!!!uuid",_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid,"mounted!!!!store.getters.userid",_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.userid),this.requireaudio(),this.requiretag(),window.nextaudio=this.nextaudio,window.previousaudio=this.previousaudio,window.skipaudionext=this.skipaudionext,window.skipaudiopre=this.skipaudiopre,window.nomarkedaudio=this.nomarkedaudio,window.deleteSelect=this.deleteSelect,document.onkeydown=keyDownSearch},methods:{returndataset:function(){this.$router.go(-1)},returnaudioview:function(){this.nopnum=0,this.$refs.waveref.saveinfo(!0,!1),this.nownum=0,this.isaudioview=!this.isaudioview},returnaudioviewNoSave:function(){this.nopnum=0,this.nownum=0,this.isaudioview=!this.isaudioview},closebutton:function(){console.log("fatherdisbtnnnnnnnnnnnnnnnnnnnnnnnnnnnn"),this.isdisablebutton=!this.isdisablebutton},deleteSelect:function(){this.unable||(this.isimageview?console.log("处于预览界面"):this.isdisablebutton?console.log("您现在正在修改图片"):this.$refs.waveref.deletemarkedbi())},nextaudio:function(){this.unable?console.log("uuuuuuuuuuuuuuuuunnnnnnnnnnnnnnnnaaaaaaaaaaaaaableeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"):this.isaudioview?console.log("处于预览界面"):this.isdisablebutton?console.log("您现在正在修改音频"):(this.nownum<this.audioArry.length&&(this.nopnum=1,this.unable=!0,this.$refs.waveref.saveinfo(!0,!1)),console.log("nextaudio",this.nownum),console.log("nextaudio infoArry",this.infoArry,this.infoArry.length))},previousaudio:function(){this.unable||(this.isaudioview?console.log("处于预览界面"):this.isdisablebutton?console.log("您现在正在修改音频"):(this.nownum>=0&&(this.nopnum=2,this.unable=!0,this.$refs.waveref.saveinfo(!0,!1)),console.log("previousaudio",this.nownum)))},nomarkedaudio:function(){this.unable||(this.isaudioview?console.log("处于预览界面"):this.isdisablebutton?console.log("您现在正在修改音频"):(this.nownum<this.audioArry.length&&(this.nopnum=1,this.unable=!0,this.$refs.waveref.saveinfo(!1,!1)),console.log("nextaudio",this.nownum)))},skipaudionext:function(){this.isaudioview?console.log("处于预览界面"):this.isdisablebutton?console.log("您现在正在修改音频"):(this.nownum<this.audioArry.length-1?(this.$refs.waveref.saveinfo(!0,!0),this.nownum++):(this.$refs.waveref.saveinfo(!0,!0),this.returnaudioviewNoSave()),console.log("skipaudio",this.nownum),this.nowseconds=0)},skipaudiopre:function(){this.isaudioview?console.log("处于预览界面"):this.isdisablebutton?console.log("您现在正在修改音频"):(this.nownum>0?(this.$refs.waveref.saveinfo(!0,!0),this.nownum--):(this.$refs.waveref.saveinfo(!0,!0),this.returnaudioviewNoSave()),console.log("skipaudio",this.nownum),this.nowseconds=0)},entermark:function(e){this.nownum=e,console.log("faaaaaaaaaaaatherenter!",this.nownum),this.isaudioview=!this.isaudioview},isnowlabel1:function(){var e={uuid:this.uuidArry[this.nownum]};console.log(e),Object(_api_mark__WEBPACK_IMPORTED_MODULE_7__["c"])(e).then((function(e){console.log("isnowlabel",e)}))},saveaudioinfo:function(e,t,i,a){this.infoArry[t]=e,console.log("save success",e,t),console.log("thisinfoArry",this.infoArry),this.savelabel1(this.nownum,i,a)},requireaudio:function requireaudio(){console.log("uuid",_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid,"store.getters.userid",_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.userid),console.log("store.getters.dataSet.role_type",_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.dataSet.role_type,"store.getters.predictcontrol",_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.predictcontrol);var _this=this;if(this.isalllabeled=!0,"创建者"===_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.dataSet.role_type||"1"===_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.predictcontrol){var params={datasetuuid:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid};Object(_api_data__WEBPACK_IMPORTED_MODULE_4__["h"])(params).then((function(e){console.log("response",e),_this.audioArry=[],_this.infoArry=[],_this.lastinfoArry=[],_this.uuidArry=[],_this.audiolargeArry=[],_this.audioislabelArry=[],_this.auditinfoArry=[],_this.acceptinfoArry=[],console.log("get response.data.items",e.data.items);for(var t=0;t<e.data.items.length;t++){if(console.log("get items",[t],e.data.items[t]),_this.auditinfoArry[t]=e.data.items[t].audit_remark,_this.acceptinfoArry[t]=e.data.items[t].accept_remark,1!=e.data.items[t].is_label&&(_this.isalllabeled=!1),void 0==e.data.items[t].label_data||"[]"===e.data.items[t].label_data)_this.lastinfoArry.push({audio:[]}),console.log("lastinfoArry",_this.lastinfoArry[t]);else{var i=JSON.parse(e.data.items[t].label_data);console.log("tempa",i),_this.lastinfoArry.push(i),console.log("lastinfoArry",_this.lastinfoArry[t])}var a={};a["url"]=e.data.items[t].file_path,a["islabel"]=e.data.items[t].is_label,_this.audiolargeArry.push(a),console.log("3ffafnzxvnkzjxc",_this.audiolargeArry),_this.uuidArry.push(e.data.items[t].uuid),_this.audioArry.push(e.data.items[t].file_path),_this.audioislabelArry.push(e.data.items[t].is_label)}console.log("audioislabelArry",_this.audioislabelArry),console.log("_this.audioArry",_this.audioArry),console.log("_this.lastinfoArry",_this.lastinfoArry)})).catch((function(e){console.log("error",e),_this.$message({message:"请求音频失败",type:"error"})}))}else{var _params={dataset_uuid:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid,user_id:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.userid};console.log(_params),Object(_api_data__WEBPACK_IMPORTED_MODULE_4__["i"])(_params).then((function(response){console.log("response",response),_this.audioArry=[],_this.infoArry=[],_this.lastinfoArry=[],_this.uuidArry=[],_this.audiolargeArry=[],_this.audioislabelArry=[],_this.auditinfoArry=[],_this.acceptinfoArry=[],console.log("get response.data.items",response.data.items);for(var i=0;i<response.data.items.length;i++){if(console.log(response.data.items[i]),_this.auditinfoArry[i]=response.data.items[i].audit_remark,_this.acceptinfoArry[i]=response.data.items[i].accept_remark,void 0==response.data.items[i].label_data||"[]"===response.data.items[i].label_data)_this.lastinfoArry.push({audio:[]});else{var tempa=JSON.parse(response.data.items[i].label_data),len=eval(tempa).length;console.log("len",len),console.log("tempa",tempa),_this.lastinfoArry.push(tempa),console.log("lastinfoArry",response.data.items[i].is_label)}var a={};a["url"]=response.data.items[i].file_path,a["islabel"]=response.data.items[i].is_label,_this.audiolargeArry.push(a),console.log("3ffafnzxvnkzjxc",_this.audiolargeArry),_this.uuidArry.push(response.data.items[i].uuid),_this.audioArry.push(response.data.items[i].file_path),_this.audioislabelArry.push(response.data.items[i].is_label)}console.log("audioislabelArry",_this.audioislabelArry),console.log("_this.audioArry",_this.audioArry),console.log("_this.lastinfoArry",_this.lastinfoArry)})).catch((function(e){console.log("error",e),_this.$message({message:"请求音频失败",type:"error"})}))}},requiretag:function(){var e=this;this.marktype=[];var t={dataset_uuid:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid};return Object(_api_tag__WEBPACK_IMPORTED_MODULE_8__["a"])(t).then((function(t){console.log("taggggggggggggggggggggggggggggggggggggg",t);for(var i=0;i<t.data.items.length;i++){var a={};a["name"]=t.data.items[i].name,a["color"]=t.data.items[i].color,e.marktype.push(a)}console.log("marktype",e.marktype)})).catch((function(t){console.log("error",t),e.$message({message:"请求标签集合失败",type:"error"})}))},savelabel1:function(e,t,i){var a=this;if(this.nowseconds=0,i){console.log("onlyislabel");var o={is_label:this.audioislabelArry[e],uuid:this.uuidArry[e],dataset_id:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid};Object(_api_mark__WEBPACK_IMPORTED_MODULE_7__["d"])(o).then((function(e){console.log("change!!!!!!!!!!!!!!!!!!!!!!!",e),a.isDestroy||a.isnowlabel1()}))}else{console.log("put000no",e,this.infoArry[e]),console.log("put000",JSON.stringify(this.infoArry[e]));var n,r={dataSetId:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid};Object(_api_mark__WEBPACK_IMPORTED_MODULE_7__["e"])(r).then((function(e){console.log("setUnAcceptsetUnAcceptsetUnAccept",e)})),n=this.infoArry[e].audio.length>0||!t?1:2;var s={label_data:JSON.stringify(this.infoArry[e]),is_label:n,uuid:this.uuidArry[e],dataset_id:_store__WEBPACK_IMPORTED_MODULE_6__["a"].getters.uuid};Object(_api_mark__WEBPACK_IMPORTED_MODULE_7__["d"])(s).then((function(e){console.log(e),a.$message({message:"保存成功",duration:300,type:"success"}),a.requireaudio(),a.requiretag().then((function(){console.log("thenthenthenthen"),1==a.nopnum&&(a.nownum<a.audioArry.length-1?(a.nownum++,a.isnowlabel1()):a.returnaudioviewNoSave()),2==a.nopnum&&(a.nownum>0?(a.nownum--,a.isnowlabel1()):a.returnaudioviewNoSave()),a.unable=!1}))})).catch((function(e){console.log("error",e),a.$message({message:"保存失败",type:"error"}),a.requireaudio(),a.requiretag()}))}}},components:{wave:_components_wave_vue__WEBPACK_IMPORTED_MODULE_2__["a"],miniaudio:_components_miniaudio_vue__WEBPACK_IMPORTED_MODULE_3__["a"]}}},b6d5:function(e,t,i){"use strict";i.d(t,"c",(function(){return o})),i.d(t,"d",(function(){return n})),i.d(t,"a",(function(){return r})),i.d(t,"b",(function(){return s})),i.d(t,"e",(function(){return l}));var a=i("b775");function o(e){return Object(a["a"])({url:"/8085/label/setLabeling",method:"post",params:e})}function n(e){return Object(a["a"])({url:"/8082/label",method:"put",data:e})}function r(e,t){return Object(a["a"])({url:"/8082/dataset/auto",method:"post",params:e,timeout:5e3*t})}function s(e){return Object(a["a"])({url:"/8082/dataset/save",method:"post",params:e})}function l(e){return Object(a["a"])({url:"/8085/data/setUnAccept",method:"put",params:e})}},c7e3:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[e.isaudioview?i("div",{staticClass:"dashboard-container"},[i("div",[i("el-button",{on:{click:e.returndataset}},[e._v("返回数据集")])],1),e._l(e.audiolargeArry,(function(t,a){return i("div",{key:a,staticStyle:{display:"inline-block","margin-left":"50px"}},[i("miniaudio",{staticStyle:{"margin-top":"20px"},attrs:{audioname:t,ismarked:t.islabel},on:{entermark:function(t){return e.entermark(a)}}})],1)}))],2):e._e(),e.isaudioview?e._e():i("div",{staticClass:"dashboard-container",staticStyle:{"margin-left":"100px"}},[i("el-button",{attrs:{disabled:e.isdisablebutton},on:{click:e.returnaudioview}},[e._v("保存并返回音频预览")]),i("el-button",{attrs:{disabled:e.isdisablebutton},on:{click:e.skipaudiopre}},[e._v("上一个(A)")]),i("el-button",{attrs:{disabled:e.isdisablebutton},on:{click:e.previousaudio}},[e._v("保存并上一个(S)")]),i("el-button",{attrs:{disabled:e.isdisablebutton},on:{click:e.nextaudio}},[e._v("保存并下一个D)")]),i("el-button",{attrs:{disabled:e.isdisablebutton},on:{click:e.skipaudionext}},[e._v("下一个(F)")]),i("el-button",{attrs:{disabled:e.isdisablebutton},on:{click:e.nomarkedaudio}},[e._v("无可标注类型(G)")]),i("wave",{ref:"waveref",staticStyle:{"margin-top":"20px"},attrs:{premarktype:this.marktype,audioindex:this.nownum,auditremakeinfo:this.auditinfoArry[e.nownum],acceptremakeinfo:this.acceptinfoArry[e.nownum],fatheraudioUrl:this.audioArry[e.nownum],lastlabelArry:this.lastinfoArry[e.nownum]},on:{closebutton:e.closebutton,saveaudioinfo:e.saveaudioinfo}})],1)])},o=[],n=i("a1c6"),r=n["a"],s=(i("854a"),i("2877")),l=Object(s["a"])(r,a,o,!1,null,"391883b2",null);t["default"]=l.exports},d1f0:function(e,t,i){},d28d:function(e,t,i){"use strict";i.d(t,"a",(function(){return o})),i.d(t,"b",(function(){return n})),i.d(t,"c",(function(){return r}));var a=i("b775");function o(e){return Object(a["a"])({url:"/8082/dataset/tag",method:"get",params:e})}function n(e){return Object(a["a"])({url:"/8085/tag/saveTags",method:"post",data:e})}function r(e){return Object(a["a"])({url:"/8085/tag/updateTags",method:"put",data:e})}},f021:function(e,t,i){"use strict";i("50b9")}}]);