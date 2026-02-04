<template>
  <b-modal ref="modal" :title="title" hide-footer>
    <b-form v-if="local">
      <b-form-group label="Имя">
        <b-form-input v-model="local.name" />
      </b-form-group>

      <b-form-checkbox v-model="local.active">
        Активен
      </b-form-checkbox>

      <div class="mt-3 text-right">
        <b-button variant="secondary" class="mr-2" @click="$refs.modal.hide()">
          Отмена
        </b-button>

        <b-button variant="primary" @click="save">
          Сохранить
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  name: 'EditModal',

  data() {
    return {
      mode: 'edit', // edit | addRoot | addChild
      title: 'Редактирование',
      local: null,
      parentId: null
    }
  },

  methods: {
    showEdit(item) {
      this.mode = 'edit'
      this.title = `Редактирование: ${item.name}`
      this.local = { ...item }
      this.parentId = null
      this.$refs.modal.show()
    },

    showAddRoot() {
      this.mode = 'addRoot'
      this.title = 'Добавить новый элемент (root)'
      this.local = {
        name: '',
        active: true
      }
      this.parentId = null
      this.$refs.modal.show()
    },

    showAddChild(parentItem) {
      this.mode = 'addChild'
      this.title = `Добавить дочерний элемент для: ${parentItem.name}`
      this.local = {
        name: '',
        active: true
      }
      this.parentId = parentItem.id
      this.$refs.modal.show()
    },

    save() {
      if (!this.local.name || this.local.name.trim().length === 0) {
        alert('Имя не должно быть пустым')
        return
      }

      if (this.mode === 'edit') {
        this.$store.commit('UPDATE_ITEM', this.local)
      }

      if (this.mode === 'addRoot') {
        this.$store.commit('ADD_ROOT_ITEM', this.local)
      }

      if (this.mode === 'addChild') {
        this.$store.commit('ADD_CHILD_ITEM', {
          parentId: this.parentId,
          name: this.local.name,
          active: this.local.active
        })
      }

      this.$refs.modal.hide()
    }
  }
}
</script>
