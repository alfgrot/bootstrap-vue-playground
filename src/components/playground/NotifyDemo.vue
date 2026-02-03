<template>
  <b-container class="my-4">
    <h3>Notifications Demo</h3>
    <b-button @click="notify">Показать уведомление</b-button>
  </b-container>
</template>

<script>
export default {
  methods: {
    notify() {
      this.$bvToast.toast('Данные сохранены', {
        title: 'Успешно',
        variant: 'success',
        solid: true
      })
    }
  }
}
</script>
