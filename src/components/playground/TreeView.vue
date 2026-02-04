<template>
  <div>
    <h2 class="mb-3">Иерархия (Tree)</h2>

    <b-card>
      <TreeNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :level="0"
        @update="emitUpdate"
      />
    </b-card>
  </div>
</template>

<script>
import TreeNode from './TreeNode.vue'

export default {
  name: 'TreeView',
  components: { TreeNode },
  props: {
    nodes: {
      type: Array,
      required: true,
    },
  },
  methods: {
    emitUpdate() {
      // для sync
      this.$emit('update:nodes', this.nodes)
    },
  },
}
</script>
