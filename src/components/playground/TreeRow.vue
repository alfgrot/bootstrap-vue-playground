<template>
  <div class="tree-row">
    <div class="tree-line">
      <!-- toggle -->
      <button
        v-if="hasChildren"
        class="toggle-btn"
        type="button"
        @click="open = !open"
        :title="open ? 'Свернуть' : 'Развернуть'"
      >
        <span v-if="open">▼</span>
        <span v-else>▶</span>
      </button>

      <span v-else class="toggle-placeholder"></span>

      <!-- name -->
      <span class="node-name">
        {{ item.name }}
      </span>

      <!-- status -->
      <b-badge class="ml-2" :variant="item.active ? 'success' : 'secondary'">
        {{ item.active ? 'Активен' : 'Неактивен' }}
      </b-badge>

      <!-- actions -->
      <b-button
        size="sm"
        variant="outline-secondary"
        class="ml-2"
        @click="$emit('edit', item)"
      >
        ✏️
      </b-button>
    </div>

    <!-- children -->
    <div v-if="open && hasChildren" class="children">
      <TreeRow
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        @edit="$emit('edit', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeRow',
  props: {
    item: Object
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    hasChildren() {
      return Array.isArray(this.item.children) && this.item.children.length > 0
    }
  }
}
</script>

<style scoped>
.tree-row {
  margin-top: 6px;
}

.tree-line {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* кнопка раскрытия */
.toggle-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #d0d7de;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.toggle-btn:hover {
  background: #f6f8fa;
}

/* когда детей нет — ставим пустое место */
.toggle-placeholder {
  width: 28px;
  height: 28px;
  display: inline-block;
}

/* название */
.node-name {
  font-size: 18px;
  font-weight: 600;
}

/* отступ для детей */
.children {
  margin-left: 28px;
  padding-left: 12px;
  border-left: 2px solid #e9ecef;
  margin-top: 6px;
}
</style>
