<template>
  <b-container class="py-4">
    <h1 class="mb-4">BootstrapVue Lab</h1>

    <b-tabs content-class="mt-3">
      <b-tab title="Дерево (Tree)" active>
        <TreeView :nodes.sync="tree" />
      </b-tab>

      <b-tab title="Дерево в таблице (Tree Table)">
        <TreeTable :nodes.sync="tree" />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import TreeView from './playground/TreeView.vue'
import TreeTable from './playground/TreeTable.vue'

export default {
  name: 'Demo',
  components: {
    TreeView,
    TreeTable,
  },
  data() {
    return {
      tree: [
        {
          id: 1,
          title: 'Компания',
          type: 'folder',
          children: [
            {
              id: 2,
              title: 'Отдел продаж',
              type: 'folder',
              children: [
                { id: 3, title: 'Менеджер 1', type: 'item', children: [] },
                { id: 4, title: 'Менеджер 2', type: 'item', children: [] },
              ],
            },
            {
              id: 5,
              title: 'IT отдел',
              type: 'folder',
              children: [
                { id: 6, title: 'Frontend', type: 'folder', children: [] },
                { id: 7, title: 'Backend', type: 'folder', children: [] },
              ],
            },
          ],
        },
      ],
    }
  },
}
</script>
