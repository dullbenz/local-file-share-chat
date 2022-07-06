import Vue from "vue";

const state = {
    peerData: {}
};

const mutations = {
    ADD_PEER(state, { peerId, peerIp, socketId } = {}) {
        if (peerId) {
            Vue.set(
                state.peerData,
                peerId,
                {
                    ip: peerIp,
                    name: peerId,
                    socketId,
                    chats: []
                }
            )
        }
    },
    REMOVE_PEER(state, peerId) {
        // delete state[peerId];
        Vue.delete(state.peerData, peerId)
    },
    ADD_MESSAGE(state, { peerId, message, fromMe } = {}) {
        if (state.peerData[peerId]) {
            // Vue.set(state.peerData[peerId].chats, state.peerData[peerId].chats.length, {
            //     fromMe,
            //     message
            // })
            state.peerData[peerId].chats.unshift({
                fromMe,
                message
            });
        }
    },
    CLEAR_PEERS(state) {
        Object.assign(state.peerData, {});
    }
}

const actions = {
    addPeer({ commit }, peer) {
        // do something async
        commit('ADD_PEER', peer)
    },
    removePeer({ commit }, peerId) {
        // do something async
        commit('REMOVE_PEER', peerId)
    },
    clearPeers({ commit }) {
        commit('CLEAR_PEERS');
    },
    addMessage({ commit }, data) {
        commit('ADD_MESSAGE', data);
    }
}

export default {
    state,
    mutations,
    actions
}
