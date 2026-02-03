<template>
  <div>

    <!-- NAVBAR -->
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand href="#">Bootstrap-Vue UI</b-navbar-brand>

      <b-nav>
        <b-nav-item active>Главная</b-nav-item>
        <b-nav-item>Настройки</b-nav-item>
      </b-nav>
    </b-navbar>

    <b-container class="mt-4">

      <!-- ALERT -->
      <b-alert show variant="info">
        Это витрина компонентов Bootstrap-Vue
      </b-alert>

      <!-- GRID + CARDS -->
      <b-row>
        <b-col md="6">
          <b-card title="Карточка 1" class="mb-3">
            <b-card-text>
              Статус:
              <b-badge variant="success">Активен</b-badge>
            </b-card-text>

            <!-- DROPDOWN -->
            <b-dropdown text="Действия" variant="primary">
              <b-dropdown-item>Редактировать</b-dropdown-item>
              <b-dropdown-item>Удалить</b-dropdown-item>
            </b-dropdown>
          </b-card>
        </b-col>

        <b-col md="6">
          <b-card title="Карточка 2" class="mb-3">
            <!-- SPINNER -->
            <div class="text-center">
              <b-spinner label="Загрузка..."></b-spinner>
            </div>
          </b-card>
        </b-col>
      </b-row>

      <!-- TABS -->
      <b-tabs content-class="mt-3">
        <b-tab title="Вкладка 1" active>
          Контент первой вкладки
        </b-tab>
        <b-tab title="Вкладка 2">
          Контент второй вкладки
        </b-tab>
      </b-tabs>

      <!-- COLLAPSE -->
      <b-button
        v-b-toggle.collapseBlock
        variant="secondary"
        class="mt-3"
      >
        Показать детали
      </b-button>

      <b-collapse id="collapseBlock" class="mt-2">
        <b-card>
          Скрытый блок (Collapse)
        </b-card>
      </b-collapse>

      <!-- PAGINATION -->
      <div class="d-flex justify-content-center mt-4">
        <b-pagination
          v-model="page"
          :total-rows="50"
          :per-page="10"
        />
      </div>

    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1
    }
  }
}
</script>
