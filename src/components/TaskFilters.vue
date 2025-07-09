<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "@/components/ui/date-picker/DatePicker.vue";
import {
  type DateValue,
  parseDate,
  getLocalTimeZone,
} from "@internationalized/date";
import {
  FilterIcon,
  ArrowDownUp,
  UserRound,
  Calendar,
  ListFilter,
  X,
} from "lucide-vue-next";
import moment from "moment";

export interface TaskFiltersState {
  assignedTo: string | null;
  startDate: string | null;
  endDate: string | null;
  priority: number | null;
  sortBy: "dueDate" | "createdAt" | "priority" | null;
  sortDirection: "asc" | "desc";
}

interface Props {
  teamMembers: any[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "filter-change", filters: TaskFiltersState): void;
}>();

const filters = ref<TaskFiltersState>({
  assignedTo: null,
  startDate: null,
  endDate: null,
  priority: null,
  sortBy: null,
  sortDirection: "desc",
});

const startDateValue = ref<DateValue | null>(null);
const endDateValue = ref<DateValue | null>(null);

const isFiltersOpen = ref(false);

watch(startDateValue, (newDate) => {
  if (newDate) {
    const jsDate = newDate.toDate(getLocalTimeZone());
    filters.value.startDate = moment(jsDate).format("YYYY-MM-DD");
  } else {
    filters.value.startDate = null;
  }
});

watch(endDateValue, (newDate) => {
  if (newDate) {
    const jsDate = newDate.toDate(getLocalTimeZone());
    filters.value.endDate = moment(jsDate).format("YYYY-MM-DD");
  } else {
    filters.value.endDate = null;
  }
});

watch(
  filters,
  () => {
    emit("filter-change", { ...filters.value });
  },
  { deep: true }
);

const hasActiveFilters = computed(() => {
  return (
    filters.value.assignedTo !== null ||
    filters.value.startDate !== null ||
    filters.value.endDate !== null ||
    filters.value.priority !== null
  );
});

const hasActiveSorting = computed(() => {
  return filters.value.sortBy !== null;
});

const resetFilters = () => {
  filters.value = {
    assignedTo: null,
    startDate: null,
    endDate: null,
    priority: null,
    sortBy: null,
    sortDirection: "desc",
  };
  startDateValue.value = null;
  endDateValue.value = null;
};

const toggleSortDirection = () => {
  filters.value.sortDirection =
    filters.value.sortDirection === "asc" ? "desc" : "asc";
};

const setCurrentWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const monday = new Date(now.setDate(diff));
  const sunday = new Date(now);
  sunday.setDate(monday.getDate() + 6);

  startDateValue.value = parseDate(moment(monday).format("YYYY-MM-DD"));
  endDateValue.value = parseDate(moment(sunday).format("YYYY-MM-DD"));
};

const setCurrentMonth = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  startDateValue.value = parseDate(moment(firstDay).format("YYYY-MM-DD"));
  endDateValue.value = parseDate(moment(lastDay).format("YYYY-MM-DD"));
};
</script>

<template>
  <div class="task-filters flex items-center justify-between mb-4">
    <div class="flex items-center gap-2">
      <Popover v-model:open="isFiltersOpen">
        <PopoverTrigger as-child>
          <Button variant="outline" class="gap-2">
            <FilterIcon class="h-4 w-4" />
            <span>Filteri</span>
            <div
              v-if="hasActiveFilters"
              class="ml-1 h-2 w-2 rounded-full bg-primary"
            ></div>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-80">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h4 class="font-medium">Filteri zadataka</h4>
              <Button
                v-if="hasActiveFilters"
                variant="ghost"
                size="sm"
                class="h-8 px-2 text-xs"
                @click="resetFilters"
              >
                <X class="h-3 w-3 mr-1" />
                Resetiraj
              </Button>
            </div>

            <div class="space-y-2">
              <Label for="assignedTo">Dodijeljeno</Label>
              <Select v-model="filters.assignedTo">
                <SelectTrigger>
                  <SelectValue placeholder="Svi članovi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Svi članovi</SelectItem>
                  <SelectItem value="none">Nije dodijeljeno</SelectItem>
                  <SelectItem
                    v-for="member in props.teamMembers"
                    :key="member.userId"
                    :value="member.userId"
                  >
                    <div class="flex items-center">
                      <UserRound class="w-3 h-3 mr-2" />
                      <span>{{ member.fullName || member.email }}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Vremenski period</Label>
              <div class="flex gap-2 mb-1">
                <Button
                  variant="outline"
                  size="sm"
                  class="text-xs h-7"
                  @click="setCurrentWeek"
                >
                  Ovaj tjedan
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="text-xs h-7"
                  @click="setCurrentMonth"
                >
                  Ovaj mjesec
                </Button>
              </div>
              <div class="space-y-2">
                <div>
                  <Label for="startDate" class="text-xs">Početni datum</Label>
                  <DatePicker v-model="startDateValue" />
                </div>
                <div>
                  <Label for="endDate" class="text-xs">Završni datum</Label>
                  <DatePicker v-model="endDateValue" />
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label for="priority">Prioritet</Label>
              <Select v-model="filters.priority">
                <SelectTrigger>
                  <SelectValue placeholder="Svi prioriteti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Svi prioriteti</SelectItem>
                  <SelectItem value="1">
                    <div class="flex items-center">
                      <span
                        class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"
                      ></span>
                      <span>Low (P1)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div class="flex items-center">
                      <span
                        class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"
                      ></span>
                      <span>Medium (P2)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div class="flex items-center">
                      <span
                        class="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"
                      ></span>
                      <span>High (P3)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div class="flex items-center">
                      <span
                        class="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"
                      ></span>
                      <span>Critical (P4)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Select v-model="filters.sortBy">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Sortiraj po..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="null">Bez sortiranja</SelectItem>
          <SelectItem value="dueDate">Rok (Due Date)</SelectItem>
          <SelectItem value="createdAt">Datum kreiranja</SelectItem>
          <SelectItem value="priority">Prioritet</SelectItem>
        </SelectContent>
      </Select>

      <Button
        v-if="hasActiveSorting"
        variant="ghost"
        size="icon"
        @click="toggleSortDirection"
      >
        <ArrowDownUp
          :class="{
            'transform rotate-180': filters.sortDirection === 'asc',
          }"
          class="h-4 w-4"
        />
      </Button>
    </div>

    <div
      v-if="hasActiveFilters"
      class="text-sm text-muted-foreground flex gap-2"
    >
      <div v-if="filters.assignedTo" class="flex items-center gap-1">
        <UserRound class="h-3 w-3" />
        <span v-if="filters.assignedTo === 'none'">Nije dodijeljeno</span>
        <span v-else>
          {{
            props.teamMembers.find((m) => m.userId === filters.assignedTo)
              ?.fullName ||
            props.teamMembers.find((m) => m.userId === filters.assignedTo)
              ?.email ||
            "Korisnik"
          }}
        </span>
      </div>
      <div
        v-if="filters.startDate || filters.endDate"
        class="flex items-center gap-1"
      >
        <Calendar class="h-3 w-3" />
        <span>
          {{ filters.startDate || "..." }} - {{ filters.endDate || "..." }}
        </span>
      </div>
      <div v-if="filters.priority" class="flex items-center gap-1">
        <ListFilter class="h-3 w-3" />
        <span>
          {{
            filters.priority === 1
              ? "Low"
              : filters.priority === 2
              ? "Medium"
              : filters.priority === 3
              ? "High"
              : "Critical"
          }}
        </span>
      </div>
    </div>
  </div>
</template>
