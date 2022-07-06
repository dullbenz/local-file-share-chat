<template>
  <div class="tabs-container">
    <tabs :options="{ useUrlFragment: false }">
      <tab name="Connect">
        <div class="tabs-item">
          <form
            action=""
            class="connection-form"
            @submit.prevent="connectServer()"
          >
            <chat-form
              v-show="!connecting"
              v-model="connectName"
              class="connection-name"
              required
              no-icon
              smaller
              placeholder="Connection Name"
            />
            <chat-form
              v-show="!connecting"
              v-model="connectIp"
              required
              class="connection-ip"
              no-icon
              smaller
              placeholder="Ip Address"
            />
            <div class="connection-name loader" v-show="connecting">
              <vue-loaders-ball-beat scale="2" color="currentColor" />
            </div>
            <button type="submit">
              {{ connecting ? "Cancel" : "Connect" }}
            </button>
            <label
              class="connect-error-label"
              v-if="connectErrorLabel !== ''"
              >{{ connectErrorLabel }}</label
            >
          </form>
        </div>
      </tab>
      <tab name="Listen">
        <div class="tabs-item">
          <form
            action=""
            class="connection-form"
            @submit.prevent="handleListen()"
          >
            <chat-form
              v-show="!listening"
              v-model="listenName"
              class="connection-name"
              required
              no-icon
              smaller
              placeholder="Connection Name"
            />
            <div class="connection-name loader" v-show="listening">
              <vue-loaders-ball-scale-multiple scale="2" color="currentColor" />
            </div>
            <button type="submit">{{ listening ? "Cancel" : "Listen" }}</button>
            <label
              class="connect-success-label"
              v-if="connectSuccessLabel !== ''"
              >{{ connectSuccessLabel }}</label
            >
          </form>
        </div>
      </tab>
    </tabs>
  </div>
</template>

<script>
import { Tabs, Tab } from "vue-tabs-component";
import { mapActions, mapState } from "vuex";
import VueLoadersBallScaleMultiple from "vue-loaders/dist/loaders/ball-scale-multiple";
import VueLoadersBallBeat from "vue-loaders/dist/loaders/ball-beat";
import ChatForm from "./ChatForm.vue";
import {
  startSocketListen,
  stopSocketListen,
  getServerState,
  startServer,
} from "../../../resources/app/src/index.js";
import * as io from "socket.io-client/dist/socket.io";
import config from "../../config";

startServer(config.socketPort);

export default {
  name: "ConnectPeer",
  components: {
    Tabs,
    Tab,
    ChatForm,
    [VueLoadersBallScaleMultiple.component.name]:
      VueLoadersBallScaleMultiple.component,
    [VueLoadersBallBeat.component.name]: VueLoadersBallBeat.component,
  },
  emits: ["add-socket"],
  data() {
    return {
      connecting: false,
      connectErrorLabel: "",
      serverState: getServerState(),
      stoppedManually: true,
      listenName: "",
      connectName: "",
      connectIp: "",
    };
  },
  computed: {
    listening() {
      return this.serverState.acceptIncoming;
    },
    connectSuccessLabel() {
      return !this.stoppedManually && !this.listening ? "Peer Connected" : "";
    },
    ...mapState({
      peerData: (state) => state.peers.peerData,
      // all(state) {
      //   console.log("all", state);
      //   return 1;
      // },
    }),
  },
  methods: {
    ...mapActions({
      addPeer: "addPeer",
      removePeer: "removePeer",
      addMessage: "addMessage"
    }),
    handleListen() {
      if (!this.listening) {
        this.stoppedManually = false;
        startSocketListen(this.listenName);
        // this.listening = true;
      } else {
        this.stoppedManually = true;
        stopSocketListen();
        // this.listening = false;
      }
      // const path = require("path");
      // const http = require("http");
      // const express = require("express");
      // const socketio = require("socket.io");
      // const Filter = require("bad-words");
      // const config = require("../../config");
      // const {
      //   generateMessage,
      //   generateLocationMessage,
      // } = require("./utils/messages");
      // const {
      //   addUser,
      //   removeUser,
      //   getUser,
      //   getUsersInRoom,
      // } = require("./utils/users");

      // const app = express();
      // const server = http.createServer(app);
      // const io = socketio(server);

      // const port = config.socketPort;
      // const publicDirectoryPath = path.join(__dirname, "../public");

      // app.use(express.static(publicDirectoryPath));

      // io.on("connection", (socket) => {
      //   console.log("New WebSocket connection");

      //   // socket.on("join", (options, callback) => {
      //   //   const { error, user } = addUser({ id: socket.id, ...options });

      //   //   if (error) {
      //   //     return callback(error);
      //   //   }

      //   //   socket.join(user.room);

      //   //   socket.emit("message", generateMessage("Admin", "Welcome!"));
      //   //   socket.broadcast
      //   //     .to(user.room)
      //   //     .emit(
      //   //       "message",
      //   //       generateMessage("Admin", `${user.username} has joined!`)
      //   //     );
      //   //   io.to(user.room).emit("roomData", {
      //   //     room: user.room,
      //   //     users: getUsersInRoom(user.room),
      //   //   });

      //   //   callback();
      //   // });

      //   // socket.on("sendMessage", (message, callback) => {
      //   //   const user = getUser(socket.id);
      //   //   const filter = new Filter();

      //   //   if (filter.isProfane(message)) {
      //   //     return callback("Profanity is not allowed!");
      //   //   }

      //   //   io.to(user.room).emit(
      //   //     "message",
      //   //     generateMessage(user.username, message)
      //   //   );
      //   //   callback();
      //   // });

      //   // socket.on("sendLocation", (coords, callback) => {
      //   //   const user = getUser(socket.id);
      //   //   io.to(user.room).emit(
      //   //     "locationMessage",
      //   //     generateLocationMessage(
      //   //       user.username,
      //   //       `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      //   //     )
      //   //   );
      //   //   callback();
      //   // });

      //   // socket.on("disconnect", () => {
      //   //   const user = removeUser(socket.id);

      //   //   if (user) {
      //   //     io.to(user.room).emit(
      //   //       "message",
      //   //       generateMessage("Admin", `${user.username} has left!`)
      //   //     );
      //   //     io.to(user.room).emit("roomData", {
      //   //       room: user.room,
      //   //       users: getUsersInRoom(user.room),
      //   //     });
      //   //   }
      //   // });
      // });

      // server.listen(port, () => {
      //   console.log(`Server is up on port ${port}!`);
      // });
    },
    connectServer() {
      console.log(this.peerData);
      var socket;
      if (!this.connecting) {
        this.connecting = true;
        socket = io(`${config.socketHost}:${config.socketPort}`, {
          transports: ["websocket"],
          reconnection: false,
        });
        socket.on("accept", () => {
          this.connectErrorLabel = "";
          this.connecting = false;
          console.log("socket connected");
          this.addPeer({
            peerId: this.connectName,
            peerIp: this.connectIp,
            socketId: socket.id,
          });
          this.$emit("add-socket", { socketId: socket.id, socket });

          socket.on("myMessage", (message, callback) => {
            // peerData[options.peerId].chats.unshift({
            //     fromMe: false,
            //     message: options.message
            // });
            const _peerId = Object.keys(this.peerData).find(
              (key) => this.peerData[key].socketId === socket.id
            );
            this.addMessage({
              peerId: _peerId,
              message: message,
              fromMe: false,
            });
          });

          socket.off("connect");
          socket.off("connect_error");
          socket.off("disconnect");
        });
        socket.on("connect_error", () => {
          console.log("connection error");
          this.connectErrorLabel = "Couldn't connect";
          this.connecting = false;

          socket.off("connect");
          socket.off("connect_error");
          socket.off("disconnect");
          socket.off("deny");
          socket.off("accept");
        });

        socket.on("disconnect", () => {
          console.log("connection disconnected");
          this.connectErrorLabel = "Couldn't connect";
          this.connecting = false;

          socket.off("connect");
          socket.off("connect_error");
          socket.off("disconnect");
          socket.off("deny");
          socket.off("accept");
        });

        socket.on("deny", () => {
          console.log("connection denied");
          this.connectErrorLabel = "Couldn't connect";
          this.connecting = false;

          socket.off("connect");
          socket.off("connect_error");
          socket.off("disconnect");
          socket.off("deny");
          socket.off("accept");

          socket.disconnect();
        });
        console.log("socket probably connected");
      } else {
        this.connecting = false;
        if (typeof socket.disconnect === "function") {
          socket.disconnect();
        }
        socket = undefined;
      }
    },
  },
};
</script>

<style src="vue-loaders/dist/vue-loaders.css"></style>

<style>
.tabs-container {
  margin: auto;
  display: flex;
  align-items: center;
  height: 100%;
}

.tabs-component {
  width: 60%;
  min-width: 400px;
  margin: 4em 0;
}

.tabs-component-tabs {
  background-color: #11101d;
  /* border: solid 1px #ddd; */
  border-radius: 6px;
  /* margin-bottom: 5px; */
  display: flex;
}

.tabs-component-tabs > * {
  flex: 1;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    /* border: 0; */
    align-items: stretch;
    display: flex;
    justify-content: flex-start;
    margin-bottom: -1px;
  }
}

.tabs-component-tab {
  color: white;
  font-size: 14px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
  position: relative;
  transition: all 0.3s ease;
}

.tabs-component-tab * {
  transition: all 0.3s ease;
}

/* .tabs-component-tab:not(:last-child) {
  border-bottom: dotted 1px #ddd;
} */

.tabs-component-tab:hover {
  color: #61045c;
}

.tabs-component-tab.is-active {
  color: #61045c;
  font-weight: 800;
  border-color: #61045c;
  border-style: solid;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  border-width: 2px 2px 0px 2px;
}

.tabs-component-tab.is-active::after {
  content: "";
  height: 2px;
  width: 80%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  background-color: #61045c;
  z-index: 999;
}

.tabs-component-tab:not(.is-active) {
  border-bottom: 2px solid #61045c;
}

.tabs-component-tab.is-disabled * {
  color: #cdcdcd;
  cursor: not-allowed !important;
}

/* @media (min-width: 700px) {
  .tabs-component-tab {
    border: solid 1px #ddd;
    border-radius: 3px 3px 0 0;
    transform: translateY(2px);
    transition: transform 0.3s ease;
  }

  .tabs-component-tab.is-active {
    border-bottom: solid 1px #fff;
    z-index: 2;
    transform: translateY(0);
  }
} */

.tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: 0.75em 1em;
  text-decoration: none;
  justify-content: center;
  text-align: center;
}

.tabs-component-panels {
  padding: 0;
  background-color: #11101d;
  border-color: #61045c;
  border-style: solid;
  /* height: 250px; */
  border-width: 0px 2px 2px;
  border-radius: 0 0 6px 6px;
  /* box-shadow: 3px 0px 4px 4px #11101d; */
}

.tabs-container input {
  font-size: 15px;
  color: var(--serach-input-text-color);
  font-weight: 400;
  outline: none;
  height: 50px;
  width: 100%;
  width: 50px;
  border: none;
  border-radius: 12px;
  transition: all 0.5s ease;
  background: var(--secondary-color);
  padding: 0 20px 0 50px;
  width: 100%;
}

.tabs-container .tabs-item {
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tabs-container .connection-name,
.connection-ip {
  margin-bottom: 16px;
}

.tabs-container .connection-form {
  width: 80%;
}

.tabs-container button {
  background-color: #61045c;
  color: white;
  outline: none;
  border: none;
  border-radius: 40px;
  padding: 16px;
  min-width: 200px;
  display: block;
  margin: auto;
  cursor: pointer;
}

.tabs-container .loader {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #61045c;
}

.tabs-container .connect-error-label,
.tabs-container .connect-success-label {
  font-size: small;
  color: red;
  margin: auto;
  width: max-content;
  display: block;
}

.tabs-container .connect-success-label {
  color: green;
}
</style>
