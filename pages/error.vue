<template>
  <v-row class="text-center">
    <v-col cols="12" class="mt-12">
      <v-icon class="title-4 blue-grey--text text--lighten-3">
        mdi-comment-alert-outline
      </v-icon>
    </v-col>
    <v-col cols="12" class="py-0">
      <div class="headline font-weight-bold blue-grey--text text--darken-1">
        <!-- ERROR {{ statusCode }} -->
      </div>
    </v-col>
    <v-col cols="12" class="pt-0">
      <div class="title blue-grey--text text--lighten-1">
        <!-- {{ message }} -->
      </div>
    </v-col>
    <v-col cols="12" class="py-4">
      <nuxt-link to="/">Return to homepage</nuxt-link>
    </v-col>
  </v-row>
</template>

<script setup>
// const data = {
//   error: {},
// }
</script>
