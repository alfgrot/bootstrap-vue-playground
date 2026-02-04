<template>
  <div class="py-1">
    <div class="d-flex align-items-center" :style="{ paddingLeft: `${level * 22}px` }">
      <b-button
        v-if="hasChildren"
        size="sm"
        variant="link"
        class="p-0 mr-2"
        @click="toggle"
      >
        <b-icon :icon="expanded ? 'caret-down-fill' : 'caret-right-fill'" />
      </b-button>

      <span v-else class="mr-2" style="width: 18px;"></span>

      <b-badge
        class="mr-2"
        :variant="node.type === 'folder' ? 'primary' : 'secondary'"
      >
        {{ node.type }}
      </b-badge>

      <div class="flex-grow-1">
        <div v-if="!editing">
          <strong>{{ node.title }}</strong>
          <small class="text-muted ml-2">#{{ node.id }}</small>
        </div>

        <!-- ВАЖНО: это не form, поэтому Enter не сабмитит страницу -->
        <div v-else class="d-flex align-items-center">
          <b-form-input
            v-model="editTitle"
            size="sm"
            class="mr-2"
            @keydown.enter.prevent="saveEdit"
            @keydown.esc.prevent="cancelEdit"
          />
          <b-button size="sm" variant="success" class="mr-2" @click="saveEdit">
            Сохранить
          </b-button>
          <b-button size="sm" variant="outline-secondary" @click="cancelEdit">
            Отмена
          </b-button>
        </div>
      </div>

      <div class="ml-2 d-flex">
        <b-button size="sm" variant="outline-primary" class="mr-2" @click="startEdit">
          <b-icon icon="pencil" />
        </b-button>

        <b-button size="sm" variant="outline-success" class="mr-2" @click="addChild">
          <b-icon icon="plus" />
        </b-button>

        <b-button size="sm" variant="outline-danger" @click="deleteSelf">
          <b-icon icon="trash" />
        </b-button>
      </div>
    </div>

    <div v-if="expanded && hasChildren" class="mt-1">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @update="$emit('update')"
        @delete-child="removeChild"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',
  props: {
    node: { type: Object, required: true },
    level: { type: Number, default: 0 },
  },
  data() {
    return {
      expanded: true,
      editing: false,
      editTitle: '',
    }
  },
  computed: {
    hasChildren() {
      return this.node.children && this.node.children.length > 0
    },
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },

    startEdit() {
      this.editing = true
      this.editTitle = this.node.title
    },

    cancelEdit() {
      this.editing = false
      this.editTitle = ''
    },

    saveEdit() {
      const t = String(this.editTitle || '').trim()
      if (!t) return
      this.node.title = t
      this.editing = false
      this.$emit('update')
    },

    // 🔥 ВАЖНО: ID берётся следующий после максимального среди детей текущего node
    getNextChildId() {
      const children = this.node.children || []
      if (children.length === 0) return this.node.id * 10 + 1 // если пусто — просто красиво

      let maxId = 0
      for (const c of children) {
        if (c.id > maxId) maxId = c.id
      }
      return maxId + 1
    },

    addChild() {
      if (!this.node.children) this.$set(this.node, 'children', [])

      const newId = this.getNextChildId()

      this.node.children.push({
        id: newId,
        title: 'Новый элемент',
        type: 'item',
        children: [],
      })

      this.expanded = true
      this.$emit('update')
    },

    deleteSelf() {
      // Для корневого элемента — просто очистим детей
      // (иначе его не удалить, потому что у него нет родителя)
      if (!this.$parent || !this.$parent.node) {
        this.node.children = []
        this.$emit('update')
        return
      }

      // Если у компонента есть родитель TreeNode, он пришлёт delete-child
      this.$emit('delete-child', this.node.id)
    },

    removeChild(childId) {
      const idx = this.node.children.findIndex((x) => x.id === childId)
      if (idx !== -1) this.node.children.splice(idx, 1)
      this.$emit('update')
    },
  },
}
</script>
