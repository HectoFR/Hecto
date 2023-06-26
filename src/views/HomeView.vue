<template>
  <div id="home">
    <div>
      <input
        id="current_date"
        type="date"
        v-model="currentDate"
      />
    </div>
    <h2>Objectifs</h2>
    <div class="content">
      <div
        v-for="goal in goalsWithExercises"
        :key="goal[0]"
        :class="goal[0]"
      >
        <strong>{{ goalsLabels[goal[0]] }} ({{ units[goal[0]] }})</strong>
        <p>
          {{ totalNutrients[goal[0]] }} sur {{ goal[1] }}
        </p>
        <p>
          {{ goal[1] - totalNutrients[goal[0]] }}
        </p>
      </div>
    </div>
    <div id="meals_exercices">
      <div id="meals">
        <ul
          v-for="(items, daytime) in iterableDaytimes"
          :key="daytime"
        >
          <li>
            <h3>
              {{ daytimesLabels[daytime] }} 
              <ul class="nutrients">
                <li
                  v-for="(nutri, nutriKey) in totalNutrient(items)"
                  :key="nutri"
                  :class="nutriKey"
                >
                  {{ nutri }}{{ units[nutriKey] }}
                </li>
              </ul>
            </h3>
            <ul>
              <li
                class="meal-item"
                v-for="item in items"
                :key="item.id"
              >
                <span class="circle" :class="getType(item)"></span>
                <ul>
                  <li class="energy">{{ item.nutrient.energy }}kcal</li>
                  <li class="protein">{{ item.nutrient.protein }}g</li>
                  <li class="fat">{{ item.nutrient.fat }}g</li>
                  <li class="carb">{{ item.nutrient.carb }}g</li>
                </ul>
                <span>
                  {{ item.serving_quantity }} {{ item.serving }} - {{ item.product.name }}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div id="exercices">
        <h3>Exercices</h3>
        <ul>
          <li
            v-for="exercise in exercises"
            :key="exercise.id"
          >
            <h3>
              {{ exercise.name }} ({{exercise.duration}}min)
              <ul class="nutrients">
                <li
                  v-for="(nutri, nutriKey) in totalExercicesNutrients"
                  :key="nutri"
                  :class="nutriKey"
                >
                  {{ nutri }}{{ units[nutriKey] }}
                </li>
              </ul>
            </h3>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dayjs from "dayjs";

export default {
  name: 'HomeView',
  components: {
    
  },
  data() {
    return {
      goals: {},
      items: [],
      exercises: [],
      goalsLabels: {
        energy: "Calories",
        protein: "Protéines",
        fat: "Lipides",
        carb: "Glucides",
        step: "Marche",
      },
      daytimesLabels: {
        breakfast: "Petit déjeuner",
        lunch: "Déjeuner",
        snack: "Snack",
        diner: "Diner",
      },
      units: {
        energy: "kcal",
        protein: "g",
        fat: "g",
        carb: "g",
        step: "pas",
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
    currentDate: {
      get() {
        return dayjs(this.$store.getters.currentDate).format('YYYY-MM-DD');
      },
      set(date) {
        this.$store.commit("setCurrentDate", date);
        this.getInfos();
      }
    },
    goalsWithExercises() {
      const goalsWithExercises = {...this.goals};
      
      Object.entries(this.totalExercicesNutrients).forEach(([key, val]) => {
        goalsWithExercises[key] += val
      })

      return Object.entries(goalsWithExercises);
    },
    iterableDaytimes() {
      const daytimes = {
        breakfast: [],
        lunch: [],
        snack: [],
        diner: [],
      };

      this.items.forEach((item) => {
        daytimes[item.daytime].push(item);
      })

      return daytimes;
    },
    totalNutrients() {
      const total = {
        energy: 0,
        protein: 0,
        fat: 0,
        carb: 0,
      }
      this.items.forEach((item) => {
        total.energy += item.nutrient.energy
        total.protein += item.nutrient.protein
        total.fat += item.nutrient.fat
        total.carb += item.nutrient.carb
      })
      return total;
    },
    totalExercicesNutrients() {
      let totalEnergy = 0
      this.exercises.forEach((e) => totalEnergy += e.energy)
      totalEnergy = Math.round(totalEnergy)

      // 1g P or 1g G = 4kcal
      // 1g L = 9kcal 

      return {
        energy: totalEnergy,
        protein: Math.round((totalEnergy * (this.user.diet.protein_percentage / 100))/4),
        carb: Math.round((totalEnergy * (this.user.diet.carb_percentage / 100))/4),
        fat: Math.round((totalEnergy * (this.user.diet.fat_percentage / 100))/9),
      }
    }
  },
  mounted() {
    this.getInfos();
  },
  methods: {
    getInfos() {
      this.getGoals();
      this.getConsumedItems();
      this.getExercises();
    },
    getType(item) {
      if (item.nutrient.protein > item.nutrient.fat && item.nutrient.protein > item.nutrient.carb) {
        return "protein"
      }

      if (item.nutrient.fat > item.nutrient.protein && item.nutrient.fat > item.nutrient.carb) {
        return "fat"
      }

      if (item.nutrient.carb > item.nutrient.protein && item.nutrient.carb > item.nutrient.fat) {
        return "carb"
      }
    },
    displayNutrient(n) {
      return `${n.protein} P / ${n.carb} G / ${n.fat} L`;
    },
    totalNutrient(items) {
      const total = {
        energy: 0,
        protein: 0,
        fat: 0,
        carb: 0,
      }
      items.forEach((item) => {
        total.energy += item.nutrient.energy
        total.protein += item.nutrient.protein
        total.fat += item.nutrient.fat
        total.carb += item.nutrient.carb
      })
      return total;
    },
    getGoals() {
      this.$store.dispatch("goals")
        .then((goals) => {
          this.goals = {
            energy: Math.round(goals["energy.energy"]),
            protein: Math.round(goals["nutrient.protein"]),
            fat: Math.round(goals["nutrient.fat"]),
            carb: Math.round(goals["nutrient.carb"]),
            // step: Math.round(goals["activity.step"]),
          }
        })
    },
    getConsumedItems() {
      this.$store.dispatch("consumedItemsWithProductInfos")
        .then((items) => {
          this.items = items;
        })
    },
    getExercises() {
      this.$store.dispatch("exercises")
        .then((exercises) => {
          this.exercises = exercises.training;
        })
    },
  }
}
</script>

<style lang="scss">
@use "@/assets/variables.scss" as var;

#home {
  .content {
    display: flex;
    padding: 0 2rem;
    justify-content: center;
    gap: 1rem;

    > div {
      border: 1px solid var.$medium-grey;
      background: var.$light-grey;
      border-radius: 1rem;
      padding: 1rem;
      text-align: center;
      min-width: 140px;
      min-height: 140px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
      p {
        margin: 0;
      }
    }
  }

  h3 {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 1rem;
    ul {
      list-style: none;
      display: flex;
      gap: 1rem;
      align-items: center;
      li {
        border: 1px solid black;
        border-radius: 1rem;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
      }
    }
  }

  .meal-item {
    display: flex;
    ul {
      list-style: none;
      display: flex;
      gap: 0.5rem;
      padding: 0;
      margin-right: 1rem;
    }
    
    li {
      background: none !important;
      border: none !important;
      text-align: center;
      &:first-child {
        width: 4rem;
      }
      width: 2.5rem;
    }
    .protein {
      color: #48aaf4;
    }
    .fat {
      color: #ea2463;
    }
    .carb {
      color: #f6c10a;
    }
  }

  .protein {
    background: rgba(#48aaf4, 0.2) !important;
    border-color: #48aaf4 !important;
  }
  .fat {
    background: rgba(#ea2463, 0.2) !important;
    border-color: #ea2463 !important;
  }
  .carb {
    background: rgba(#f6c10a, 0.2) !important;
    border-color: #f6c10a !important;
  }
  .energy {
    border: 1px solid var.$medium-grey;
    background: var.$light-grey;
  }
}

.circle {
  width: 1rem;
  height: 1rem;
}

#meals_exercices {
  display: flex;
  margin-top: 2rem;
  > div {
    flex: 1
  } 
}

#exercices h3 {
  flex-direction: row;
}

#current_date {
  border: 1px solid var.$medium-grey;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
</style>
