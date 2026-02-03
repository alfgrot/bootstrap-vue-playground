<template>
  <b-container class="my-4">
    <h3>Table Demo</h3>
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button size="sm" @click="edit(row.item)">Редактировать</b-button>
      </template>
    </b-table>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Имя' },
        { key: 'status', label: 'Статус' },
        { key: 'actions', label: 'Действия' }
      ],
      items: [
        { id: 1, name: 'Иван', status: 'Активен' },
        { id: 2, name: 'Анна', status: 'Неактивен' }
      ]
    }
  },
  methods: {
    edit(item) {
      alert(`Редактировать: ${item.name}`)
    }
  }
}
</script>
