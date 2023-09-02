<script>
  import { inject, ref } from 'vue';
  export default {
    data() {
      return {
        scrollInvoked: 0,
      };
    },
    setup() {
      const chatList = inject('chatList');
      return { chatList };
    },
    methods: {
      onScroll() {
        this.scrollInvoked++;
      },
    },
  };
</script>


<template>
    <v-card
      v-scroll.self="onScroll"
      class="overflow-y-auto"
      max-height="400"
    >

    <v-banner
      class="justify-center text-h5 font-weight-light"
      sticky
    >
      Chat logs
    </v-banner>
  
    <div class="mt-5" v-if="chatList.length !== 0">
        <v-list lines="one">
          <v-list-item
            v-for="(chat, i) in chatList"
            :key="i"
          >{{ chat }}</v-list-item>
        </v-list>
    </div>

    </v-card>
</template>
  