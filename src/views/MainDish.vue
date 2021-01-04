<template>
  <div>
    <show-recipe-dialog
      v-if="dialog"
      :recipe-id="id"
      @closeDialog="closeDialog"
    />
    <v-card>
      <v-data-table :headers="headers" :items="recipes" :search="search">
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Hauptspeisen</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
            <v-spacer />
            <v-btn @click.stop="createNewRecipe" small color="info"
              >Rezept-Eintrag erstellen</v-btn
            >
          </v-toolbar>
        </template>
        <template #item.id="{ item }">
          <v-btn @click.stop="updateShowRecipe(item.id)" small color="info"
            >Rezept anzeigen</v-btn
          >
          <v-btn @click="deleteRecipe(item.id)" small color="info" class="ml-2"
            >Rezept löschen</v-btn
          >
        </template>
      </v-data-table>
    </v-card>
    <snack
      v-if="showSnack.state"
      :info-type="showSnack.type"
      :message="showSnack.msg"
      @closeSnackBar="showSnack.state = false"
    />
  </div>
</template>

<script>
import { mainDishCollectionRef } from "../firebase";
import showRecipeDialog from "../components/MainDishDialog";
import snack from "../components/SnackBar";
export default {
  components: {
    showRecipeDialog,
    snack
  },
  data: () => ({
    showSnack: {
      state: false,
      type: "success",
      msg: ""
    },
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
    closeDialog(fromAction) {
      this.id = "";
      this.dialog = false;
      this.showSnack.msg = "Rezept erstellt / aktualisiert!";
      this.showSnack.type = "success";
      this.showSnack.state = fromAction !== "abort";
      this.getRecipeEntries();
    },
    // Delete recipes
    async deleteRecipe(recipeId) {
      this.showSnack.state = false;
      const confirmation = confirm(
        "Sind Sie sich sicher dass Sie dieses Rezept löschen wollen?"
      );
      if (confirmation) {
        await mainDishCollectionRef
          .doc(recipeId)
          .delete()
          .then(function() {
            console.log("Document successfully deleted!");
          })
          .catch(function(error) {
            console.error("Error removing document: ", error);
          });
        this.showSnack.msg = "Rezept gelöscht!";
        this.showSnack.type = "info";
        this.showSnack.state = true;
        this.getRecipeEntries();
      }
    }
  }
};
</script>
