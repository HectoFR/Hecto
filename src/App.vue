<template>
  <div id="app_content">
    <LoginForm v-if="!logged" />
    <div
      v-else
      id="container"
    >
      <HeaderBar />
      <main>
        <router-view />
      </main>
      <footer>
        Developped by
        <a 
          href="https://github.com/HectoFR"
          target="_blank"
        >HectoFR</a>
        - This project has nothing to do with the actual
        <a
          href="https://www.yazio.com/en"
          target="_blank"
        >YAZIO</a>
        app.
      </footer>
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";
import HeaderBar from "@/components/HeaderBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    LoginForm,
    HeaderBar,
  },
  data() {
    return {
      logged: false,
    }
  },
  computed: {
    ...mapGetters(["token"])
  },
  watch: {
    token: {
      handler() {
        if (this.token) {
          this.$store.dispatch("getUser").then(() => {
            this.logged = true;
          })
        }else {
          this.logged = false;
        }
      },
      immediate: true,
    }
  },
  methods: {
  }
};
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

* {
  box-sizing: border-box;
}

body {
  background: var.$background;
  color: var.$font-color;
  margin: 0;
  font-family: Roboto;
}

main {
  padding: 1rem;
}

header {
  border-bottom: 1px solid var.$light-grey;
}

h2 {
  text-align: center;
}

footer {
  text-align: center;
}
</style>
