<template>
    <div id="login">
        <img :src="require('@/assets/logo.png')" />
        <form @submit.prevent="login">
            <h2>Connexion</h2>
            <div class="form-content">
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        v-model="email"
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        v-model="password"
                    />
                </div>
                <div>
                    <button type="submit">Connexion</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: "LoginForm",
    components: {
    },
    data() {
        return {
            email: "",
            password: "",
        }
    },
    methods: {
        login() {
            return this.$store.dispatch("login", {
                username: this.email,
                password: this.password
            }).then(() => {
                this.$emit("logged")
            })
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@/assets/variables.scss" as var;

#login {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
        margin-bottom: 2rem;
    }
    form {
        background: var.$medium-grey;
        padding: 3rem;
        border-radius: 0.5rem;
    }
    h2 {
        margin-top: 0;
        margin-bottom: 2rem;
    }
    .form-content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    label {
        display: block;
        text-align: center;
        font-weight: bold;
    }
    input {
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid black;
        margin: 1rem 0;
    }
    button {
        border-radius: 0.5rem;
        padding: 0.5rem 1.5rem;
        border: 1px solid black;
        cursor: pointer;
        &:hover {
            background: rgba(#01a9f4, 50%);
        }
    }
}

</style>