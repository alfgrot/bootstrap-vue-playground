<template>
  <b-container class="my-4">
    <h3>Modal Demo</h3>
    <b-button v-b-modal.demo-modal>Открыть модалку</b-button>

    <b-modal id="demo-modal" title="Пример модалки">
      <p>Контент внутри модального окна</p>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  name: 'ModalDemo'
}
</script>
