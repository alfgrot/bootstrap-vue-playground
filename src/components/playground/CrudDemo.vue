<template>
  <b-container class="my-4">
    <h3>CRUD Demo</h3>

    <!-- Кнопка добавить -->
    <b-button variant="success" class="mb-3" @click="openModal()">Добавить запись</b-button>

    <!-- Таблица -->
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button size="sm" variant="primary" @click="openModal(row.item)">Редактировать</b-button>
        <b-button size="sm" variant="danger" class="ml-1" @click="deleteItem(row.item)">Удалить</b-button>
      </template>
    </b-table>

    <!-- Модалка с формой -->
    <b-modal ref="crudModal" :title="modalTitle" @hide="resetForm">
      <b-form @submit.prevent="saveItem">
        <b-form-group label="Имя">
          <b-form-input v-model="form.name" required />
        </b-form-group>

        <b-form-group label="Роль">
          <b-form-select v-model="form.role" :options="roles" required />
        </b-form-group>

        <b-form-checkbox v-model="form.active">Активен</b-form-checkbox>

        <div class="mt-3">
          <b-button type="submit" variant="primary">Сохранить</b-button>
        </div>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  name: 'CrudDemo',
  data() {
    return {
      items: [
        { id: 1, name: 'Иван', role: 'admin', active: true },
        { id: 2, name: 'Анна', role: 'user', active: false }
      ],
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Имя' },
        { key: 'role', label: 'Роль' },
        { key: 'active', label: 'Активен' },
        { key: 'actions', label: 'Действия' }
      ],
      form: {
        id: null,
        name: '',
        role: null,
        active: false
      },
      roles: [
        { value: null, text: 'Выберите роль' },
        { value: 'admin', text: 'Администратор' },
        { value: 'user', text: 'Пользователь' }
      ],
      modalTitle: 'Добавить запись'
    }
  },
  methods: {
    openModal(item = null) {
      if (item) {
        this.form = { ...item }
        this.modalTitle = 'Редактировать запись'
      } else {
        this.resetForm()
        this.modalTitle = 'Добавить запись'
      }
      this.$refs.crudModal.show()
    },
    saveItem() {
      if (this.form.id) {
        // редактирование
        const index = this.items.findIndex(i => i.id === this.form.id)
        this.items.splice(index, 1, { ...this.form })
        this.$bvToast.toast('Запись обновлена', { title: 'Успешно', variant: 'success', solid: true })
      } else {
        // добавление
        this.form.id = this.items.length ? Math.max(...this.items.map(i => i.id)) + 1 : 1
        this.items.push({ ...this.form })
        this.$bvToast.toast('Запись добавлена', { title: 'Успешно', variant: 'success', solid: true })
      }
      this.$refs.crudModal.hide()
    },
    deleteItem(item) {
      if (confirm(`Удалить ${item.name}?`)) {
        this.items = this.items.filter(i => i.id !== item.id)
        this.$bvToast.toast('Запись удалена', { title: 'Успешно', variant: 'danger', solid: true })
      }
    },
    resetForm() {
      this.form = { id: null, name: '', role: null, active: false }
    }
  }
}
</script>
