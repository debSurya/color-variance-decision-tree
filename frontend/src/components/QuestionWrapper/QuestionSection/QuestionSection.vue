<script setup lang="ts">
import { IAnswerParams, IMetadata, IQuestion } from 'models/interface';
import QuestionType from './QuestionType/QuestionType.vue';
import ErrorSection from './ErrorSection/ErrorSection.vue';
import { computed, watch } from 'vue';

const props = defineProps<{
  questionObj?: IQuestion | null;
  metadataObj?: IMetadata | null;
}>();

const progressBarValue = computed(() => {
  console.log(
    ((props.metadataObj?.index || 0) / (props.metadataObj?.total || 0)) * 100
  );
  return (
    ((props.metadataObj?.index || 0) / (props.metadataObj?.total || 0)) * 100
  );
});

const emitters = defineEmits<{
  (e: 'onAnswered', aParams: IAnswerParams): void;
}>();

const onAnswered = (key: string | string[]) => {
  emitters('onAnswered', {
    qn: props.questionObj?.key || '',
    ans: Array.isArray(key) ? key : [key],
    next: !!props.questionObj?.next,
  });
};

watch;
</script>

<template>
  <section class="answers-section">
    <QuestionType
      v-if="questionObj !== null"
      :q-type="questionObj?.type"
      :q-text="questionObj?.question"
      :q-answers="questionObj?.answers"
      @emit-answer="onAnswered"
    />
    <v-progress-linear
      v-if="questionObj !== null"
      v-model="progressBarValue"
      class="progress-bar"
    ></v-progress-linear>
    <ErrorSection v-else />
  </section>
</template>

<style scoped src="./QuestionSection.styles.scss" lang="scss" />
