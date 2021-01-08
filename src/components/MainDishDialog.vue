<template>
  <div>
    <v-dialog
      :value="true"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title>
            {{
              recipeId !== ""
                ? formFields.title
                : "Neues Rezept in Kategorie Hauptgericht erstellen"
            }}
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon dark @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="mt-8">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form @submit.prevent="create">
              <!-- Title -->
              <validation-provider
                v-slot="{ errors }"
                name="title"
                rules="required|min:3"
              >
                <v-text-field
                  v-model.trim="formFields.title"
                  label="Title"
                  :error-messages="errors"
                  required
                  outlined
                />
              </validation-provider>
              <!-- Ingredients -->
              <validation-provider
                v-slot="{ errors }"
                name="ingredients"
                rules="required|min:3"
              >
                <v-textarea
                  v-model.trim="formFields.ingredients"
                  label="Ingredients"
                  :error-messages="errors"
                  required
                  outlined
                  filled
                  auto-grow
                />
              </validation-provider>
              <!-- Preparation -->
              <validation-provider
                v-slot="{ errors }"
                name="preparation"
                rules="required|min:3"
              >
                <v-textarea
                  v-model.trim="formFields.preparation"
                  label="Preparation"
                  :error-messages="errors"
                  required
                  outlined
                  filled
                  auto-grow
                />
              </validation-provider>
              <v-row>
                <v-col cols="12" sm="6" class="caption">
                  {{
                    formFields.created_at > 0
                      ? "Erstellt: " +
                        new Date(formFields.created_at)
                          .toLocaleString()
                          .substr(0, 19)
                      : ""
                  }}
                  {{
                    formFields.updated_at > 0
                      ? " - Aktualisiert: " +
                        new Date(formFields.updated_at)
                          .toLocaleString()
                          .substr(0, 19)
                      : ""
                  }}
                </v-col>
                <v-col cols="12" sm="6" class="text-right">
                  <v-btn
                    v-if="recipeId !== ''"
                    :disabled="invalid"
                    @click="update"
                    >Aktualisieren</v-btn
                  >
                  <v-btn v-else :disabled="invalid" @click="create"
                    >Speichern</v-btn
                  >
                  <v-btn class="ml-2" @click="closeDialog">Abbrechen</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </validation-observer>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mainDishCollectionRef } from "../firebase";
import { extend } from "vee-validate";
import { required, min } from "vee-validate/dist/rules";
extend("min", {
  ...min,
  message: "Min. 3 Characters long"
});
extend("required", {
  ...required,
  message: "{_field_} can not be empty"
});
import { ValidationObserver, ValidationProvider } from "vee-validate";
export default {
  components: {
    ValidationObserver,
    ValidationProvider
  },
  props: {
    recipeId: {
      type: String,
      default: ""
    }
  },
  name: "MainDishDialog",
  data: () => ({
    formFields: {
      title: "",
      ingredients: "",
      preparation: "",
      // created_at, updated_at in seconds.
      created_at: 0,
      updated_at: 0
    }
  }),
  created() {
    this.recipeId !== "" ? this.getRecipeData() : "";
  },
  methods: {
    async getRecipeData() {
      try {
        const docRef = await mainDishCollectionRef.doc(this.recipeId);
        const recipeDoc = await docRef.get();
        this.formFields = recipeDoc.exists
          ? recipeDoc.data()
          : this.$store.dispatch("snackbar/setSnack", [
              "Dokument existiert nicht.",
              "error"
            ]);
      } catch (e) {
        this.$store.dispatch("snackbar/setSnack", [
          e.message,
          "error"
        ]);
      }
    },
    async update() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        // Update document.
        this.formFields.updated_at = Date.now();
        const updateDocRef = await mainDishCollectionRef.doc(this.recipeId);
        await updateDocRef
          .update(this.formFields)
          .then(function() {
            console.log("Document successfully updated!");
          })
          .catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
        await this.$store.dispatch("snackbar/setSnack", [
          "Rezept aktualisiert.",
          "success"
        ]);
        this.closeDialog();
      }
    },
    async create() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        // Add a new document with a firestore auto generated id.
        this.formFields.created_at = Date.now();
        const newDocRef = await mainDishCollectionRef.doc();
        await newDocRef.set(this.formFields);
        await this.$store.dispatch("snackbar/setSnack", [
          "Rezept erstellt.",
          "success"
        ]);
        this.closeDialog();
      }
    },
    closeDialog() {
      this.$emit("closeDialog");
    }
  }
};
</script>
