<script setup lang="ts">
import { useLazyQuery, useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { computed, ref, watch } from 'vue';
import {
  IAnswerParams,
  IQuestion,
  ISuggestion,
  IMetadata,
} from '../../models/interface';
import QuestionsSection from './QuestionSection/QuestionSection.vue';
import SuggestionSection from '../SuggestionSection/SuggestionSection.vue';

const GET_QUESTIONNAIRE_METADATA = gql`
  query Query {
    getQuestionnaireMetadata {
      total
    }
  }
`;

const GET_QUESTION_QUERY = gql`
  query Query($qn: String, $ans: [String]) {
    getQuestion(qn: $qn, ans: $ans) {
      key
      type
      question
      answers {
        key
        val
      }
      next
    }
  }
`;
const GET_SUGGESTION_QUERY = gql`
  query Query {
    getSuggestion {
      suggestions
    }
  }
`;

const qParams = ref<IAnswerParams>();
const onQEnd = ref<boolean>(false);
const questionIndex = ref(1);

const { result: metadataResult, loading: metadataLoading } = useQuery<{
  getQuestionnaireMetadata: IMetadata;
}>(GET_QUESTIONNAIRE_METADATA);
const {
  result: questionsResult,
  loading: questionLoading,
  refetch: refetchQuestions,
} = useQuery<{ getQuestion: IQuestion }>(GET_QUESTION_QUERY, {
  qn: qParams?.value?.qn,
  ans: qParams?.value?.ans,
});
const {
  result: suggestion,
  loading: suggestionLoading,
  load: loadSuggestionAPI,
} = useLazyQuery<{
  getSuggestion: ISuggestion;
}>(GET_SUGGESTION_QUERY);

const metadataObj = computed(() => ({
  ...metadataResult.value?.getQuestionnaireMetadata,
  index: questionIndex.value,
}));
const questionObj = computed(() => questionsResult.value?.getQuestion);
const suggestionObj = computed(() => suggestion.value?.getSuggestion);
const mLoading = computed(() => metadataLoading.value);
const qLoading = computed(() => questionLoading.value);
const sLoading = computed(() => suggestionLoading.value);

watch(qParams, () => {
  if (qParams.value?.next) {
    refetchQuestions(qParams.value);
    questionIndex.value++;
  } else {
    refetchQuestions(qParams.value);
    loadSuggestionAPI();
    onQEnd.value = true;
  }
});

const onClickAction = (aObj: IAnswerParams) => {
  qParams.value = aObj;
};
</script>

<template>
  <section
    v-if="!onQEnd"
    class="activity-wrapper d-flex align-center justify-center"
  >
    <div v-if="mLoading || qLoading">...Loading</div>
    <main v-else class="questionnaire-wrapper">
      <QuestionsSection
        :question-obj="questionObj"
        :metadata-obj="metadataObj"
        @on-answered="onClickAction"
      />
    </main>
  </section>
  <section v-else class="activity-wrapper d-flex align-center justify-center">
    <div v-if="sLoading">...Loading</div>
    <main v-else class="suggestion-wrapper">
      <SuggestionSection :suggestion-obj="suggestionObj" />
    </main>
  </section>
</template>

<style scoped src="./QuestionWrapper.styles.scss" lang="scss" />
