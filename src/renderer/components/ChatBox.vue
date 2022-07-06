<template>
  <div 
    class="chat-box"
    :class="{
      me: fromMe,
      peer: !fromMe
    }"
  >
    <span>
      {{ message }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ChatBox",
  props: {
    message: {
      type: String,
      required: true,
    },
    fromMe: {
      type: Boolean,
      required: true
    },
  },
};
</script>

<style lang="scss">
.chat-box.me {
  border-radius: 12px 12px 0px 12px;
  background-color: #916bbf;
}

.chat-box.peer {
  border-radius: 0px 12px 12px 12px;
  background-color: #757575;
}

.chat-box {
  padding: 8px 16px 8px 14px;
  display: inline-block;
  color: white;
  max-width: 60%;
}

@media only screen and (max-width: 500px) {
  .chat-box {
    max-width: unset;
  }
}
</style>
