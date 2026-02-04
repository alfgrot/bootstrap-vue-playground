<template>
  <b-modal ref="modal" title="Подтверждение удаления" hide-footer>
    <div v-if="item">
      <p class="mb-2">
        Удалить элемент:
        <b>{{ item.name }}</b> ?
      </p>

      <p class="text-muted">
        ⚠️ Если у него есть дочерние элементы — они тоже удалятся.
      </p>

      <div class="mt-3 text-right">
        <b-button variant="secondary" class="mr-2" @click="$refs.modal.hide()">
          Отмена
        </b-button>

        <b-button variant="danger" @click="confirm">
          Удалить
        </b-button>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'DeleteModal',

  data() {
    return {
      item: null
    }
  },

  methods: {
    show(item) {
      this.item = item
      this.$refs.modal.show()
    },

    confirm() {
      this.$store.commit('DELETE_ITEM', this.item.id)
      this.$refs.modal.hide()
    }
  }
}
</script>
