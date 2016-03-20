<template>
  <div class="list-group" id="folders">
    <a href="javascript:" class="list-group-item" v-for="item in items" :class="{
            'active': ($index === activeIndex)
          }" @click="active($index, item)">
        <span>{{ item }}</span>
        <i class="btn btn-danger btn-sm glyphicon glyphicon-trash" title="从列表中去除" data-toggle="tooltip" @click.stop="remove($index, item, $event)"></i>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    items: Array,
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  methods: {
    remove: function (i, f, evt) {
      var folder = this.items.splice(i, 1)
      this.$dispatch('delFolder', {
        folder: folder[0]
      })
    },
    active: function (i, f) {
      this.activeIndex = i
      var activeFolder = this.items[this.activeIndex]
      this.$dispatch('changeFolder', {
        folder: activeFolder
      })
    }
  }
}
</script>
<style lang="scss">
  #folders .list-group-item{
    i{
      display: none;
    }
    &:hover i{
      position: absolute;
      right: 7px;
      top: 7px;
      display: inline-block;
    }
  }
</style>
