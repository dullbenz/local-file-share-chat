<template>
  <div id="app">
    <Sidebar
      menu-title="FUASHI"
      :active-element="peerId"
      menu-logo=""
      :menu-items="menuItems"
      profile-img=""
      profile-name=""
      profile-role=""
      :is-exit-button="false"
      icons-color="#61045c"
      menu-items-hover-color="#61045c"
      @connect="
        () => {
          log();
          connect = true;
          peerId = '';
        }
      "
      @load-chat="
        (_peerId) => {
          connect = false;
          peerId = _peerId;
        }
      "
    />
    <div id="wrapper">
      <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue" /> -->
      <main v-show="!connect">
        <chat-boxes class="chat-boxes-main" :messages="chatData" />
        <chat-form
          required
          class="messenger"
          v-model="message"
          @submit-message="sendMessage"
        />
      </main>
      <main v-show="connect">
        <connect-peer @add-socket="(data) => socketMap.set(data.socketId, data.socket)"/>
      </main>
    </div>
  </div>
</template>

<script>
// import SystemInformation from '@/components/LandingPage/SystemInformation'
import Sidebar from "./components/Sidebar.vue";
import ChatForm from "./components/ChatForm.vue";
import ChatBoxes from "./components/ChatBoxes.vue";
import ConnectPeer from "./components/ConnectPeer.vue";
import { mapActions, mapState } from "vuex";

import { setVueFuncs, setVueData } from "../../resources/app/src/index";

export default {
  name: "LocalCommunicationApp",
  components: { Sidebar, ChatBoxes, ChatForm, ConnectPeer },
  data() {
    return {
      connect: true,
      // menuItems: {},
      peerId: "",
      message: "",
      socketMap: new Map()
    };
  },
  computed: {
    ...mapState({
      peerData: (state) => state.peers.peerData,
    }),
    menuItems() {
      return [
        {
          link: "#",
          name: "Connect",
          tooltip: "connect",
          icon: "bxs-message-square-add",
          emit: "connect",
          type: "connect",
        },
        ...Object.values(this.peerData).map((peer) => {
          return {
            link: "#",
            name: `${peer.name}:${peer.ip}`,
            tooltip: peer.name,
            peerId: peer.name,
            icon: "bxs-circle",
            emit: "load-chat",
          };
        }),
      ];
    },
    chatData() {
      if (this.peerData[this.peerId]) {
        return this.peerData[this.peerId].chats || [];
      }
      return [];
    },
  },
  // watch: {
  //   listenPeerData: {
  //     handler() {
  //       console.log('in  watcher')
  //       // this.menuItems = [
  //       //   {
  //       //     link: '#',
  //       //     name: 'Connect',
  //       //     tooltip: 'connect',
  //       //     icon: 'bxs-message-square-add',
  //       //     emit: 'connect'
  //       //   },
  //       //   ...Object.values(this.peerData).map(
  //       //     peer => {
  //       //       console.log(this.peerData)
  //       //       return {
  //       //         link: '#',
  //       //         name: `${peer.name}:${peer.ip}`,
  //       //         tooltip: peer.name,
  //       //         icon: 'bxs-message-square-add',
  //       //         emit: 'load-chat'
  //       //       };
  //       //     }
  //       //   ),
  //       // ]

  //       Object.values(this.listenPeerData).forEach(
  //         peer => this.addPeer({
  //           peerId: peer.name,
  //           peerIp: peer.ip
  //         })
  //       );
  //     },
  //     deep: true,
  //     immediate: true
  //   },
  // },
  methods: {
    log(...data) {
      console.log(this.listenPeerData);
      console.log(...data);
    },
    sendMessage() {
      this.addMessage({
        peerId: this.peerId,
        message: this.message,
        fromMe: true,
      });
      if(this.peerData[this.peerId]) {
        // console.log(this.peerData[this.peerId])
        // console.log(this.socketMap);
        const socket = this.socketMap.get(this.peerData[this.peerId].socketId)
        socket.emit("myMessage", this.message, (error) => {
          if (error) {
            return console.log(error);
          }
  
          console.log("Message delivered!");
        });
      }
      this.message = "";
    },
    ...mapActions({
      addMessage: "addMessage",
      addPeer: "addPeer",
    }),
    open(link) {
      this.$electron.shell.openExternal(link);
    },
  },
  mounted() {
    setVueFuncs({
      addMessage: this.addMessage,
      addPeer: this.addPeer,
    });
    setVueData({
      socketMap: this.socketMap,
      peerData: this.peerData
    });
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(16, 15, 43, 1) 40%,
    rgba(10, 9, 31, 0.9) 100%
  );
  height: 100vh;
  padding: 0px 0px 8px;
  width: 100%;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  /* background-color: red;
  margin-top: 10px; */
}

main > * {
  flex: 1;
}

main > .messenger {
  flex: unset;
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
}

main > .chat-boxes-main {
  flex: 1;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}
</style>
