<template>
  <div id="vue" class="container">
      <div class="row">
          <div class="col-sm-5 projects-box">
              <div class="page-header">
                  <h3>项目列表</h3>
              </div>
              <div class="input-group mb20">
                  <input class="form-control" v-model="newFolder" @keyup.enter="addFolder" placeholder="请输入项目所在目录...">
                  <span class="input-group-btn">
                      <button class="btn btn-success" type="submit" @click="addFolder">添加</button>
                  </span>
              </div>

              <folder-item :items=folders active-index=curFolderIndex></folder-item>
          </div>

          <div class="project-box col-sm-7">
            <tabs>
              <tab header="文件列表">
                <ul class="breadcrumb">
                    <li><a href="javascript:" @click="activeRoot(curFolder)">{{curFolder}}</a></li>
                    <li v-for="f in subFolders"><a href="javascript:" @click="activeSubFolder(f)">{{f}}</a></li>
                </ul>
                <file-item :hosts=hosts :sub-folders=subFolders :port=port></file-item>
              </tab>
              <tab header="反向代理">

              </tab>
              <tab header="设置">
                <ul class="nav nav-pills" role="tablist">
                  <li role="presentation" class="active"><a href="#autoCompile" aria-controls="home" role="tab" data-toggle="tab">自动编译</a></li>
                  <li role="presentation"><a href="#refreshSet" aria-controls="profile" role="tab" data-toggle="tab">刷新设置</a></li>
                </ul>
                 <div class="tab-content">
                  <div role="tabpanel" class="tab-pane active" id="autoCompile">
                    <legend>Mockjs自动编译</legend>
                    <div class="checkbox">
                      <label>
                          <input type="checkbox" v-model="compileMock"> 遇见mock扩展名文件自动编译
                      </label>
                      <p :class="{
                      'text-success': compileMock,
                      'text-muted': !compileMock
                      }">
                          <i class="glyphicon glyphicon-ok"></i>
                          变更后的.mock文件将自动编译为.json文件输出
                      </p>
                    </div>
                    <legend>ms自动处理</legend>
                    <div class="checkbox">
                      <label>
                          <input type="checkbox" v-model="compileMs"> 遇见同名ms扩展名文件自动加载执行
                      </label>
                      <p :class="{
                      'text-success': compileMs,
                      'text-muted': !compileMs
                      }">
                          <i class="glyphicon glyphicon-ok"></i>
                          变更后的.ms文件将自动加载处理同名json/mock数据
                      </p>
                    </div>
                  </div>
                  <div role="tabpanel" class="tab-pane" id="refreshSet">
                    <legend>延迟刷新</legend>
                    <div class="input-group" id="w150">
                        <span class="input-group-addon">等待</span>
                        <input class="form-control" type="text" v-model="refreshDelay" number>
                        <span class="input-group-addon">秒</span>
                    </div>
                    <p :class="{
                        'text-success': refreshDelay,
                        'text-muted': !refreshDelay
                        }">
                      <i class="glyphicon glyphicon-ok"></i>检测到文件变更以后，会等待一段时间后，再更新样式和内容
                    </p>
                  </div>
                </div>

              </tab>
            </tabs>

          </div>
      </div>
  </div>
</template>

<script>
  import folderItem from './components/FolderItem'
  import fileItem from './components/FileItem'
  import tab from 'vue-strap/src/Tab'
  import tabs from 'vue-strap/src/Tabset'
  export default {
    components: {
      folderItem,
      fileItem,
      tabs,
      tab
    },
    data () {
      return {
        folders: [],
        hosts: [],
        port: '',
        curFolder: '',
        curFolderIndex: 0,
        lastSubFolder: '',
        newFolder: '',
        refreshDelay: 0,
        compileMock: true,
        compileMs: true,
        subFolders: []
      }
    },
    watch: {
      refreshDelay: function (v) {
        this.$dispatch('setIntervalTime', v)
      },
      compileMock: function (v, ov) {
        this.$dispatch('complie:mock', v)
      },
      compileMs: function (v, ov) {
        this.$dispatch('complie:ms', v)
      }
    },
    methods: {
      addFolder: function () {
        var f = this.newFolder.trim()
        if (f && this.folders.indexOf(f) === -1) {
          this.$dispatch('sendAddFolder', {
            folder: f
          })
        }
      },
      activeRoot: function (folder) {
        this.subFolders = []
        this.$dispatch('sendSubFolder', {
          curFolder: this.curFolder,
          newSubFolder: '',
          subFolders: this.subFolders
        })
      },
      activeSubFolder: function (subFolder) {
        subFolder = String(subFolder).trim()
        if (subFolder === this.lastSubFolder) {
          return
        }
        var index = this.subFolders.indexOf(subFolder)
        this.subFolders.splice(index)
        if (subFolder) {
          this.$dispatch('sendSubFolder', {
            curFolder: this.curFolder,
            newSubFolder: subFolder,
            subFolders: this.subFolders
          })
        } else {
          alert('错误的路径')
        }
      },
      addFolderArray: function (f) {
        f && this.folders.unshift(f)
      }
    },
    events: {
      receiveFolder: function (j) {
        j.isNew && this.addFolderArray(j.folder)
        this.newFolder = ''
        this.curFolder = j.folder
        this.subFolders = []
      },
      subFolderStatus: function (d) {
        this.$broadcast('fileList', d.files)
        if (d.newSubFolder) {
          this.lastSubFolder = d.newSubFolder
          this.subFolders.push(d.newSubFolder)
        }
      },
      subFolderClick: function (d) {
        this.$dispatch('sendSubFolder', {
          curFolder: this.curFolder,
          newSubFolder: d,
          subFolders: this.subFolders
        })
      },
      initFolderList: function (d) {
        this.folders = d.folderList
        this.curFolder = d.curFolder
        this.curFolderIndex = this.folders.indexOf(d.curFolder)
        this.$broadcast('setFolderItemIndex', this.curFolderIndex)
        this.$broadcast('fileList', d.files)
        this.hosts = d.hosts
        this.port = d.port
      }
    }
  }
</script>
<style lang="scss">
  .nav-pills~.tab-content{
    padding-top: 20px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .project-box{
    padding-top: 45px
  }
  #w150{
    width: 150px;
    .form-control{
      text-align: right;
    }
  }
  .text-muted .glyphicon {
    display: none;
  }
  .text-success .glyphicon{
    margin-right: 3px;
  }
  .project-box p {
    margin-top: 5px;
  }
</style>
