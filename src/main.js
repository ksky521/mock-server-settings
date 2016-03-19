import Vue from 'vue'
import App from './App'
Vue.config.debug = true
const DEBUG_LEVEL = 5
var debug = function (msg, level) {
  level = level || 5
  if (level >= DEBUG_LEVEL) {
    console.log(msg)
  }
}

/* eslint-disable no-new */

var ioUrl = 'http://' + window.location.hostname + ':8800'
var socket = window.io(ioUrl)
var vm = new Vue({
  el: 'body',
  data: {
  },
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
    }
  }
})

socket.on('initFolderList', function (d) {
  debug(d)
  vm.$broadcast('initFolderList', d)
}).on('folderList', function (j) {
  // console
  if (j.errno === 0) {
    vm.$broadcast('fileList', j.data)
  } else {
    alert('获取文件列表失败')
  }
}).on('folderStatus', function (d) {
  if (d.errno !== 0) {
    alert('不是一个目录')
  } else {
    vm.$broadcast('receiveFolder', d.folder)
  }
}).on('deleteStatus', function (d) {
  if (d.errno !== 0) {
    alert('删除失败')
  }
})
