<script setup lang="ts">
import { ISuggestion } from 'models/interface';

defineProps<{
  suggestionObj?: ISuggestion | null;
}>();
</script>

<template>
  <section
    class="suggestion-section d-flex flex-column align-center justify-center"
  >
    <div class="suggestion-text">The suggested products are as follows:</div>
    <div class="suggestion-value d-flex flex-column">
      <span v-for="(s, i) in suggestionObj?.suggestions" :key="i">{{ s }}</span>
    </div>
  </section>
</template>

<style scoped src="./SuggestionSection.styles.scss" lang="scss" />
