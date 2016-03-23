import Vue from 'vue'
import App from './App'
Vue.config.debug = true
/* eslint-disable no-new */

var ioUrl = 'http://' + window.location.host
var socket = window.io(ioUrl)
var vm = new Vue({
  el: 'body',
  data: {},
  components: {
    App
  },
  events: {
    'complie:mock': function (d) {
      socket.emit('complie:mock', d)
    },
    'complie:ms': function (d) {
      socket.emit('complie:ms', d)
    },
    addRevProxy: function (d) {
      socket.emit('addRevProxy', d)
    },
    delRevProxy: function (d) {
      socket.emit('delRevProxy', d)
    },
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
    },
    setIntervalTime: function (t) {
      t = parseInt(t, 10)
      socket.emit('watchTimeInterval', {timeout: t})
    },
    fileAddWatch: function (t) {
      socket.emit('addWatch', t)
    },
    fileUnwatch: function (t) {
      socket.emit('unwatch', t)
    }
  }
})

socket.on('init', function (d) {
  console.log(d)
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
}).on('addRevProxyCallback', function (d) {
  if (d.errno !== 0) {
    alert('设置反向代理失败，请检查正则')
  } else {
    vm.$broadcast('addRevProxyCallback', d)
  }
}).on('delRevProxyCallback', function (d) {
  vm.$broadcast('delRevProxyCallback', d)
})
