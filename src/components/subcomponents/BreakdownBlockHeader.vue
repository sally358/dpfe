<template>
    <div class="flex flex-col w-full shrink-0 h-12 border-b border-gray-500">
        <div class="flex h-full w-full px-4 items-center text-lg">
             {{ label }} ({{ number }} combos)
        </div>
    </div>
</template>

<script setup lang="ts">

  const props = defineProps<{
    label: string,
    number: number
  }>();


</script>
