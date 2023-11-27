<script setup lang="ts">
import { ref } from 'vue';
import { constants } from '../../../../models/constants';

defineProps<{
  qType?: string;
  qText?: string;
  qAnswers?: { key: string; val: string }[];
}>();

const emitters = defineEmits<{
  (e: 'emitAnswer', keys: string | string[]): void;
}>();

const { BTN_SELECT, CHECK_SELECT, RADIO_SELECT } = constants.qType;
const checkedOptions = ref<string[]>([]);
const selectedOption = ref<string>('');

const onClickAction = (keys: string | string[]) => {
  emitters('emitAnswer', keys);
};
//TODO: theme addition-----------------------------------------------
</script>

<template>
  <div class="interactive-container d-flex flex-column align-baseline">
    <div class="q-text d-flex align-center justify-center">
      <span>{{ qText }}</span>
    </div>
    <section
      v-if="qType === BTN_SELECT"
      class="interactive-btn-select d-flex justify-center align-baseline"
    >
      <div class="q-answers d-flex justify-center align-baseline">
        <v-btn
          v-for="a in qAnswers"
          :key="a.key"
          :variant="'tonal'"
          class="ans-btn"
          block
          rounded="lg"
          elevation="20"
          @click="() => onClickAction(a.key)"
          >{{ a.val }}</v-btn
        >
      </div>
    </section>
    <section
      v-else-if="qType === CHECK_SELECT"
      class="interactive-checkbox-select d-flex flex-column"
    >
      <div class="q-answers align-self-baseline">
        <v-checkbox-btn
          v-for="a in qAnswers"
          :key="a.key"
          v-model="checkedOptions"
          color="white"
          :label="a.val"
          :value="a.key"
        ></v-checkbox-btn>
      </div>
      <v-btn
        class="submit-answers align-self-center"
        :variant="'outlined'"
        rounded="lg"
        elevation="20"
        @click="() => onClickAction(checkedOptions)"
        >Submit</v-btn
      >
    </section>
    <section
      v-else-if="qType === RADIO_SELECT"
      class="interactive-radio-select d-flex flex-column"
    >
      <div class="q-answers align-self-baseline">
        <v-radio-group v-model="selectedOption">
          <v-radio
            v-for="a in qAnswers"
            :key="a.key"
            v-model="selectedOption"
            :label="a.val"
            :value="a.key"
          ></v-radio>
        </v-radio-group>
      </div>
      <v-btn
        class="submit-answer align-self-center"
        :variant="'outlined'"
        @click="() => onClickAction(selectedOption)"
        >Submit</v-btn
      >
    </section>
  </div>
</template>

<style src="./QuestionType.styles.scss" lang="scss" />
