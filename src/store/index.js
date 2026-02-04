import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// генератор id (чтобы не ломать руками)
let NEXT_ID = 100

export default new Vuex.Store({
  state: {
    items: []
  },

  mutations: {
    SET_ITEMS(state, items) {
      state.items = items
    },

    UPDATE_ITEM(state, updated) {
      const updateRecursive = (list) => {
        for (let i of list) {
          if (i.id === updated.id) {
            Object.assign(i, updated)
            return true
          }
          if (i.children && updateRecursive(i.children)) return true
        }
        return false
      }

      updateRecursive(state.items)
    },

    ADD_ROOT_ITEM(state, payload) {
      const newItem = {
        id: NEXT_ID++,
        name: payload.name || 'Новый элемент',
        active: payload.active ?? true,
        children: []
      }

      state.items.push(newItem)
    },

    ADD_CHILD_ITEM(state, payload) {
      const parentId = payload.parentId

      const addToParent = (list) => {
        for (const node of list) {
          if (node.id === parentId) {
            if (!Array.isArray(node.children)) Vue.set(node, 'children', [])

            node.children.push({
              id: NEXT_ID++,
              name: payload.name || 'Новый дочерний',
              active: payload.active ?? true,
              children: []
            })
            return true
          }
          if (node.children && addToParent(node.children)) return true
        }
        return false
      }

      addToParent(state.items)
    },

    DELETE_ITEM(state, id) {
      const removeRecursive = (list) => {
        const idx = list.findIndex(x => x.id === id)
        if (idx !== -1) {
          list.splice(idx, 1)
          return true
        }

        for (const node of list) {
          if (node.children && removeRecursive(node.children)) return true
        }
        return false
      }

      removeRecursive(state.items)
    }
  },

  actions: {
    loadItems({ commit }) {
      const data = [
        {
          id: 1,
          name: 'Компания',
          active: true,
          children: [
            {
              id: 2,
              name: 'Отдел разработки',
              active: true,
              children: [
                { id: 3, name: 'Иван', active: true },
                { id: 4, name: 'Анна', active: false }
              ]
            },
            {
              id: 5,
              name: 'Отдел дизайна',
              active: false,
              children: [
                { id: 6, name: 'Ольга', active: true }
              ]
            }
          ]
        }
      ]

      commit('SET_ITEMS', data)
    }
  },

  getters: {
    items: state => state.items
  }
})
