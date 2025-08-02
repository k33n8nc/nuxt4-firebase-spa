<template>
  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul class="flex bg-gray-50 px-4 py-2 my-6 rounded-md text-sm text-gray-400">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" :class="{ 'text-gray-400': index === breadcrumbs.length - 1 }">
        <NuxtLink :to="crumb.to" :class="{ 'underline': index < breadcrumbs.length - 1 }">
          {{ crumb.text }}
        </NuxtLink>
        <span v-if="index < breadcrumbs.length - 1" class="mx-2">&#8674;</span>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

const { breadcrumbs } = useBreadcrumbs()
</script>
