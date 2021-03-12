import { v4 as uuidv4 } from "uuid";

export const state = () => ({
  fooddata: [],
  cart: []
});

export const getters = {
  cartCount: state => {
    if (!state.cart.length) return 0;
    return state.cart.reduce((ac, next) => ac + +next.count, 0);
  },
  totalPrice: state => {
    if (!state.cart.length) return 0;
    return state.cart.reduce((ac, next) => ac + +next.combinedPrice, 0);
  }
};

// mutation can only change the state
export const mutations = {
  updateFoodData: (state, data) => {
    state.fooddata = data;
  },
  addToCart: (state, formOutput) => {
    formOutput.id = uuidv4();
    state.cart.push(formOutput);
  }
};

// actions can change the state, can commit mutation. it's good for async logic
export const actions = {
  async getFoodData({ state, commit }) {
    if (state.fooddata.length) return;

    try {
      await fetch(
        "https://dva9vm8f1h.execute-api.us-east-2.amazonaws.com/production/restaurants",
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.AWS_API_KEY
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          console.log(data);
          commit("updateFoodData", data);
        });
    } catch (error) {
      console.log(error);
    }
  }
};
