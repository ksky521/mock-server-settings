<template>
<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#addProxyModal">添加</button>
<table class="table table-hover">
  <thead>
    <tr>
      <th>本地路径</th>
      <th>线上地址</th>
      <th>&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in items">
      <td>{{item.path}}</td>
      <td>{{item.url}}</td>
      <td class="op">
          <a href="#" data-toggle="tooltip" title="删除" class="glyphicon glyphicon-remove-circle" @click.stop="remove($index)"></a>
      </td>
    </tr>
  </tbody>
</table>
<div class="modal fade" id="addProxyModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">输入代理规则</h4>
      </div>
      <div class="modal-body">
        <div class="form-group" :class="{
          'has-error': editPathError
        }">
          <label for="exampleInputEmail1">本地路径</label>
          <input type="text" class="form-control" placeholder="请输入本地路径" v-model="editPath">
          <p class="help-block">支持minimatch和正则，例如：/demo/t-(.*).json</p>
        </div>
      <div class="form-group" :class="{
          'has-error': editUrlError
        }">
        <label for="exampleInputPassword1">线上地址</label>
          <input type="text" class="form-control" placeholder="请输入对应线上地址" v-model="editUrl">
          <p class="help-block">支持$x正则匹配，例如：http://js8.in/$1.json</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">删除</button>
        <button type="button" class="btn btn-success" @click="save()">保存</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    'items': Array
  },
  data () {
    return {
      editPath: '',
      editUrl: '',
      editUrlError: false,
      editPathError: false
    }
  },
  methods: {
    remove: function (i) {
      this.$dispatch('delRevProxy', i)
    },
    save: function () {
      var regUrl = /^http[s]?:\/\/.*\//
      var path = (this.editPath || '').trim()
      var url = (this.editUrl || '').trim()
      if (!path) {
        this.editPathError = true
      }
      if (!url && regUrl.test(this.editUrl)) {
        this.editUrlError = true
      }
      if (!this.editPathError && !this.editUrlError) {
        this.$dispatch('addRevProxy', {
          path: path,
          url: url
        })
      }
    }
  },
  events: {
    addRevProxyCallback: function (d) {
      this.items.push(d)
      $('#addProxyModal').modal('hide')
      this.editUrl = ''
      this.editPath = ''
    },
    delRevProxyCallback: function (i) {
      this.items.splice(i, 1)
    }
  }
}
</script>
<style>
.op a{
  color: #D9534F;
  text-decoration: none;
}
tbody tr:hover .op a{
  display: inline-block;
}
</style>
