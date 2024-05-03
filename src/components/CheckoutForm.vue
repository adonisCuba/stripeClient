<template>
  <main>
    <h1>Pagando</h1>
    <form id="payment-form" @submit.prevent="handleSubmit">
      <div id="link-authentication-element" />
      <div id="payment-element" />
      <button id="submit" :disabled="isLoading">
        Pay now
      </button>
      <div v-for="message in messages" :key="message">{{ message }}</div>
    </form>
  </main>
</template>
<script>
import { paymentIntent } from '@/services/payment.service';
import { loadStripe } from '@stripe/stripe-js';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const isLoading = ref(false);
    const messages = ref([]);

    let stripe;
    let elements;

    onMounted(async () => {
      //TODO: Reemplazar por la llave publica desde el fichero .env
      const publishableKey = "pk_test_51P4AlIKO0wXjWVYfLq64kdq5fLxUouEUOhuscaGy3em1r8l0xxwR4Fp3GPQmI0NgZmBnmINjhRSnPsKiH1svwqvP00lhs4SHUA";
      stripe = await loadStripe(publishableKey);

      //TODO: Remplazar por la llamada al backend
      const { client_secret, error: backendError } = await paymentIntent();

      if (backendError) {
        messages.value.push(backendError.message);
      }
      messages.value.push(`Client secret returned.`);

      elements = stripe.elements({ clientSecret: client_secret });
      const paymentElement = elements.create('payment');
      paymentElement.mount("#payment-element");
      const linkAuthenticationElement = elements.create("linkAuthentication");
      linkAuthenticationElement.mount("#link-authentication-element");
      isLoading.value = false;
    });

    const handleSubmit = async () => {
      if (isLoading.value) {
        return;
      }

      isLoading.value = true;

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/about`
        }
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        messages.value.push(error.message);
      } else {
        messages.value.push("An unexpected error occured.");
      }

      isLoading.value = false;
    };
    return {
      handleSubmit,
      isLoading,
      messages
    }
  },
}
</script>