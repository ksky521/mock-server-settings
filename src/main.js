import Vue from 'vue'
import App from './App'
Vue.config.debug = true
/* eslint-disable no-new */

var ioUrl = 'http://' + window.location.hostname + ':8800'
var socket = window.io(ioUrl)
var vm = new Vue({
  el: 'body',
  data: {},
  components: {
    App
  },
  events: {
    changeFolder: function (d) {
      socket.emit('changeFolder', d)
    },
    sendAddFolder: function (d) {
      socket.emit('addFolder', d)
    },
    delFolder: function (d) {
      socket.emit('delFolder', d)
    },
    sendSubFolder: function (d) {
      socket.emit('sendSubFolder', d)
    }
  }
})

socket.on('init', function (d) {
  vm.$broadcast('initFolderList', d)
}).on('folderList', function (j) {
  // 点击侧边栏
  if (j.errno === 0) {
    vm.$broadcast('receiveFolder', {
      folder: j.folder,
      isNew: false
    })
    vm.$broadcast('fileList', j.data)
  } else {
    alert('获取文件列表失败')
  }
}).on('folderStatus', function (d) {
  if (d.errno !== 0) {
    alert('不是一个目录')
  } else {
    vm.$broadcast('receiveFolder', {
      folder: d.folder,
      isNew: true
    })
    vm.$broadcast('fileList', d.files)
  }
}).on('deleteStatus', function (d) {
  if (d.errno !== 0) {
    alert('删除失败')
  }
}).on('subFolderStatus', function (d) {
  if (d.errno !== 0) {
    alert('不是个目录或者目录不存在')
  } else {
    vm.$broadcast('subFolderStatus', d)
  }
})
