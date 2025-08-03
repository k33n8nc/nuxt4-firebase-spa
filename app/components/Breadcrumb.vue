<template>
  <nav aria-label="breadcrumbs" class="mb-6 mt-2">
    <ul class="flex text-sm">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" :class="{ '': index === breadcrumbs.length - 1 }">
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
