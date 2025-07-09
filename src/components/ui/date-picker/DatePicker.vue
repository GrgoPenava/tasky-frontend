<script setup lang="ts">
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateFormatter, getLocalTimeZone } from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import { ref, watch, onMounted } from "vue";

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const props = defineProps<{
  modelValue?: any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const localValue = ref<any>(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== localValue.value) {
      console.log("DatePicker: Parent value changed:", newValue);
      localValue.value = newValue;
    }
  }
);

watch(localValue, (newValue) => {
  console.log("DatePicker: Local value changed:", newValue);
  emit("update:modelValue", newValue);
});

onMounted(() => {
  console.log("DatePicker mounted, initial value:", props.modelValue);
});
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[180px] justify-start text-left font-normal',
            !localValue && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{
          localValue
            ? df.format(localValue.toDate(getLocalTimeZone()))
            : "Pick a date"
        }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar v-model="localValue" initial-focus />
    </PopoverContent>
  </Popover>
</template>
