<template>
  <div>
    <h2 class="mb-3">Иерархия (Tree)</h2>

    <!-- Поиск -->
    <b-input-group class="mb-3">
      <b-form-input
        v-model="search"
        size="sm"
        placeholder="Поиск по дереву..."
      />
      <b-input-group-append>
        <b-button size="sm" variant="outline-secondary" @click="search = ''">
          <b-icon icon="x" />
        </b-button>
      </b-input-group-append>
    </b-input-group>

    <b-card>
      <TreeNode
        v-for="node in filteredNodes"
        :key="node.id"
        :node="node"
        :level="0"
        :selected-ids="selectedIds"
        :search="search"
        @select="onSelect"
        @drop-node="handleDrop"
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
    nodes: Array,
  },

  data() {
    return {
      search: '',
      selectedIds: [],
      lastSelectedId: null,
    }
  },

  computed: {
    filteredNodes() {
      if (!this.search) return this.nodes
      return this.filterTree(this.nodes, this.search.toLowerCase())
    },
  },

  methods: {
    emitUpdate() {
      this.$emit('update:nodes', this.nodes)
    },

    /* 🔍 поиск */
    filterTree(nodes, search) {
      return nodes
        .map((n) => {
          const children = n.children
            ? this.filterTree(n.children, search)
            : []
          if (
            n.title.toLowerCase().includes(search) ||
            children.length
          ) {
            return { ...n, children }
          }
          return null
        })
        .filter(Boolean)
    },

    /* 🧠 helpers */
    flatten(nodes, arr = []) {
      for (const n of nodes) {
        arr.push(n.id)
        if (n.children) this.flatten(n.children, arr)
      }
      return arr
    },

    findNode(nodes, id) {
      for (const n of nodes) {
        if (n.id === id) return n
        if (n.children) {
          const f = this.findNode(n.children, id)
          if (f) return f
        }
      }
      return null
    },

    findParent(nodes, id, parent = null) {
      for (const n of nodes) {
        if (n.id === id) return parent
        if (n.children) {
          const p = this.findParent(n.children, id, n)
          if (p) return p
        }
      }
      return null
    },

    removeNode(nodes, id) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) return nodes.splice(i, 1)[0]
        if (nodes[i].children) {
          const r = this.removeNode(nodes[i].children, id)
          if (r) return r
        }
      }
      return null
    },

    isDescendant(parent, id) {
      if (!parent.children) return false
      return parent.children.some(
        (c) => c.id === id || this.isDescendant(c, id)
      )
    },

    /* ✅ multi-select */
    onSelect({ id, ctrl, shift }) {
      const flat = this.flatten(this.nodes)

      if (shift && this.lastSelectedId) {
        const a = flat.indexOf(this.lastSelectedId)
        const b = flat.indexOf(id)
        if (a !== -1 && b !== -1) {
          const [from, to] = a < b ? [a, b] : [b, a]
          this.selectedIds = flat.slice(from, to + 1)
        }
      } else if (ctrl) {
        this.selectedIds = this.selectedIds.includes(id)
          ? this.selectedIds.filter((x) => x !== id)
          : [...this.selectedIds, id]
        this.lastSelectedId = id
      } else {
        this.selectedIds = [id]
        this.lastSelectedId = id
      }
    },

    /* 🖱 Drag & Drop */
    handleDrop({ draggedId, targetId, position }) {
      if (draggedId === targetId) return

      const target = this.findNode(this.nodes, targetId)
      if (!target || this.isDescendant(target, draggedId)) return

      const dragged = this.removeNode(this.nodes, draggedId)
      if (!dragged) return

      if (position === 'inside') {
        if (!target.children) this.$set(target, 'children', [])
        target.children.push(dragged)
      } else {
        const parent = this.findParent(this.nodes, targetId)
        const list = parent ? parent.children : this.nodes
        const idx = list.findIndex((n) => n.id === targetId)
        list.splice(position === 'before' ? idx : idx + 1, 0, dragged)
      }

      this.emitUpdate()

      /* 🔔 УВЕДОМЛЕНИЕ — ДОЛГО */
      this.$bvToast.toast('Элемент успешно перемещён', {
        title: 'Готово',
        variant: 'success',
        solid: true,
        autoHideDelay: 5000, // ⬅ 5 секунд
      })
    },
  },
}
</script>
