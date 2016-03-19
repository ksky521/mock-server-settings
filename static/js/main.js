(function ($) {
    var port = location.port;
    var ioUrl = port ? (location.host + ':' + port) : location.host;
    var socket = io(ioUrl);
    // 定义目录列表组件
    var MyComponent = Vue.extend({
        template: ''
    })

    var vm = new Vue({
        el: '#vue',
        data: {
            folders: [],
            newFolder: '',
        },
        methods: {
            addFolder: function () {
                var f = this.newFolder.trim();
                console.log(f);
                if (f) {
                    socket.emit('addFolder', {
                        folder: f
                    });
                }
            },
            addFolderArray: function (f) {
                this.folders.push({
                    text: f
                });
                this.newFolder = '';
            }
        }

    });
    socket.on('addFolder success', function (d) {
        if (d.errno === 0) {
            vm.addFolderArray(d.folder);
        } else {
            alert('错误');
        }
    });
}(jQuery));
