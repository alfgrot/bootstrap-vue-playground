<template>
  <div>
    <h2 class="mb-3">Иерархия в таблице</h2>

    <b-card>
      <b-table
        :items="flatRows"
        :fields="fields"
        bordered
        striped
        responsive
        small
      >
        <template #cell(title)="row">
          <div
            class="d-flex align-items-center"
            :style="{ paddingLeft: `${row.item.level * 18}px` }"
          >
            <b-button
              v-if="row.item.hasChildren"
              size="sm"
              variant="link"
              class="p-0 mr-2"
              @click="toggleRow(row.item.id)"
            >
              <b-icon
                :icon="
                  isExpanded(row.item.id)
                    ? 'caret-down-fill'
                    : 'caret-right-fill'
                "
              />
            </b-button>

            <span v-else class="mr-2" style="width: 18px"></span>

            <strong>{{ row.item.title }}</strong>
            <small class="text-muted ml-2">#{{ row.item.id }}</small>
          </div>
        </template>

        <template #cell(type)="row">
          <b-badge
            :variant="row.item.type === 'folder' ? 'primary' : 'secondary'"
          >
            {{ row.item.type }}
          </b-badge>
        </template>

        <template #cell(actions)="row">
          <div class="d-flex">
            <b-button
              size="sm"
              variant="outline-primary"
              class="mr-2"
              @click="openEdit(row.item)"
            >
              <b-icon icon="pencil" />
            </b-button>

            <b-button
              size="sm"
              variant="outline-success"
              class="mr-2"
              @click="addChild(row.item)"
            >
              <b-icon icon="plus" />
            </b-button>

            <b-button
              size="sm"
              variant="outline-danger"
              @click="deleteNode(row.item)"
            >
              <b-icon icon="trash" />
            </b-button>
          </div>
        </template>
      </b-table>
    </b-card>

    <!-- Modal -->
    <b-modal
      v-model="editModal"
      title="Редактирование"
      hide-footer
      @keydown.enter.prevent
    >
      <div v-if="editTarget">
        <b-form-group label="Название">
          <b-form-input
            v-model="editTitle"
            @keydown.enter.prevent="saveModal"
          />
        </b-form-group>

        <b-form-group label="Тип">
          <b-form-select v-model="editType" :options="typeOptions" />
        </b-form-group>

        <div class="d-flex justify-content-end">
          <b-button variant="secondary" class="mr-2" @click="closeModal">
            Отмена
          </b-button>
          <b-button variant="success" @click="saveModal"> Сохранить </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'TreeTable',
  props: {
    nodes: { type: Array, required: true },
  },
  data() {
    return {
      fields: [
        { key: 'title', label: 'Название' },
        { key: 'type', label: 'Тип', class: 'text-nowrap' },
        { key: 'actions', label: 'Действия', class: 'text-nowrap' },
      ],

      // ⚠️ Set мутировать нельзя без пересоздания
      expandedIds: new Set([1, 2, 5]),

      editModal: false,
      editTarget: null,
      editTitle: '',
      editType: 'item',

      typeOptions: [
        { value: 'folder', text: 'folder' },
        { value: 'item', text: 'item' },
      ],
    }
  },
  computed: {
    flatRows() {
      const out = []

      const walk = (arr, level = 0, parentId = null) => {
        for (const n of arr) {
          const hasChildren = n.children && n.children.length > 0

          out.push({
            id: n.id,
            title: n.title,
            type: n.type,
            level,
            parentId,
            ref: n,
            hasChildren,
          })

          if (hasChildren && this.isExpanded(n.id)) {
            walk(n.children, level + 1, n.id)
          }
        }
      }

      walk(this.nodes, 0, null)
      return out
    },
  },
  methods: {
    isExpanded(id) {
      return this.expandedIds.has(id)
    },

    toggleRow(id) {
      const next = new Set(this.expandedIds)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      this.expandedIds = next
    },

    addChild(rowItem) {
      const node = rowItem.ref
      if (!node.children) this.$set(node, 'children', [])

      node.children.push({
        id: Date.now(),
        title: 'Новый элемент',
        type: 'item',
        children: [],
      })

      // авто-раскрытие родителя
      const next = new Set(this.expandedIds)
      next.add(node.id)
      this.expandedIds = next

      this.$emit('update:nodes', this.nodes)
    },

    openEdit(rowItem) {
      this.editTarget = rowItem.ref
      this.editTitle = rowItem.ref.title
      this.editType = rowItem.ref.type
      this.editModal = true
    },

    closeModal() {
      this.editModal = false
      this.editTarget = null
      this.editTitle = ''
      this.editType = 'item'
    },

    saveModal() {
      const t = String(this.editTitle || '').trim()
      if (!t) return

      this.editTarget.title = t
      this.editTarget.type = this.editType

      this.$emit('update:nodes', this.nodes)
      this.closeModal()
    },

    deleteNode(rowItem) {
      const id = rowItem.id

      // корень не удаляем — очищаем детей
      if (!rowItem.parentId) {
        rowItem.ref.children = []
        this.$emit('update:nodes', this.nodes)
        return
      }

      const parent = this.findById(this.nodes, rowItem.parentId)
      if (!parent || !parent.children) return

      const idx = parent.children.findIndex((x) => x.id === id)
      if (idx !== -1) parent.children.splice(idx, 1)

      this.$emit('update:nodes', this.nodes)
    },

    findById(nodes, id) {
      for (const n of nodes) {
        if (n.id === id) return n
        if (n.children && n.children.length) {
          const found = this.findById(n.children, id)
          if (found) return found
        }
      }
      return null
    },
  },
}
</script>
