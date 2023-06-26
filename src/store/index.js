import { createStore } from 'vuex'
import dayjs from "dayjs";

const CLIENT_ID = "1_4hiybetvfksgw40o0sog4s884kwc840wwso8go4k8c04goo4c"; // found on other githubs
const CLIENT_SECRET = "6rok2m65xuskgkgogw40wkkk8sw0osg84s8cggsc4woos4s8o"; // found on other githubs
const BASE_URL = (process.env.VUE_APP_PROXY_URL || "") + "https://yzapi.yazio.com/v13";

export default createStore({
  state: {
    token: localStorage.getItem("YAZIO_TOKEN") || null,
    user: null,
    currentDate: dayjs().format("YYYY-MM-DD"),
  },
  getters: {
    token(state) {
      return state.token;
    },
    user(state) {
      return state.user;
    },
    currentDate(state) {
      return state.currentDate;
    },
  },
  mutations: {
    setToken(state, token) {
      if (!token) {
        localStorage.removeItem("YAZIO_TOKEN");
      } else {
        localStorage.setItem("YAZIO_TOKEN", token);
      }

      state.token = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    setCurrentDate(state, date) {
      state.currentDate = date;
    }
  },
  actions: {
    login(store, { username, password }) {
      return fetch(`${BASE_URL}/oauth/token`, {
        method: "POST",
        body: JSON.stringify({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            username,
            password,
            grant_type: "password",
        })
      })
        .then((res) => res.json())
        .then((res) => {
          store.commit("setToken", res.access_token)
          return res.access_token;
        });
    },
    request(store, { url, method="GET", body }) {
      return fetch(`${BASE_URL}${url}`, {
          method,
          body,
          headers: {
              Authorization: `Bearer ${store.state.token}`
          }
      })
      .then((res) => {
          if (res.status >= 200 && res.status <= 299) {
              return res.json()
          } else {
              throw res
          }
      })
    },
    goals(store) {
      return store.dispatch("request", {
        url: `/user/goals/?date=${store.getters.currentDate}`
      })
    },
    product(store, id) {
      return store.dispatch("request", {
        url: `/products/${id}`,
      })
    },
    consumedItems(store) {
        return store.dispatch("request", {
          url: `/user/consumed-items?date=${store.getters.currentDate}`
        })
    },
    consumedItemsWithProductInfos(store) {
      return store.dispatch("consumedItems")
      .then((res) => {
          const promises = res.products.map((item) => {
              return store.dispatch("product", item.product_id).then((res) => {
                  item.product = res
              })
          })

          return Promise.all(promises).then(() => {
            res.products.forEach((product) => {
              product.nutrient = {
                energy: Math.round(product.product.nutrients["energy.energy"] * product.amount, 2),
                protein: Math.round(product.product.nutrients["nutrient.protein"] * product.amount, 2),
                carb: Math.round(product.product.nutrients["nutrient.carb"] * product.amount, 2),
                fat: Math.round(product.product.nutrients["nutrient.fat"] * product.amount, 2),
              }
            })

            return res.products
          })
      })
    },
    exercises(store) {
      return store.dispatch("request", {
        url: `/user/exercises?date=${store.getters.currentDate}`
      })
    },
    getUser(store) {
      return store.dispatch("request", {
        url: `/user`
      }).then((user) => {
        store.commit("setUser", user);
      })
    },
  },
  modules: {
  }
})
