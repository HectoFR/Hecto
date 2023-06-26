<template>
    <header>
        <nav>
            <img :src="require('@/assets/logo.png')" />
            <div v-if="user">
                {{ user.firstname || user.lastname ? `${user.firstname} ${user.lastname}` : user.email }}
            </div>
            <ul>
                <li v-if="false">
                    <router-link :to="{ name: 'home', }">
                        Accueil
                    </router-link>
                </li>
                <li v-if="false">Repas</li>
                <li v-if="false">Exercices</li>
                <li @click="logout">
                    Déconnexion
                </li>
            </ul>
        </nav>
    </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "HeaderBar",
    methods: {
        logout() {
            this.$store.commit("setToken", null);
        }
    },
    computed: {
        ...mapGetters(["user"])
    }
};
</script>

<style lang="scss" scoped>
header {
    padding: 1rem 20%;
    nav {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        a, a:visited {
            color: black;
            text-decoration: none;
        }
        img {
            width: 10rem;
        }
        ul {
            display: flex;
            list-style: none;
            gap: 1.5rem;
            margin: 0;

            li {
                cursor: pointer;
                border-bottom: 2px solid transparent;
                padding: 0.25rem;
                
                &:hover {
                    border-color: black;
                }
            }
        }
    }
}
</style>