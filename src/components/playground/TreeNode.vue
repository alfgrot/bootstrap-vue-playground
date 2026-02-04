<template>
  <div class="py-1">
    <div
      class="tree-row d-flex align-items-center"
      :class="rowClasses"
      :style="{ paddingLeft: `${level * 22}px` }"
      draggable="true"
      @click="select"
      @dragstart="onDragStart"
      @dragover="onDragOver"
      @dragleave="dropPosition = null"
      @drop="onDrop"
    >
      <b-button
        v-if="hasChildren"
        size="sm"
        variant="link"
        class="p-0 mr-2"
        @click.stop="expanded = !expanded"
      >
        <b-icon :icon="expanded ? 'caret-down-fill' : 'caret-right-fill'" />
      </b-button>

      <span v-else class="mr-2" style="width:18px"></span>

      <b-badge class="mr-2" :variant="node.type === 'folder' ? 'primary' : 'secondary'">
        <b-icon :icon="node.type === 'folder' ? 'folder-fill' : 'file-earmark'" class="mr-1" />
        {{ node.type }}
      </b-badge>

      <div class="flex-grow-1">
        <strong v-html="highlight(node.title)" />
      </div>

      <b-dropdown size="sm" variant="outline-secondary" right>
        <template #button-content>
          <b-icon icon="three-dots-vertical" />
        </template>
        <b-dropdown-item @click.stop="addChild">Добавить</b-dropdown-item>
        <b-dropdown-item class="text-danger" @click.stop="deleteSelf">
          Удалить
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <b-collapse :visible="expanded && hasChildren">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :selected-ids="selectedIds"
        :search="search"
        @select="$emit('select', $event)"
        @drop-node="$emit('drop-node', $event)"
        @update="$emit('update')"
      />
    </b-collapse>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',

  props: {
    node: Object,
    level: Number,
    selectedIds: Array,
    search: String,
  },

  data() {
    return {
      expanded: true,
      dropPosition: null, // before | inside | after
    }
  },

  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length
    },

    rowClasses() {
      return {
        selected: this.selectedIds.includes(this.node.id),
        'drop-before': this.dropPosition === 'before',
        'drop-after': this.dropPosition === 'after',
        'drop-inside': this.dropPosition === 'inside',
      }
    },
  },

  methods: {
    select(e) {
      this.$emit('select', {
        id: this.node.id,
        ctrl: e.ctrlKey || e.metaKey,
        shift: e.shiftKey,
      })
    },

    highlight(text) {
      if (!this.search) return text
      return text.replace(
        new RegExp(`(${this.search})`, 'gi'),
        '<mark>$1</mark>'
      )
    },

    onDragStart(e) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', this.node.id)
    },

    onDragOver(e) {
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      const y = e.clientY - rect.top
      const h = rect.height

      this.dropPosition =
        y < h * 0.25 ? 'before' :
        y > h * 0.75 ? 'after' :
        'inside'
    },

    onDrop(e) {
      e.preventDefault()
      this.$emit('drop-node', {
        draggedId: Number(e.dataTransfer.getData('text/plain')),
        targetId: this.node.id,
        position: this.dropPosition,
      })
      this.dropPosition = null
    },

    addChild() {
      if (!this.node.children) this.$set(this.node, 'children', [])
      this.node.children.push({
        id: Date.now(),
        title: 'Новый элемент',
        type: 'item',
        children: [],
      })
      this.expanded = true
      this.$emit('update')
    },

    deleteSelf() {
      this.$emit('delete-child', this.node.id)
    },
  },
}
</script>

<style scoped>
.tree-row {
  user-select: none;
  border-radius: 4px;
}

.tree-row.selected {
  background: #dbeafe;
}

.tree-row.drop-before {
  border-top: 2px solid #0d6efd;
}

.tree-row.drop-after {
  border-bottom: 2px solid #0d6efd;
}

.tree-row.drop-inside {
  background: rgba(13, 110, 253, 0.1);
}
</style>
