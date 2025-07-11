<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900">
          Create an Account
        </h1>
      </div>

      <div
        v-if="message"
        class="rounded-md p-4"
        :class="{
          'bg-red-50 text-red-700 border border-red-200': !isSuccess,
          'bg-green-50 text-green-700 border border-green-200': isSuccess,
        }"
      >
        {{ message }}
      </div>

      <Form
        @submit="handleRegister"
        class="mt-8 space-y-6"
        :validation-schema="schema"
      >
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Full Name (optional)</label
            >
            <Field
              name="name"
              type="text"
              placeholder="Enter your name"
              v-slot="{ field, errorMessage, meta }"
            >
              <Input
                v-bind="field"
                id="name"
                class="mt-1 w-full"
                :class="{ 'border-red-500': meta.touched && errorMessage }"
              />
              <p
                v-if="meta.touched && errorMessage"
                class="mt-1 text-sm text-red-600"
              >
                {{ errorMessage }}
              </p>
            </Field>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <Field
              name="email"
              type="email"
              placeholder="Enter your email"
              v-slot="{ field, errorMessage, meta }"
            >
              <Input
                v-bind="field"
                id="email"
                class="mt-1 w-full"
                :class="{ 'border-red-500': meta.touched && errorMessage }"
              />
              <p
                v-if="meta.touched && errorMessage"
                class="mt-1 text-sm text-red-600"
              >
                {{ errorMessage }}
              </p>
            </Field>
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Password</label
            >
            <Field
              name="password"
              type="password"
              placeholder="Enter your password"
              v-slot="{ field, errorMessage, meta }"
            >
              <Input
                v-bind="field"
                id="password"
                type="password"
                class="mt-1 w-full"
                :class="{ 'border-red-500': meta.touched && errorMessage }"
              />
              <p
                v-if="meta.touched && errorMessage"
                class="mt-1 text-sm text-red-600"
              >
                {{ errorMessage }}
              </p>
            </Field>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700"
              >Confirm Password</label
            >
            <Field
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              v-slot="{ field, errorMessage, meta }"
            >
              <Input
                v-bind="field"
                id="confirmPassword"
                type="password"
                class="mt-1 w-full"
                :class="{ 'border-red-500': meta.touched && errorMessage }"
              />
              <p
                v-if="meta.touched && errorMessage"
                class="mt-1 text-sm text-red-600"
              >
                {{ errorMessage }}
              </p>
            </Field>
          </div>
        </div>

        <Button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:cursor-pointer"
          :disabled="isLoading"
        >
          {{ isLoading ? "Registering..." : "Register" }}
        </Button>

        <div class="relative mt-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500">OR</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          class="w-full flex items-center justify-center gap-2 bg-[#24292e] text-white hover:bg-[#1b1f23] hover:text-white hover:cursor-pointer border-[#24292e]"
          @click="handleGithubLogin"
          :disabled="isLoading"
        >
          <svg
            viewBox="0 0 24 24"
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            />
          </svg>
          Continue with GitHub
        </Button>

        <div class="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login
          </RouterLink>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser, loginWithGithub } from "../services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, Field } from "vee-validate";
import * as yup from "yup";

const router = useRouter();
const isLoading = ref(false);
const message = ref("");
const isSuccess = ref(false);

const schema = yup.object({
  name: yup.string(),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

const handleRegister = async (values: any) => {
  message.value = "";
  isSuccess.value = false;

  try {
    isLoading.value = true;

    const response = await registerUser({
      email: values.email,
      password: values.password,
      name: values.name || undefined,
    });

    isSuccess.value = response.success;
    message.value = response.message;

    if (response.success) {
      router.push("/login");
    }
  } catch (error: any) {
    isSuccess.value = false;
    message.value = error.message || "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const handleGithubLogin = async () => {
  try {
    isLoading.value = true;
    await loginWithGithub();
  } catch (error: any) {
    message.value = "GitHub login failed. Please try again.";
    isSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};
</script>
