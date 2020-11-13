<template>
  <span>
    <b-row
      v-for="man of items"
      :key="man.id"
      class="mt-3"
    >
      <b-col sm="3">
        <b-avatar
          size="21px"
          :src="man.photo"
          class="mr-1"
        />

        {{ man.firstName }}
        {{ man.lastName }}
      </b-col>

      <b-col sm="3">
        <template v-if="man.grant === 'OWNER'">
          Владелец
        </template>
        <template v-else-if="man.grant === 'ADMIN'">
          Администратор
        </template>
      </b-col>

      <b-col sm="3">
        <template v-if="meOwner && man.id !== $store.state.user.self.id">
          <b-link v-on="{ click: moveOwner(man.id) }">
            Сделать владельцем
          </b-link>
        </template>
      </b-col>

      <b-col sm="3">
        <template v-if="meOwner && man.id !== $store.state.user.self.id">
          <b-link
            class="text-danger"
            v-on="{ click: removeAdmin(man.id) }"
          >
            Разжаловать
          </b-link>
        </template>
      </b-col>
    </b-row>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import apiAddr from '~/helpers/const/apiAddr'
import grant from '~/helpers/role/grant'

export default Vue.extend({
  props: {
    companyId: {
      type: String,
      default () {
        return ''
      }
    },
    items: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    meOwner () {
      let myGrant = ''
      for (const man of this.items) {
        if (man.id === this.$store.state.user.self.id) {
          myGrant = man.grant
          break
        }
      }

      return myGrant === grant.owner
    }
  },
  methods: {
    moveOwner (userId: string) {
      return async () => {
        const raw = await fetch([
          apiAddr,
          '/v1/role/setCompanyOwner'
        ].join(''), {
          method: 'POST',
          headers: new Headers({
            Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
          }),
          body: JSON.stringify({
            companyId: this.companyId,
            userId
          })
        })

        if (!raw.ok) {
          return this.$nuxt.error({
            statusCode: 500
          })
        }

        this.$emit('managerEdit')
      }
    },
    removeAdmin (userId: string) {
      return async () => {
        const q = new URLSearchParams()
        q.append('companyId', this.companyId)
        q.append('userId', userId)

        const raw = await fetch([
          apiAddr,
          '/v1/role/removeCompanyAdmin?',
          q.toString()
        ].join(''), {
          method: 'DELETE',
          headers: new Headers({
            Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
          })
        }).catch()

        if (!raw.ok) {
          return this.$nuxt.error({
            statusCode: 500
          })
        }

        this.$emit('managerEdit')
      }
    }
  }
})
</script>
