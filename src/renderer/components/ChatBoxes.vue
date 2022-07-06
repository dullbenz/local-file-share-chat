<template>
  <div class="chat-boxes">
    <div
      v-for="(message, idx) in messages"
      :key="idx"
      class="message-container"
      :class="{
        'direction-rtl': message.fromMe
      }"
    >
      <chat-box
        :message="message.message"
        :from-me="message.fromMe"
      />
    </div>
  </div>
</template>

<script>
import ChatBox from "./ChatBox.vue";
export default {
  components: { ChatBox },
  naem: "ChatBoxes",
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
.message-container {
  padding: 8px 28px 8px;
}

.chat-boxes {
  display: flex;
  flex-direction: column-reverse;
  margin-bottom: 8px;
  overflow-y: auto;
}

.direction-rtl {
  direction: rtl;
}

/* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
