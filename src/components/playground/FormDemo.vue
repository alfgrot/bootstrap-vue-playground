<template>
  <b-container class="my-4">
    <h3>Form Demo</h3>
    <b-form @submit.prevent="submit">
      <b-form-group label="Имя">
        <b-form-input v-model="form.name" />
      </b-form-group>

      <b-form-group label="Роль">
        <b-form-select v-model="form.role" :options="roles" />
      </b-form-group>

      <b-form-checkbox v-model="form.active">
        Активен
      </b-form-checkbox>

      <div class="mt-3">
        <b-button type="submit" variant="primary">Сохранить</b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      form: { name: '', role: null, active: false },
      roles: [
        { value: null, text: 'Выберите роль' },
        { value: 'admin', text: 'Администратор' },
        { value: 'user', text: 'Пользователь' }
      ]
    }
  },
  methods: {
    submit() {
      alert(JSON.stringify(this.form, null, 2))
    }
  }
}
</script>
