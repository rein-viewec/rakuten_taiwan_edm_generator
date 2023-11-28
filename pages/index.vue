<script setup lang="ts">
const router = useRouter()
onMounted(() => {
  router.push('/generator/edm')
})
</script>

<template>
  <v-container fluid>
    <v-card class="pa-6">
      <v-row align="center" class="pt-6">
        <v-col cols="12">
          <div class="headline">
            Welcome Rakuten Taiwan Widget Pack
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<style scoped lang="sass">
.min__height
  min-height: 24px
.delete__todo
  opacity: 0
  pointer-events: none
.v-list-item:hover
  .delete__todo
    opacity: 1
    pointer-events: auto
</style>
