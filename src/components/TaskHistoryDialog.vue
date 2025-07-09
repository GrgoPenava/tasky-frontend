<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowUpDown } from "lucide-vue-next";
import ApiService from "@/services/ApiService";

interface TaskHistory {
  id: string;
  taskId: string;
  userId: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

interface Props {
  open: boolean;
  taskId: string | null | undefined;
  taskTitle: string | undefined;
}

interface Emits {
  (e: "update:open", value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const history = ref<TaskHistory[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const sortField = ref<keyof TaskHistory>("createdAt");
const sortDirection = ref<"asc" | "desc">("desc");
const filterField = ref<string>("none");
const filterValue = ref<string>("");

const filteredHistory = computed(() => {
  let result = [...history.value];

  if (filterField.value && filterValue.value) {
    const value = filterValue.value.toLowerCase();

    if (filterField.value === "user") {
      result = result.filter(
        (item) =>
          item.user?.fullName?.toLowerCase().includes(value) ||
          item.user?.email?.toLowerCase().includes(value)
      );
    } else if (filterField.value === "field") {
      result = result.filter((item) =>
        item.fieldChanged.toLowerCase().includes(value)
      );
    } else if (filterField.value === "value") {
      result = result.filter(
        (item) =>
          (item.oldValue?.toLowerCase() || "").includes(value) ||
          (item.newValue?.toLowerCase() || "").includes(value)
      );
    }
  }

  result.sort((a, b) => {
    let valA: any = a[sortField.value];
    let valB: any = b[sortField.value];

    if (sortField.value === "createdAt") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (sortField.value === "user") {
      valA = a.user?.fullName || a.user?.email || "";
      valB = b.user?.fullName || b.user?.email || "";
    }

    if (sortDirection.value === "asc") {
      return valA < valB ? -1 : valA > valB ? 1 : 0;
    } else {
      return valA > valB ? -1 : valA < valB ? 1 : 0;
    }
  });

  return result;
});

const fetchTaskHistory = async (taskId: string) => {
  if (!taskId) return;

  isLoading.value = true;
  error.value = null;

  try {
    const response = await ApiService.get<TaskHistory[]>(
      `/tasks/${taskId}/history`
    );
    history.value = response;
  } catch (err: any) {
    console.error("Error fetching task history:", err);
    error.value = err.message || "Failed to load task history";
  } finally {
    isLoading.value = false;
  }
};

const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

const copyToClipboard = (text: string) => {
  if (!text || text === "-") return;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Vrijednost kopirana u međuspremnik!");
    })
    .catch((err) => {
      console.error("Greška pri kopiranju:", err);
    });
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toggleSort = (field: keyof TaskHistory) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "desc";
  }
};

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.taskId) {
      fetchTaskHistory(props.taskId);
    } else if (!isOpen) {
      history.value = [];
      filterField.value = "none";
      filterValue.value = "";
      error.value = null;
      sortField.value = "createdAt";
      sortDirection.value = "desc";
    }
  }
);

onMounted(() => {
  if (props.open && props.taskId) {
    fetchTaskHistory(props.taskId);
  }
});
</script>

<template>
  <Dialog v-if="open" :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[95%] max-h-[90vh] overflow-auto">
      <DialogHeader>
        <DialogTitle>Povijest zadatka: {{ taskTitle }}</DialogTitle>
        <DialogDescription
          >Pregled svih promjena napravljenih na zadatku</DialogDescription
        >
      </DialogHeader>

      <div class="py-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Select v-model="filterField">
              <SelectTrigger class="w-[150px]">
                <SelectValue placeholder="Filtriraj po..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Bez filtera</SelectItem>
                <SelectItem value="user">Korisniku</SelectItem>
                <SelectItem value="field">Polju</SelectItem>
                <SelectItem value="value">Vrijednosti</SelectItem>
              </SelectContent>
            </Select>
            <Input
              v-if="filterField && filterField !== 'none'"
              v-model="filterValue"
              placeholder="Unesite vrijednost..."
              class="w-[250px]"
            />
          </div>
        </div>

        <div v-if="isLoading" class="flex justify-center my-8">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <div v-else-if="error" class="text-center text-destructive my-8">
          <p>{{ error }}</p>
          <Button class="mt-4" @click="fetchTaskHistory(props.taskId!)">
            Pokušaj ponovno
          </Button>
        </div>

        <div v-else-if="history.length === 0" class="text-center my-8">
          <p class="text-muted-foreground">
            Nema dostupne povijesti za ovaj zadatak.
          </p>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead
                class="cursor-pointer"
                @click="toggleSort('createdAt')"
              >
                <div class="flex items-center">
                  Vrijeme
                  <ArrowUpDown
                    class="ml-2 h-4 w-4"
                    :class="{
                      'text-primary': sortField === 'createdAt',
                      'rotate-180':
                        sortField === 'createdAt' && sortDirection === 'asc',
                    }"
                  />
                </div>
              </TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('user')">
                <div class="flex items-center">
                  Korisnik
                  <ArrowUpDown
                    class="ml-2 h-4 w-4"
                    :class="{
                      'text-primary': sortField === 'user',
                      'rotate-180':
                        sortField === 'user' && sortDirection === 'asc',
                    }"
                  />
                </div>
              </TableHead>
              <TableHead
                class="cursor-pointer"
                @click="toggleSort('fieldChanged')"
              >
                <div class="flex items-center">
                  Promijenjeno polje
                  <ArrowUpDown
                    class="ml-2 h-4 w-4"
                    :class="{
                      'text-primary': sortField === 'fieldChanged',
                      'rotate-180':
                        sortField === 'fieldChanged' && sortDirection === 'asc',
                    }"
                  />
                </div>
              </TableHead>
              <TableHead>Stara vrijednost</TableHead>
              <TableHead>Nova vrijednost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="item in filteredHistory" :key="item.id">
              <TableCell>{{ formatDate(item.createdAt) }}</TableCell>
              <TableCell>{{
                item.user?.fullName || item.user?.email || "Nepoznat korisnik"
              }}</TableCell>
              <TableCell>
                <span class="capitalize">{{ item.fieldChanged }}</span>
              </TableCell>
              <TableCell
                class="cursor-pointer hover:bg-muted/50 transition-colors"
                :title="item.oldValue || '-'"
                @click="copyToClipboard(item.oldValue)"
              >
                <span class="text-muted-foreground">{{
                  truncateText(item.oldValue)
                }}</span>
              </TableCell>
              <TableCell
                class="cursor-pointer hover:bg-muted/50 transition-colors"
                :title="item.newValue || '-'"
                @click="copyToClipboard(item.newValue)"
              >
                <span>{{ truncateText(item.newValue) }}</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div class="text-sm text-muted-foreground mt-2 text-center">
          <p>Kliknite na vrijednost da je kopirate u međuspremnik</p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Zatvori
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
