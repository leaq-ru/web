<template>
  <div>
    <p class="text-muted">
      Пользовались услугами этой компании?
    </p>

    <b-form @submit="create">
      <b-form-group class="mt-3">
        <b-form-radio-group
          v-model="form.positive"
          :options="options"
        />
      </b-form-group>

      <b-form-group>
        <b-form-textarea
          id="form-text"
          v-model="form.text"
          :state="valid"
          placeholder="Напишите подробнее, так вы поможете другим пользователям сделать выбор"
          rows="5"
        />
        <b-form-invalid-feedback
          :state="valid"
        >
          {{ form.text.length }}/3000 символов
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button
        :disabled="createDisable || valid === false"
        type="submit"
        variant="primary"
      >
        <b-icon-hand-thumbs-up v-if="positiveComputed"/>
        <b-icon-hand-thumbs-down v-else/>

        Отправить
      </b-button>

      <b-alert
        :show="createErr"
        class="mt-3"
        dismissible
        variant="danger"
      >
        Произошла ошибка. Попробуйте позднее
      </b-alert>

      <b-modal
        v-model="createOk"
        ok-only
        ok-title="Понятно"
        title="Отправлено"
      >
        <p class="my-4">
          Спасибо! Отзыв будет опубликован после антиспам проверки
        </p>
      </b-modal>
    </b-form>

    <b-row class="mt-3"/>

    <b-card
      v-for="r in reviews"
      :key="r.id"
      class="mt-3 overflow-hidden"
      no-body
    >
      <b-card-header>
        <b-row align-v="center">
          <b-col cols="6">
            <b-avatar
              :src="r.user.photo"
              class="mr-2"
            />

            {{ r.user.firstName }} {{ r.user.lastName }}
          </b-col>
          <b-col class="text-right" cols="6">
            <template :v-if="isMe(r.user.id)">
              <b-button
                v-if="delSureComputed"
                variant="light"
                @click="delSureFalse"
              >
                Отменить
              </b-button>
              <b-button
                v-if="delSureComputed"
                variant="danger"
                @click="del(r.id)"
              >
                Удалить отзыв
              </b-button>
              <b-button
                v-else
                variant="light"
                @click="delSureTrue"
              >
                <b-icon-x/>
              </b-button>
            </template>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-body>
        <b-card-text>
          <b-badge
            v-if="r.positive"
            variant="success"
          >
            Рекомендует
          </b-badge>
          <b-badge
            v-else
            variant="danger"
          >
            Не рекомендует
          </b-badge>

          <b-row class="mt-1"/>
          <p
            v-if="!r.text"
            class="text-muted"
          >
            —
          </p>
          <TextSpoiler
            v-else
            :text="r.text"
          />
        </b-card-text>
      </b-card-body>

      <b-card-footer
        class="text-right"
        footer-bg-variant="white"
      >
        <span class="text-muted">
          {{ unifyDate(r.createdAt).toLocaleDateString() }}
        </span>
      </b-card-footer>
    </b-card>

    <b-button
      v-if="reviews.length >= 6 && !reviewsScrollDone && reviewsLoaded"
      class="mt-3"
      variant="primary"
      @click="getReviews"
    >
      <b-icon-arrow-clockwise
        v-if="reviewsLoading"
        animation="spin"
      />
      <b-icon-arrow-down v-else/>
      Показать еще
    </b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import apiAddr from '~/helpers/const/apiAddr'
import unifyDate from '~/helpers/unifyDate'

export default Vue.extend({
  props: {
    reviews: {
      type: Array,
      default() {
        return []
      }
    },
    companyId: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      form: {
        text: '',
        positive: true
      },
      options: [{
        text: 'Рекомендую',
        value: true
      }, {
        text: 'Не рекомендую',
        value: false
      }],
      createDisable: false,
      createErr: false,
      createOk: false,
      delDisable: false,
      delSure: false,
      reviewsLoading: false,
      reviewsLoaded: true,
      reviewsScrollDone: false
    }
  },
  computed: {
    valid() {
      return this.form.text.length <= 3000 ? null : false
    },
    delSureComputed() {
      return this.delSure
    },
    positiveComputed() {
      return this.form.positive
    },
    reviewsSkip(): number | undefined {
      return this.reviews?.length
    }
  },
  methods: {
    unifyDate,
    async create(e) {
      e.preventDefault()

      this.createDisable = true
      const raw = await fetch([
        apiAddr,
        '/v1/review/create'
      ].join(''), {
        method: 'POST',
        body: JSON.stringify({
          companyId: this.companyId,
          text: this.form.text,
          positive: this.form.positive
        }),
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        })
      })
      this.createDisable = false
      if (!raw.ok) {
        this.err = true
        return
      }

      this.createErr = false
      this.createOk = true
      this.resetForm()
    },
    async del(reviewId: string) {
      this.delDisable = true
      const raw = await fetch([
        apiAddr,
        '/v1/review/delete?',
        new URLSearchParams({
          reviewId
        }).toString()
      ].join(''), {
        method: 'DELETE',
        headers: new Headers({
          Authorization: `Bearer ${this.$store.state?.user?.self?.token}`
        })
      })
      this.delDisable = false

      if (raw.ok) {
        this.reviews = this.reviews.filter(({id}) => id !== reviewId)
      }
    },
    delSureTrue() {
      this.delSure = true
    },
    delSureFalse() {
      this.delSure = false
    },
    isMe(userId: string): boolean {
      return this.$store.state?.user?.self?.id === userId
    },
    resetForm() {
      this.form.text = ''
      this.form.positive = true
    },
    async getReviews(): Promise<void> {
      const limit = 20

      const query = new URLSearchParams()
      query.append('companyId', this.companyId)
      query.append('opts.limit', limit.toString())
      if (this.reviewsSkip) {
        query.append('opts.skip', this.reviewsSkip)
      }

      this.reviewsLoading = true
      const raw = await fetch([
        apiAddr,
        '/v1/review/get?',
        query.toString()
      ].join(''))
      const res = await raw.json()
      this.reviewsLoading = false

      this.reviewsLoaded = false
      this.reviews.push(...res.reviews)
      setTimeout(() => {
        this.reviewsLoaded = true
      }, 0)
      if (res?.reviews?.length < limit) {
        this.reviewsScrollDone = true
      }
    }
  }
})
</script>
