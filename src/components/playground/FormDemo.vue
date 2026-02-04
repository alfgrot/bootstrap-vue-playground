<template>
  <div class="mb-5">
    <h2>Form</h2>

    <b-form @submit.prevent>
      <b-form-group label="Имя">
        <b-form-input v-model="form.name" />
      </b-form-group>

      <b-form-group label="Роль">
        <b-form-select :options="roles" v-model="form.role" />
      </b-form-group>

      <b-form-checkbox v-model="form.active">
        Активен
      </b-form-checkbox>

      <div class="mt-3">
        <b-button variant="primary" @click="submit">
          Сохранить
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roles: ['Админ', 'Пользователь'],
      form: {
        name: '',
        role: null,
        active: false
      }
    }
  },

  methods: {
    submit() {
      console.log('Форма:', this.form)
    }
  }
}
</script>
