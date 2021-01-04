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
            <v-btn icon dark @click="closeDialog('abort')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text class="mt-8">
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form @submit.prevent="save">
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
              <v-btn
                v-if="recipeId !== ''"
                :disabled="invalid"
                color="success"
                @click="update"
                >Aktualisieren</v-btn
              >
              <v-btn v-else :disabled="invalid" color="success" @click="save"
                >Speichern</v-btn
              >
              <v-btn class="ml-2" color="success" @click="closeDialog('abort')"
                >Abbrechen</v-btn
              >
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
      created_at: Date.now()
    }
  }),
  created() {
    this.recipeId !== "" ? this.getRecipeData() : "";
  },
  methods: {
    async getRecipeData() {
      const docRef = await mainDishCollectionRef.doc(this.recipeId);
      this.formFields = await docRef
        .get()
        .then(function(doc) {
          return doc.exists ? doc.data() : console.log("No such document!");
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    },
    adaptDate(ts) {
      // return ts !== "" ? ts.toDate() : "";
      console.log(ts);
    },
    async update() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        // Update a document.
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
        this.closeDialog("update");
      }
    },
    async save() {
      const valid = await this.$refs.observer.validate();
      if (valid) {
        // Add a new document with a firestore auto generated id.
        const newDocRef = await mainDishCollectionRef.doc();
        await newDocRef.set(this.formFields);
        this.closeDialog("create");
      }
    },
    closeDialog(fromAction) {
      this.$emit("closeDialog", fromAction);
    }
  }
};
</script>
