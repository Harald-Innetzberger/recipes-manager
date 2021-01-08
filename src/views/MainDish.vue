<template>
  <div>
    <show-recipe-dialog
      v-if="dialog"
      :recipe-id="id"
      @closeDialog="closeDialog"
    />
    <v-card>
      <v-data-table :headers="headers" :items="recipes" :search="search" :loading="loading">
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Hauptspeisen</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              single-line
              hide-details
              clearable
            />
            <v-spacer />
            <v-btn @click.stop="createNewRecipe" small
              >Rezept-Eintrag erstellen</v-btn
            >
          </v-toolbar>
        </template>
        <template #item.id="{ item }">
          <v-btn @click.stop="updateShowRecipe(item.id)" small
            >Rezept anzeigen</v-btn
          >
          <v-btn @click="deleteRecipe(item.id)" small class="ml-2"
            >Rezept löschen</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mainDishCollectionRef } from "../firebase";
import showRecipeDialog from "../components/MainDishDialog";
export default {
  components: {
    showRecipeDialog
  },
  data: () => ({
    dialog: false,
    loading: true,
    search: "",
    headers: [
      {
        text: "Rezept-Titel",
        align: "start",
        value: "title"
      },
      {
        text: "",
        align: "right",
        sortable: false,
        value: "id"
      }
    ],
    recipes: [],
    id: ""
  }),
  created() {
    this.getRecipeEntries();
  },
  methods: {
    // get all main dish recipes
    async getRecipeEntries() {
      let data = [];
      await mainDishCollectionRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          data.push({ id: doc.id, title: doc.data().title });
        });
      });
      this.recipes = data;
      this.loading = false;
    },
    updateShowRecipe(recipeId) {
      this.id = recipeId;
      this.dialog = true;
    },
    createNewRecipe() {
      this.dialog = true;
    },
    closeDialog() {
      this.id = "";
      this.dialog = false;
      this.getRecipeEntries();
    },
    // Delete recipes
    async deleteRecipe(recipeId) {
      const confirmation = confirm(
        "Sind Sie sich sicher dass Sie dieses Rezept löschen wollen?"
      );
      if (confirmation) {
        try {
          await mainDishCollectionRef.doc(recipeId).delete();
          this.$store.dispatch("snackbar/setSnack", [
            "Rezept gelöscht.",
            "success"
          ]);
          this.getRecipeEntries();
        } catch (e) {
          this.$store.dispatch("snackbar/setSnack", [
            e.message,
            "success"
          ]);
        }
      }
    }
  }
};
</script>
